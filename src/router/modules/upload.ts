import { lazy } from 'react';
import { UploadIcon } from 'tdesign-icons-react';

const result = [
  {
    path: '/upload',
    meta: {
      Icon: UploadIcon,
      title: '上传',
    },
    children: [
      {
        path: 'bangumi',
        Component: lazy(() => import('pages/Upload/Bangumi')),
        meta: {
          title: '番剧上传',
        },
      },
    ],
  },
];

export default result;
