import React, { memo } from 'react';
import { Row, Col, Button, Card } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';
import { BrowserRouterProps } from 'react-router-dom';

import styles from './index.module.less';

const User: React.FC<BrowserRouterProps> = () => (
  <div>
    <Col>
      <Card className={styles.welcome} bordered={false}>
        <Row justify='space-between'>
          <Col className={styles.name}>
            Hi，Admin <span className={styles.regular}></span>
          </Col>
          <Col>
            <img alt='' src='https://tdesign.gtimg.com/starter/assets-tencent-logo.png' className={styles.logo} />
          </Col>
        </Row>
      </Card>
    </Col>
  </div>
);

export default memo(User);
