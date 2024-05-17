import React from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Row } from 'tdesign-react';

import './index.module.less';

const Feedback: React.FC<BrowserRouterProps> = () => (
  <Row>
    <div>Feedback</div>
  </Row>
);

export default React.memo(Feedback);
