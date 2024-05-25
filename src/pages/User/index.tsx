import React, { memo } from 'react';
import { Row, Col, Card } from 'tdesign-react';
import { BrowserRouterProps } from 'react-router-dom';

import styles from './index.module.less';
import { useUser } from '../../services/login';

const User: React.FC<BrowserRouterProps> = () => {
  document.title = '个人中心';
  const info = useUser();

  return (
    <div>
      <Col>
        <Card className={styles.welcome} bordered={false}>
          <Row justify='space-between'>
            <Col className={styles.name}>
              Hi，{info?.nickname || 'admin'} <span className={styles.regular}></span>
            </Col>
            <Col>
              <img alt='' src='https://tdesign.gtimg.com/starter/assets-tencent-logo.png' className={styles.logo} />
            </Col>
          </Row>
        </Card>
      </Col>
    </div>
  );
};

export default memo(User);
