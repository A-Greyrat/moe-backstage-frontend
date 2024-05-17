import React from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Row } from 'tdesign-react';

import './index.module.less';

const Bangumi: React.FC<BrowserRouterProps> = () => (
  <Row>
    <div>Bangumi</div>
  </Row>
);

export default React.memo(Bangumi);
