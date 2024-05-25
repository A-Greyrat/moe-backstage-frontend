import { httpGet, httpPost, httpPostForm } from './axios';

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

export const deleteBangumi = async (id: number) => httpPost(`/backstage/bangumi-video-group/delete`, { id });

export const lockBangumi = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 0 });

export const unlockBangumi = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 1 });

export const getBangumiDetail = async (id: number) =>
  httpGet<IVideo>(`/backstage/bangumi-video-group`, { params: { id } });

export const modifyBangumi = async (params: {
  id: number;
  title?: string;
  description?: string;
  tags?: string;
  weight?: number;
  cover?: File;
  releaseTime?: string;
  updateAtAnnouncement?: string;
  status?: number;
}) => {
  const formData = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value instanceof File) {
        formData.append(key, value);
        return;
      }
      formData.append(key, value.toString());
    }
  });
  return httpPostForm(`/backstage/bangumi-video-group/update`, formData);
};
