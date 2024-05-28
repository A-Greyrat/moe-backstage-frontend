import React, { useEffect, useState } from 'react';
import { BrowserRouterProps, useParams } from 'react-router-dom';

import { addEpisode } from 'services/video';
import {
  Button,
  Card,
  Checkbox,
  Input,
  InputAdornment,
  InputNumber,
  MessagePlugin,
  TagInput,
  Textarea,
} from 'tdesign-react';

import Style from './index.module.less';
import VideoUpload from '../component/VideoUpload';

const Add: React.FC<BrowserRouterProps> = () => {
  const { id } = useParams() || {};
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('Null');
  const [link, setLink] = useState<string | undefined>(undefined);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const [isBilibili, setIsBilibili] = useState<boolean>(false);

  useEffect(() => {
    document.title = '添加视频';
  }, []);

  if (!id) {
    window.location.href = '/video/group';
  }

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <InputAdornment prepend='分集标题'>
          <Input placeholder='请输入分集标题' value={title} clearable onChange={setTitle} />
        </InputAdornment>

        <InputAdornment prepend='分集集数'>
          <InputNumber
            placeholder='请输入分集集数'
            value={index}
            min={1}
            onChange={(value) => {
              setIndex(Number(value));
            }}
          />
        </InputAdornment>

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
          <div>
            <p
              style={{
                fontSize: '16px',
                color: '#333',
                margin: '5px 0',
              }}
            >
              添加视频
            </p>
            <VideoUpload setLink={setLink} />
          </div>
        )}

        <Button
          theme='primary'
          style={{
            width: 'fit-content',
          }}
          onClick={() => {
            if (!id) {
              MessagePlugin.error('未知错误');
              return;
            }

            if (!title) {
              MessagePlugin.error('请输入分集标题');
              return;
            }

            if (!index) {
              MessagePlugin.error('请输入分集集数');
              return;
            }

            if (link === undefined) {
              MessagePlugin.error('请上传视频');
              return;
            }

            // eslint-disable-next-line consistent-return
            return addEpisode({
              title,
              description,
              link,
              videoStatusWillBe: 1,
              index,
              videoGroupId: id,
            }).then((res) => {
              if (res.code === 200) {
                MessagePlugin.success('添加成功');
                window.location.href = `/video/episode/${id}`;
              } else {
                MessagePlugin.error(res.msg);
              }
            });
          }}
        >
          添加
        </Button>
      </div>
    </Card>
  );
};

export default React.memo(Add);
