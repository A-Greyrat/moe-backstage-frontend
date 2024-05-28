import React, { useEffect, useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';

import { addVideoGroup } from '../../../../services/video';
import {
  Button,
  Card,
  Input,
  InputAdornment,
  MessagePlugin,
  TagInput,
  Textarea,
} from 'tdesign-react';

import Style from './index.module.less';
import ImageUpload from '../../component/ImageUpload';

const Add: React.FC<BrowserRouterProps> = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [cover, setCover] = useState<File>();

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
          <Button
            theme='primary'
            style={{
              margin: '20px 0',
              padding: '0 20px',
              width: 'fit-content',
            }}
            onClick={() => {
              if (!title) {
                MessagePlugin.error('请输入视频标题');
                return;
              }
              if (!description) {
                MessagePlugin.error('请输入视频描述');
                return;
              }
              if (!tags.length) {
                MessagePlugin.error('请输入视频标签');
                return;
              }

              if (!cover) {
                MessagePlugin.error('请上传视频封面');
                return;
              }

              addVideoGroup({
                title,
                description,
                tags: tags.join(';'),
                cover,
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
