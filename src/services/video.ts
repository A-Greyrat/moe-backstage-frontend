import { httpGet, httpPost, httpPostForm, ResponseData } from './axios';

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
  uploader: {
    nickname: string;
    avatar: string;
    id: string;
  };
  weight: number;
}

interface IResult {
  total: number;
  records: IVideo[];
}

export const getVideoList = async (params: IParams) =>
  httpGet<IResult>('/backstage/plain-video-group/all', { params }).then((res) => {
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
          uploader: item.uploader,
          weight: item.weight,
          tags: item.tags.split(';'),
          cover: item.cover,
          description: item.description,
        })),
      };
    }

    return {
      total: 0,
      list: [],
    };
  });

export const deleteVideoGroup = async (id: number) => httpPost(`/backstage/plain-video-group/delete`, { id });

export const lockVideoGroup = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 0 });

export const unlockVideoGroup = async (id: number) => httpPost(`/backstage/video-group/status`, { id, status: 1 });

export const getVideoDetail = async (id: number) =>
  httpGet<IResult>('/backstage/plain-video-group/all', {
    params: {
      pageSize: 1,
      page: 1,
      id: id.toString(),
    },
  }).then((res) => {
    if (res.code === 200) {
      const newRes = res;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newRes.data = res.data?.records[0];
      return newRes as unknown as ResponseData<IVideo>;
    }

    return res as unknown as ResponseData<IVideo>;
  });

export const modifyVideoGroup = async (params: {
  id: number;
  title?: string;
  description?: string;
  tags?: string;
  weight?: number;
  cover?: File;
  videoGroupStatus?: number;
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

  return httpPostForm(`/backstage/plain-video-group/update`, formData);
};

export const addVideoGroup = async (params: { title: string; description: string; tags: string; cover: File }) => {
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

  return httpPostForm(`/backstage/plain-video-group/add`, formData);
};

export interface IEpisodeListItem {
  videoId: string;
  videoGroupId: string;
  title: string;
  index: string;
  videoCover: string;
}

export const getPlainVideoGroupEpisodeList = async (params: { id: number }): Promise<IEpisodeListItem[]> =>
  httpGet<IEpisodeListItem[]>('/backstage/plain-video-group/contents', { params }).then((res) => {
    if (res.code === 200) {
      return res.data || [];
    }

    return [];
  });

export const deleteEpisode = async (id: number) => httpPost(`/backstage/video/delete`, { id });

export interface IEpisodeDetail {
  id: string;
  title: string;
  videoGroupId: string;
  index: string;
  cover: string;
  uploadTime: string;
  description: string;
  src: {
    srcName: string;
    src: string;
  }[];
}

export const getEpisodeDetail = async (id: number) => httpGet<IEpisodeDetail>(`/backstage/video`, { params: { id } });

export const modifyEpisode = async (params: { id: number; title?: string; videoStatusWillBe?: number }) =>
  httpPost(`/backstage/video/update`, params);

export const addEpisode = async (params: {
  title: string;
  videoGroupId: string;
  index: number;
  description?: string;
  link?: string;
  videoStatusWillBe?: number;
}) => httpPost(`/backstage/video/add`, params);

export const getCarouselList = async () =>
  httpGet<any[]>('/backstage/video-group/carousel').then((res) => {
    if (res.code === 200) {
      return res.data || [];
    }

    return [];
  });

export const addCarousel = async (id: number, index: number) =>
  httpPost('/backstage/video-group/carousel/add', { ids: [id], index });

export const deleteCarousel = async (id: number) => httpPost('/backstage/video-group/carousel/delete', { ids: [id] });
