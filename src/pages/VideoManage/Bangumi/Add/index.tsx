import React, { useEffect, useState } from 'react';
import { BrowserRouterProps, useParams } from 'react-router-dom';

import {
  Button,
  Card,
  DatePicker,
  Input,
  InputAdornment,
  MessagePlugin,
  Select,
  TagInput,
  Textarea,
} from 'tdesign-react';

import Style from './index.module.less';
import ImageUpload from '../../component/ImageUpload';
import dayjs from 'dayjs';
import { addBangumi } from 'services/bangumi';
import { VIDEO_STATUS_OPTIONS } from '../components/consts';

const Add: React.FC<BrowserRouterProps> = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [cover, setCover] = useState<File>();
  const [status, setStatus] = useState<number>();
  const [releaseTime, setReleaseTime] = useState<string>();
  const [updateAtAnnouncement, setUpdateAtAnnouncement] = useState<string>();
  const [videoGroupStatus, setVideoGroupStatus] = useState<number>();

  useEffect(() => {
    document.title = '添加视频';
  }, []);

  return (
    <Card>
      <div className={Style.wrapper}>
        <div className={Style.cover}>
          <ImageUpload
            onChange={(value) => {
              setCover(value);
            }}
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

          <InputAdornment prepend='番剧状态'>
            <Select
              options={[
                { label: '连载中', value: 1 },
                { label: '已完结', value: 0 },
              ]}
              value={status}
              onChange={(value) => {
                setStatus(value as number);
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='发布时间'>
            <DatePicker
              format='YYYY-MM-DD HH:mm'
              value={releaseTime}
              onChange={(value) => {
                const d = dayjs(value).format('YYYY-MM-DDTHH:mm');
                setReleaseTime(d);
              }}
              enableTimePicker
            />
          </InputAdornment>
          <InputAdornment prepend='更新时间'>
            <Input
              value={updateAtAnnouncement}
              onChange={(value) => {
                setUpdateAtAnnouncement(value);
              }}
            />
          </InputAdornment>
          <InputAdornment prepend='视频状态'>
            <Select
              options={VIDEO_STATUS_OPTIONS}
              value={videoGroupStatus}
              onChange={(value) => {
                setVideoGroupStatus(value as number);
              }}
            />
          </InputAdornment>

          <Button
            theme='primary'
            style={{
              margin: '20px 0',
              padding: '0 20px',
              width: 'fit-content',
            }}
            onClick={() => {
              if (!title) {
                MessagePlugin.error('请输入番剧标题');
                return;
              }
              if (!description) {
                MessagePlugin.error('请输入番剧描述');
                return;
              }
              if (!tags.length) {
                MessagePlugin.error('请输入番剧标签');
                return;
              }

              if (!cover) {
                MessagePlugin.error('请上传番剧封面');
                return;
              }
              if (status === undefined || status === null) {
                MessagePlugin.error('请选择番剧状态');
                return;
              }

              if (!releaseTime) {
                MessagePlugin.error('请选择番剧发布时间');
                return;
              }

              if (!updateAtAnnouncement) {
                MessagePlugin.error('请输入番剧更新时间');
                return;
              }

              if (videoGroupStatus === undefined || videoGroupStatus === null) {
                MessagePlugin.error('请选择视频状态');
                return;
              }

              addBangumi({
                title,
                description,
                tags: tags.join(';'),
                cover,
                status,
                releaseTime,
                updateAtAnnouncement,
                videoGroupStatus,
              }).then(() => {
                MessagePlugin.success('添加成功');
                window.history.back();
              });
            }}
          >
            添加
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(Add);
