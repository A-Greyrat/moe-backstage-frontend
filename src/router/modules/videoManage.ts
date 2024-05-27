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
        path: 'episode/:id',
        Component: lazy(() => import('pages/VideoManage/Video/Episode')),
        meta: {
          title: '视频分集管理',
          hidden: true,
        },
      },
      {
        path: 'episode/add/:id',
        Component: lazy(() => import('pages/VideoManage/Video/Episode/Add')),
        meta: {
          title: '添加视频分集',
          hidden: true,
        },
      },
      {
        path: 'episode/edit/:id',
        Component: lazy(() => import('pages/VideoManage/Video/Episode/Edit')),
        meta: {
          title: '编辑视频分集',
          hidden: true,
        },
      },
      {
        path: 'add',
        Component: lazy(() => import('pages/VideoManage/Video/Add')),
        meta: {
          title: '添加视频组',
          hidden: true,
        },
      },
      {
        path: 'bangumi',
        Component: lazy(() => import('pages/VideoManage/Bangumi')),
        meta: { title: '番剧管理' },
      },
      {
        path: 'bangumi/add',
        Component: lazy(() => import('pages/VideoManage/Bangumi/Add')),
        meta: {
          title: '添加番剧',
          hidden: true,
        },
      },
      {
        path: 'bangumi/episode/edit/:id',
        Component: lazy(() => import('pages/VideoManage/Bangumi/Episode/Edit')),
        meta: {
          title: '编辑番剧',
          hidden: true,
        },
      },
      {
        path: 'bangumi/episode/add/:id',
        Component: lazy(() => import('pages/VideoManage/Bangumi/Episode/Add')),
        meta: {
          title: '添加番剧分集',
          hidden: true,
        },
      },
      {
        path: 'bangumi/episode/:id',
        Component: lazy(() => import('pages/VideoManage/Bangumi/Episode')),
        meta: {
          title: '番剧分集管理',
          hidden: true,
        },
      },
      {
        path: 'bangumi/detail/:id',
        Component: lazy(() => import('pages/VideoManage/Bangumi/Detail')),
        meta: {
          title: '番剧详情',
          hidden: true,
        },
      },
    ],
  },
];

export default result;
