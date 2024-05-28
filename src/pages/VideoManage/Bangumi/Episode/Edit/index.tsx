import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps, useParams } from 'react-router-dom';

import { getEpisodeDetail, IEpisodeDetail, modifyBangumiEpisode, modifyEpisode } from 'services/video';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Input,
  InputAdornment,
  Loading,
  MessagePlugin,
  Table,
} from 'tdesign-react';

import Style from './index.module.less';
import VideoUpload from '../component/VideoUpload';
import dayjs from 'dayjs';

const Edit: React.FC<BrowserRouterProps> = () => {
  const [videoDetail, setVideoDetail] = useState<IEpisodeDetail>();
  const { id } = useParams() || {};

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadTime, setUploadTime] = useState<string>('');
  const [link, setLink] = useState<string | undefined>(undefined);
  const [isBangumiPrePublish, setIsBangumiPrePublish] = useState<boolean>(false);
  const [bangumiPrePublishTime, setBangumiPrePublishTime] = useState<string | null>(null);
  const [isBilibili, setIsBilibili] = useState<boolean>(false);
  const [src, setSrc] = useState<
    {
      srcName: string;
      src: string;
      size?: number;
    }[]
  >();

  const handleFetchData = () => {
    if (!id) return;
    getEpisodeDetail(parseInt(id, 10)).then((res) => {
      if (res.code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setVideoDetail(res.data!);

        for (let i = 0; i < (res.data!.src.length || 0); i++) {
          fetch(res.data!.src[i].src, {
            method: 'HEAD',
          })
            .then((res) => {
              if (res.headers.get('content-length')) {
                return parseInt(res.headers.get('content-length') || '0', 10);
              }
              return 0;
            })
            .then((size) => {
              setSrc((prev) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const newSrc = [...prev];
                newSrc[i].size = size;
                return newSrc;
              });
            });
        }

        setTitle(res.data!.title);
        setDescription(res.data!.description);
        setDescription(res.data!.description);
        setUploadTime(res.data!.uploadTime);
        setSrc(res.data!.src);
        setIsBangumiPrePublish(res.data!.willUpdateTime !== null);
        setBangumiPrePublishTime(res.data!.willUpdateTime);
      } else {
        MessagePlugin.error(res.msg);
      }
    });
  };

  const handleSave = useCallback(
    (value: { title?: string; link?: string; isBangumiPrePublish: boolean; bangumiPrePublishTime: string | null }) => {
      if (!id) return;
      const d = dayjs(bangumiPrePublishTime).format('YYYY-MM-DDTHH:mm:ss');

      modifyBangumiEpisode({
        id: parseInt(id, 10),
        title: value.title,
        link: value.link,
        videoStatusWillBe: isBangumiPrePublish ? 3 : 1,
        videoPublishTime: isBangumiPrePublish ? d : undefined,
      }).then((res) => {
        if (res.code === 200) {
          MessagePlugin.success('修改成功');
          handleFetchData();
        } else {
          MessagePlugin.error(res.msg);
        }
      });
    },
    [],
  );

  useEffect(() => {
    handleFetchData();
  }, []);

  if (!id) {
    window.location.href = '/video/group';
  }

  if (!videoDetail) {
    return (
      <Card
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <div className={Style.wrapper}>
        <div className={Style.info}>
          <InputAdornment prepend='分集标题'>
            <Input placeholder='请输入分集标题' value={title} clearable onChange={setTitle} />
          </InputAdornment>
          <InputAdornment prepend='上传时间'>
            <DatePicker disabled value={uploadTime} enableTimePicker />
          </InputAdornment>
          <InputAdornment prepend='是否预发布'>
            <Checkbox
              style={{
                marginLeft: '10px',
              }}
              checked={isBangumiPrePublish}
              onChange={setIsBangumiPrePublish}
            />
          </InputAdornment>
          {isBangumiPrePublish && (
            <InputAdornment prepend='预发布时间'>
              <DatePicker
                value={bangumiPrePublishTime || undefined}
                onChange={(value) => {
                  setBangumiPrePublishTime(value as string);
                }}
                enableTimePicker
              />
            </InputAdornment>
          )}
          <Table
            rowKey='index'
            data={src}
            columns={[
              {
                title: '视频源名称',
                colKey: 'srcName',
              },
              {
                title: '视频源地址',
                colKey: 'src',
                ellipsis: true,
              },
              {
                title: '视频大小',
                colKey: 'size',
                cell: (row) =>
                  src?.[row.rowIndex].size
                    ? `${((src[row.rowIndex].size || 0) / 1024 / 1024).toFixed(2)}MB`
                    : '获取中...',
              },
            ]}
          />

          <InputAdornment prepend='添加B站视频'>
            <Checkbox
              style={{
                marginLeft: '10px',
              }}
              checked={isBilibili}
              onChange={setIsBilibili}
            />
          </InputAdornment>

          {isBilibili && (
            <InputAdornment prepend='B站BV号'>
              <Input placeholder='请输入BV号' value={link} clearable onChange={setLink} />
            </InputAdornment>
          )}

          {!isBilibili && (
            <>
              <p
                style={{
                  margin: 0,
                  color: '#333',
                  padding: 0,
                  fontSize: '16px',
                }}
              >
                更换视频源
              </p>
              <VideoUpload setLink={setLink} />
            </>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              theme='primary'
              style={{
                width: 'fit-content',
              }}
              onClick={() => {
                handleSave({
                  title: title === videoDetail.title ? undefined : title,
                  link,
                  isBangumiPrePublish,
                  bangumiPrePublishTime,
                });
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(Edit);
