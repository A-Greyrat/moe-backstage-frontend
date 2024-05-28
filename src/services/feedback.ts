import { httpGet, httpPost } from './axios';

interface IFeedbackParams {
  content?: string;
  email?: string;

  page: number;
  pageSize: number;
}

export interface IFeedback {
  content: string;
  email: string;
  id: number;
  status: number;
  timestamp: string;
}

interface IResult {
  total: number;
  records: IFeedback[];
}

export const getFeedbackList = async (params: IFeedbackParams) =>
  httpGet<IResult>('/backstage/feedback', { params }).then((res) => {
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

export const handleFeedback = async (id: number) => httpPost(`/backstage/feedback/handle`, { id });

export const deleteFeedback = async (id: number) => httpPost(`/backstage/feedback/delete`, { ids: [id] });
