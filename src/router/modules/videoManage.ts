import { lazy } from 'react';
import { VideoIcon } from 'tdesign-icons-react';

const result = [
  {
    path: '/video',
    meta: {
      title: '视频管理',
      Icon: VideoIcon,
    },
    children: [
      {
        path: 'group',
        Component: lazy(() => import('pages/VideoManage/Video')),
        meta: { title: '视频组管理' },
      },
      {
        path: 'detail/:id',
        Component: lazy(() => import('pages/VideoManage/Video/Detail')),
        meta: {
          title: '视频组详情',
          hidden: true,
        },
      },
      {
        path: 'bangumi',
        Component: lazy(() => import('pages/VideoManage/Bangumi')),
        meta: { title: '番剧管理' },
      },
      {
        path: 'timeline',
        meta: { title: '新番时间表' },
      },
    ],
  },
];

export default result;
