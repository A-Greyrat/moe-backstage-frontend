import { lazy } from 'react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/login',
    children: [
      {
        path: '/',
        Component: lazy(() => import('pages/Login/Login')),
        isFullPage: true,
      },
    ],
  },
];

export default result;
