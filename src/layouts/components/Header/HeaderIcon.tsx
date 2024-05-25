import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Popup, Dropdown, Space } from 'tdesign-react';
import { Icon, SettingIcon, PoweroffIcon, UserCircleIcon } from 'tdesign-icons-react';
import { useAppDispatch } from 'modules/store';
import { toggleSetting } from 'modules/global';
import Style from './HeaderIcon.module.less';
import { logout, useUser } from '../../../services/login';

const { DropdownMenu, DropdownItem } = Dropdown;

export default memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const info = useUser();

  const clickHandler = (data: any) => {
    if (data.value === 1) {
      navigate('/index');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.pathname = '/login';
  };

  return (
    <Space align='center'>
      <Dropdown trigger={'click'} onClick={clickHandler}>
        <Button variant='text' className={Style.dropdown}>
          <Icon name='user-circle' className={Style.icon} />
          <span className={Style.text}>{info?.nickname || 'avatar'}</span>
          <Icon name='chevron-down' className={Style.icon} />
        </Button>
        <DropdownMenu>
          <DropdownItem value={1}>
            <div className={Style.dropItem}>
              <UserCircleIcon />
              <span>个人中心</span>
            </div>
          </DropdownItem>
          <DropdownItem value={1} onClick={handleLogout}>
            <div className={Style.dropItem}>
              <PoweroffIcon />
              <span>退出登录</span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Popup content='页面设置' placement='bottom' showArrow destroyOnClose>
        <Button
          className={Style.menuIcon}
          shape='square'
          size='large'
          variant='text'
          onClick={() => dispatch(toggleSetting())}
          icon={<SettingIcon />}
        />
      </Popup>
    </Space>
  );
});
