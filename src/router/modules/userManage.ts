import { lazy } from 'react';
import { UserIcon } from 'tdesign-icons-react';

const result = [
  {
    path: '/userManage',
    meta: {
      title: '用户管理',
      Icon: UserIcon,
    },
    children: [
      {
        path: 'user',
        Component: lazy(() => import('pages/UserManage/User')),
        meta: { title: '用户组管理' },
      },
      {
        path: 'feedback',
        Component: lazy(() => import('pages/UserManage/Feedback')),
        meta: { title: '反馈管理' },
      },
    ],
  },
];

export default result;
