import { httpGet, httpPost } from './axios';

interface IUserListParams {
  id?: string;
  name?: string;
  status?: string;

  page?: number;
  pageSize?: number;
}

export interface IUser {
  nickname: string;
  status: string;
  id: string;
  avatar: string;
  signature: string;
  permission: string;
  email: string;
  createTime: string;
}

interface IResult {
  total: number;
  records: IUser[];
}

export const getUserList = async (params: IUserListParams) =>
  httpGet<IResult>('/backstage/plain-user/list', { params }).then((res) => {
    if (res.code === 200) {
      return (
        res.data || {
          total: 0,
          records: [],
        }
      );
    }

    return {
      total: 0,
      records: [],
    };
  });

export const banUser = async (id: string) => httpPost(`/backstage/plain-user/ban`, { id, status: 1 });

export const unbanUser = async (id: string) => httpPost(`/backstage/plain-user/ban`, { id, status: 0 });

export const isAdminUser = async () => {
  const res = await httpGet<IResult>('/backstage/plain-user/list', {
    params: {
      page: 1,
      pageSize: 1,
    },
  });

  return res.code === 200;
};
