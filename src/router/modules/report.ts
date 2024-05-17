import { lazy } from 'react';
import { ErrorCircleIcon } from 'tdesign-icons-react';

const result = [
  {
    path: '/report',
    meta: {
      Icon: ErrorCircleIcon,
      title: '举报管理',
    },
    children: [
      {
        path: 'video',
        meta: {
          title: '视频举报',
        },
      },
      {
        path: 'comment',
        meta: {
          title: '评论举报',
        },
      },
      {
        path: 'danmaku',
        meta: {
          title: '弹幕举报',
        },
      },
    ],
  },
];

export default result;
