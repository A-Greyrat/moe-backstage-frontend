import React, { useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { addBangumi } from 'services/bilibili';
import { Button, Card, Input, InputAdornment, MessagePlugin } from 'tdesign-react';

const Bilibili: React.FC<BrowserRouterProps> = () => {
  const [bv, setBv] = useState<string>('');
  const [sessdata, setSessdata] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <InputAdornment prepend='SSID'>
          <Input value={bv} onChange={(value) => setBv(value)} />
        </InputAdornment>
        <InputAdornment prepend='SESSDATA'>
          <Input value={sessdata} onChange={(value) => setSessdata(value)} />
        </InputAdornment>

        <Button
          disabled={disabled}
          onClick={() => {
            if (!bv) {
              MessagePlugin.error('请输入SSID');
              return;
            }

            setDisabled(true);

            addBangumi(bv, sessdata)
              .then((res) => {
                if (res.code === 200) {
                  MessagePlugin.success('添加成功');
                } else {
                  MessagePlugin.error(res.msg);
                }
              })
              .finally(() => {
                setDisabled(false);
              });
          }}
        >
          添加
        </Button>
      </div>
    </Card>
  );
};

export default Bilibili;
