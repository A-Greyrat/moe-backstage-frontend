interface IParams {
  pageSize: number;
  current: number;
}

export interface IVideo {
  name: string;
  status: string;
  id: string;
  type: string;
}

interface IResult {
  list: IVideo[];
}

export const getVideoList = async (params: IParams) => {
  // 模拟接口返回数据
  const list: IVideo[] = [
    {
      name: '视频1',
      status: '1',
      id: '10001',
      type: '1',
    },
    {
      name: '视频2',
      status: '2',
      id: '10002',
      type: '2',
    },
    {
      name: '视频3',
      status: '3',
      id: '10003',
      type: '3',
    },
    {
      name: '视频4',
      status: '1',
      id: '10004',
      type: '1',
    },
    {
      name: '视频5',
      status: '2',
      id: '10005',
      type: '2',
    },
    {
      name: '视频6',
      status: '3',
      id: '10006',
      type: '3',
    },
    {
      name: '视频7',
      status: '1',
      id: '10007',
      type: '1',
    },
    {
      name: '视频8',
      status: '2',
      id: '10008',
      type: '2',
    },
    {
      name: '视频9',
      status: '3',
      id: '10009',
      type: '3',
    },
    {
      name: '视频10',
      status: '1',
      id: '10010',
      type: '1',
    },
  ];

  const total = list.length;
  const result = list.splice(params.pageSize * (params.current - 1), params.pageSize);
  return {
    list: result,
    total,
  };
};
