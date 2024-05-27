import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps, useParams } from 'react-router-dom';

import { getVideoDetail, IVideo, modifyVideoGroup } from '../../../../services/video';
import {
  Button,
  Card,
  DatePicker,
  Input,
  InputAdornment,
  InputNumber,
  Loading,
  MessagePlugin,
  Select,
  TagInput,
  Textarea,
} from 'tdesign-react';

import Style from './index.module.less';
import ImageUpload from '../../component/ImageUpload';
import { VIDEO_STATUS_OPTIONS } from '../components/consts';

const VideoDetail: React.FC<BrowserRouterProps> = () => {
  const [videoDetail, setVideoDetail] = useState<IVideo>();
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [weight, setWeight] = useState<number>();
  const [cover, setCover] = useState<File>();
  const [status, setStatus] = useState<number>();
  const { id } = useParams() || {};

  const handleFetchData = () => {
    if (!id) return;
    getVideoDetail(parseInt(id, 10)).then((res) => {
      if (res.code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setVideoDetail(res.data!);

        setTags(res.data!.tags.split(';'));
        setTitle(res.data!.title);
        setDescription(res.data!.description);
        setWeight(res.data!.weight);
        setStatus(res.data!.videoGroupStatus);
      } else {
        MessagePlugin.error(res.msg);
      }
    });
  };

  const handleSave = useCallback(
    (value: {
      title?: string;
      description?: string;
      tags?: string;
      weight?: number;
      cover?: File;
      videoGroupStatus?: number;
    }) => {
      if (!id) return;

      modifyVideoGroup({
        id: parseInt(id, 10),
        ...value,
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
        <div className={Style.cover}>
          <ImageUpload
            onChange={(value) => {
              setCover(value);
            }}
            defaultImageUrl={videoDetail?.cover}
          />
        </div>

        <div className={Style.info}>
          <InputAdornment prepend='视频标题'>
            <Input placeholder='请输入视频标题' value={title} clearable onChange={setTitle} />
          </InputAdornment>
          <InputAdornment prepend='视频描述'>
            <Textarea placeholder='请输入视频描述' value={description} onChange={setDescription} />
          </InputAdornment>
          <InputAdornment prepend='Tags'>
            <TagInput
              value={tags}
              onChange={(value) => {
                setTags(value as string[]);
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='上传者'>
            <Input disabled value={videoDetail?.uploader.nickname || '管理员'} clearable />
          </InputAdornment>
          <InputAdornment prepend='权重'>
            <InputNumber
              placeholder='请输入权重'
              value={weight?.toString()}
              onChange={(value) => {
                setWeight(value as number);
              }}
              min={0}
            />
          </InputAdornment>
          <InputAdornment prepend='播放状态'>
            <Select
              value={status}
              options={VIDEO_STATUS_OPTIONS}
              onChange={(e) => {
                setStatus(e as number);
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='创建时间'>
            <DatePicker disabled value={videoDetail?.createTime} enableTimePicker />
          </InputAdornment>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              theme='primary'
              style={{
                width: 'fit-content',
              }}
              onClick={() => {
                handleSave({
                  title: title === videoDetail?.title ? undefined : title,
                  description: description === videoDetail?.description ? undefined : description,
                  tags: tags.join(';') === videoDetail?.tags ? undefined : tags.join(';'),
                  weight: weight === videoDetail?.weight ? undefined : weight,
                  cover,
                  videoGroupStatus: status === videoDetail?.videoGroupStatus ? undefined : status,
                });
              }}
            >
              保存
            </Button>
            <Button
              theme='primary'
              style={{
                width: 'fit-content',
              }}
              onClick={() => {
                window.location.href = `/video/episode/${id}`;
              }}
            >
              修改视频分集
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(VideoDetail);
