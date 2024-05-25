import React, { memo, useEffect } from 'react';
import { Drawer, Layout, MessagePlugin } from 'tdesign-react';
import throttle from 'lodash/throttle';
import { useAppSelector, useAppDispatch } from 'modules/store';
import { selectGlobal, toggleSetting, toggleMenu, ELayout, switchTheme } from 'modules/global';
import Setting from './components/Setting';
import AppLayout from './components/AppLayout';
import Style from './index.module.less';
import { isUserLoggedInSync, logout } from '../services/login';
import { isAdminUser } from '../services/user';

export default memo(() => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();

  const AppContainer = AppLayout[globalState.isFullPage ? ELayout.fullPage : globalState.layout];

  useEffect(() => {
    dispatch(switchTheme(globalState.theme));
    const handleResize = throttle(() => {
      if (window.innerWidth < 900) {
        dispatch(toggleMenu(true));
      } else if (window.innerWidth > 1000) {
        dispatch(toggleMenu(false));
      }
    }, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isUserLoggedInSync() && window.location.pathname !== '/login') {
    window.location.pathname = '/login';
  }

  if (window.location.pathname !== '/login' && isUserLoggedInSync()) {
    isAdminUser().then((res) => {
      if (!res) {
        logout();
        window.location.pathname = '/login';
        MessagePlugin.error('您没有权限访问此页面');
      }
    });
  }

  return (
    <Layout className={Style.panel}>
      <AppContainer />
      <Drawer
        destroyOnClose
        visible={globalState.setting}
        size='458px'
        footer={false}
        header='页面配置'
        onClose={() => dispatch(toggleSetting())}
      >
        <Setting />
      </Drawer>
    </Layout>
  );
});
