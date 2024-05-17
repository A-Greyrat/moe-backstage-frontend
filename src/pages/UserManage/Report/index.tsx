import React from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Row } from 'tdesign-react';

import './index.module.less';

const Report: React.FC<BrowserRouterProps> = () => (
  <Row>
    <div>Report</div>
  </Row>
);

export default React.memo(Report);
