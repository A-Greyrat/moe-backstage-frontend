import { httpGet, httpPost, httpPostForm } from './axios';

interface IParams {
  pageSize: number;
  page: number;
  id?: string;
  title?: string;
  status?: number;
}

export interface IVideo {
  id: string;
  title: string;
  videoGroupStatus: number;
  cover: string;
  createTime: string;
  description: string;
  tags: string;
  uploader: {
    nickname: string;
    avatar: string;
    id: string;
  };
  weight: number;
}

interface IResult {
  total: number;
  records: IVideo[];
}

export const getVideoList = async (params: IParams) =>
  httpGet<IResult>('/backstage/plain-video-group/all', { params }).then((res) => {
    if (res.code === 200) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { total, records } = res.data!;
      return {
        total,
        list: records.map((item) => ({
          id: item.id,
          name: item.title,
          status: item.videoGroupStatus,
          createTime: new Date(item.createTime).toLocaleString(),
          uploader: item.uploader,
          weight: item.weight,
          tags: item.tags.split(';'),
          cover: item.cover,
          description: item.description,
        })),
      };
    }

    return {
      total: 0,
      list: [],
    };
  });

export const deleteVideo = async (id: number) => httpPost(`/backstage/plain-video-group/delete`, { id });

export const lockVideo = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 0 });

export const unlockVideo = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 1 });

export const getVideoDetail = async (id: number) => httpGet<IVideo>(`/backstage/plain-video-group`, { params: { id } });

export const modifyVideo = async (params: {
  id: number;
  title?: string;
  description?: string;
  tags?: string;
  weight?: number;
  cover?: File;
}) => {
  const formData = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (typeof value === 'object' && value instanceof File) {
        formData.append(key, value);
        return;
      }
      formData.append(key, value.toString());
    }
  });

  return httpPostForm(`/backstage/plain-video-group/update`, formData);
};
