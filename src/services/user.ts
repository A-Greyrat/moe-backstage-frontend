interface IParams {
  pageSize: number;
  current: number;
}

export interface IUser {
  name: string;
  status: string;
  id: string;
}

interface IResult {
  list: IUser[];
}

export const getUserList = async (params: IParams) => {
  // 模拟接口返回数据
  const list: IUser[] = [
    {
      name: '用户1',
      status: '1',
      id: '10001',
    },
    {
      name: '用户2',
      status: '2',
      id: '10002',
    },
    {
      name: '用户3',
      status: '1',
      id: '10003',
    },
    {
      name: '用户4',
      status: '1',
      id: '10004',
    },
    {
      name: '用户5',
      status: '2',
      id: '10005',
    },
    {
      name: '用户6',
      status: '2',
      id: '10006',
    },
    {
      name: '用户7',
      status: '1',
      id: '10007',
    },
  ];
  return {
    list,
    total: 7,
  };
};
