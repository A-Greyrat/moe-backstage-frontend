import { httpGet, httpPost } from './axios';

interface IParams {
  pageSize: number;
  page: number;
  id?: string;
  title?: string;
  status?: number;
}

export interface IVideo {
  id: string;
  title: string;
  videoGroupStatus: number;
  cover: string;
  createTime: string;
  description: string;
  tags: string;
  weight: number;
  releaseTime: string;
  updateAtAnnouncement: string;
  status: number;
  updateTime: string;
}

interface IResult {
  total: number;
  records: IVideo[];
}

export const getBangumiList = async (params: IParams) =>
  httpGet<IResult>('/backstage/bangumi-video-group/all', { params }).then((res) => {
    if (res.code === 200) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { total, records } = res.data!;
      return {
        total,
        list: records.map((item) => ({
          id: item.id,
          name: item.title,
          status: item.videoGroupStatus,
          createTime: new Date(item.createTime).toLocaleString(),
          weight: item.weight,
          tags: item.tags.split(';'),
          cover: item.cover,
          description: item.description,
          releaseTime: item.releaseTime,
          updateAtAnnouncement: item.updateAtAnnouncement,
          bangumiStatus: item.status,
          updateTime: item.updateTime,
        })),
      };
    }

    return {
      total: 0,
      list: [],
    };
  });
