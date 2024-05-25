import { httpGet, httpPost } from './axios';

interface IReportParams {
  page: number;
  pageSize: number;
}

export interface IReportVideo {
  id: number;
  user: {
    id: number;
  };
  video: {
    title: string;
  };
  reason: string;
  createTime: string;
  status: number;
}

export interface IReportComment {
  id: number;
  user: {
    id: number;
  };
  comment: {
    content: string;
  };
  reason: string;
  createTime: string;
  status: number;
}

interface IReportVideoResult {
  total: number;
  records: IReportVideo[];
}

interface IReportCommentResult {
  total: number;
  records: IReportComment[];
}

export const getReportVideoList = async (params: IReportParams) =>
  httpGet<IReportVideoResult>('/backstage/report/video', { params }).then((res) => {
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

export const handleReportVideo = async (id: number) => httpPost('/backstage/report/audit', { id });

export const getReportCommentList = async (params: IReportParams) =>
  httpGet<IReportCommentResult>('/backstage/report/comment', { params }).then((res) => {
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
