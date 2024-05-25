import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps, useParams } from 'react-router-dom';

import { getBangumiDetail, IVideo, modifyBangumi } from '../../../../services/bangumi';
import {
  Button,
  Card,
  DatePicker,
  Input,
  InputAdornment,
  InputNumber,
  MessagePlugin,
  TagInput,
  Textarea,
  Select,
} from 'tdesign-react';

import Style from './index.module.less';
import ImageUpload from '../../component/ImageUpload';
import dayjs from "dayjs";

const BangumiDetail: React.FC<BrowserRouterProps> = () => {
  const [bangumiDetail, setBangumiDetail] = useState<IVideo>();
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [weight, setWeight] = useState<number>();
  const [cover, setCover] = useState<File>();
  const { id } = useParams() || {};
  const [releaseTime, setReleaseTime] = useState<string>();
  const [updateAtAnnouncement, setUpdateAtAnnouncement] = useState<string>();
  const [status, setStatus] = useState<number>();

  const handleFetchData = () => {
    if (!id) return;
    getBangumiDetail(parseInt(id, 10)).then((res) => {
      if (res.code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setBangumiDetail(res.data!);

        setTags(res.data!.tags.split(';'));
        setTitle(res.data!.title);
        setDescription(res.data!.description);
        setWeight(res.data!.weight);
        setReleaseTime(res.data!.releaseTime);
        setUpdateAtAnnouncement(res.data!.updateAtAnnouncement);
        setStatus(res.data!.status);
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
      releaseTime?: string;
      updateAtAnnouncement?: string;
      status?: number;
    }) => {
      if (!id) return;

      modifyBangumi({
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
    window.location.href = '/video/bangumi';
  }

  return (
    <Card>
      <div className={Style.wrapper}>
        <div className={Style.cover}>
          <ImageUpload
            onChange={(value) => {
              setCover(value);
            }}
            defaultImageUrl={bangumiDetail?.cover}
          />
        </div>

        <div className={Style.info}>
          <InputAdornment prepend='番剧标题'>
            <Input placeholder='请输入番剧标题' value={title} clearable onChange={setTitle} />
          </InputAdornment>
          <InputAdornment prepend='番剧描述'>
            <Textarea placeholder='请输入番剧描述' value={description} onChange={setDescription} />
          </InputAdornment>
          <InputAdornment prepend='Tags'>
            <TagInput
              value={tags}
              onChange={(value) => {
                setTags(value as string[]);
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='发布时间'>
            <DatePicker
              value={releaseTime}
              onPick={(value) => {
                const d = dayjs(value);
                setReleaseTime(d.format('YYYY-MM-DDTHH:mm'));
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='更新时间'>
            <DatePicker
              value={updateAtAnnouncement}
              onPick={(value) => {
                const d = dayjs(value);
                setUpdateAtAnnouncement(d.format('YYYY-MM-DDTHH:mm'));
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='番剧状态'>
            <Select
              value={status}
              onChange={(value) => {
                setStatus(value as number);
              }}
              style={{ width: '10%' }}
              options={[
                {
                  label: '连载中',
                  value: 1,
                },
                {
                  label: '已完结',
                  value: 0,
                },
              ]}
            />
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
          <InputAdornment prepend='创建时间'>
            <DatePicker disabled value={bangumiDetail?.createTime} enableTimePicker />
          </InputAdornment>
          <Button
            theme='primary'
            style={{
              margin: '20px 0',
              padding: '0 20px',
              width: 'fit-content',
            }}
            onClick={() => {
              handleSave({
                title: title === bangumiDetail?.title ? undefined : title,
                description: description === bangumiDetail?.description ? undefined : description,
                tags: tags.join(';') === bangumiDetail?.tags ? undefined : tags.join(';'),
                weight: weight === bangumiDetail?.weight ? undefined : weight,
                cover,
                releaseTime: releaseTime === bangumiDetail?.releaseTime ? undefined : releaseTime,
                updateAtAnnouncement:
                  updateAtAnnouncement === bangumiDetail?.updateAtAnnouncement ? undefined : updateAtAnnouncement,
                status: status === bangumiDetail?.status ? undefined : status,
              });
            }}
          >
            保存
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(BangumiDetail);
