import React, { useEffect } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default

import './index.module.less';
import { useAppSelector } from '../../../../modules/store';

const VideoDetail: React.FC<BrowserRouterProps> = () => {
  const states = useAppSelector((state: any) => state.video.currentVideoDetailId);
  const { id } = states;

  useEffect(() => {}, []);
  return <div>{id}</div>;
};

export default React.memo(VideoDetail);
