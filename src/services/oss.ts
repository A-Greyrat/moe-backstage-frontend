import { httpGet, httpPostForm } from './axios';
import OSS from 'ali-oss';
import { getUserInfo } from './login';
import { showMessage } from '@natsume_shiki/mika-ui';

export interface OssToken {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  endpoint: string;
}

export const getOssToken = async (filename: string) =>
  httpGet<OssToken>('/common/get-ali-upload-sts', {
    params: {
      hash: filename,
    },
  });

export const uploadFileToOss = async (file: File, onProgress: (progress: number) => void) => {
  const user = await getUserInfo();
  if (!user) {
    showMessage({ children: '请先登录' });
    return;
  }

  const path = `tmp/user${user.userId}/`;
  let fileName = encodeURIComponent(`${Date.now()}-${file.name}`);

  const ossTokenRes = await getOssToken(fileName);
  fileName = path + fileName;

  if (ossTokenRes.code !== 200) {
    throw new Error(ossTokenRes.msg);
  }

  const ossToken = ossTokenRes.data!;

  const client = new OSS({
    accessKeyId: ossToken.accessKeyId,
    accessKeySecret: ossToken.accessKeySecret,
    stsToken: ossToken.securityToken,
    secure: true,
    endpoint: ossToken.endpoint,
    bucket: 'moeee',
  });

  await client.multipartUpload(fileName, file, {
    progress: (percentage: number) => {
      onProgress(percentage * 100);
    },
  });

  // eslint-disable-next-line consistent-return
  return fileName;
};

export const uploadImg = async (file: File) => {
  const data = new FormData();
  data.append('file', file);
  return httpPostForm('/common/upload-image', data).then((res) => {
    if (res.code === 200) {
      return res.data;
    }
    throw new Error(res.msg);
  });
};
