import dayjs from 'dayjs';
import { httpPost } from './axios';

const proxyUrl = 'https://b.erisu.moe/api/proxy?x-referer=https://www.bilibili.com&url=';
const proxyImgUrl = 'https://fast.abdecd.xyz/proxy?pReferer=https://www.bilibili.com&pUrl=';

const proxy = async (url: string, config?: RequestInit) => {
  const response = await fetch(proxyUrl + url, config);
  return response.json();
};

export const addVideo = async (bv: string, SESSDATA?: string) => {
  const url = `https://api.bilibili.com/x/web-interface/view/detail?bvid=${bv}`;
  const bRes = await proxy(url, {
    headers: {
      cookie: SESSDATA ? `SESSDATA=${SESSDATA}` : '',
    },
  });

  const { pages, title, desc } = bRes.data.View;
  const cover = proxyImgUrl + bRes.data.View.pic;
  const uploadTime = dayjs(bRes.data.View.pubdate * 1000).format('YYYY-MM-DDTHH:mm:ss');
  const tags = bRes.data.Tags.map((tag: any) => tag.tag_name).join(';');

  const groupRes = await httpPost('/backstage/dangerous/video-group/add', [
    {
      id: null,
      userId: '1',
      title,
      cover,
      description: desc,
      createTime: uploadTime,
      type: '0',
      tags,
      videoGroupStatus: '1',
      weight: 1,
    },
  ]);

  if (groupRes.code !== 200) {
    return groupRes;
  }

  const videoGroupId = (groupRes?.data as string[])[0];

  const data = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const page of pages) {
    data.push({
      id: null,
      title: page.part,
      videoGroupId,
      index: page.page,
      description: '',
      cover: proxyImgUrl + page.first_frame,
      uploadTime,
      status: '1',
    });
  }

  const vRes = await httpPost('/backstage/dangerous/video/add', data);
  if (vRes.code !== 200) {
    return vRes;
  }

  const promises = [];

  let i = 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const videoId of vRes.data as string[]) {
    // eslint-disable-next-line no-await-in-loop
    const duration = Math.ceil(pages[i - 1].duration / 6 / 60);
    for (let j = 1; j <= duration; j += 1) {
      promises.push(
        fetch(
          `https://fast.abdecd.xyz/test-bilibili/dm?type=1&bvid=${bv}&p=${i}&segment_index=${j}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.code !== 200) {
              return data;
            }
            // eslint-disable-next-line no-param-reassign
            data = data.data;
            if (!Array.isArray(data) || data.length === 0) {
              return {
                code: 200,
                msg: '添加成功',
                data: null,
              };
            }
            let danmaku = data.filter(
              (item: any) =>
                !(
                  item.progress === undefined ||
                  item.progress === null ||
                  item.mode === undefined ||
                  item.mode === null ||
                  item.fontsize === undefined ||
                  item.fontsize === null ||
                  item.color === undefined ||
                  item.color === null ||
                  item.ctime === undefined ||
                  item.ctime === null ||
                  item.content === undefined ||
                  item.content === null
                ),
            );

            danmaku = danmaku.map((item: any) => ({
              id: null,
              videoId,
              userId: 1,
              timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
              begin: item.progress / 1000,
              mode: item.mode,
              size: item.fontsize,
              // 16777215 -> 0xffffff
              color: `#${parseInt(item.color, 10).toString(16).padStart(6, '0')}`,
              time: item.ctime,
              pool: 0,
              author: '1',
              text: item.content,
            }));

            return httpPost('/backstage/dangerous/danmaku/import', danmaku);
          }),
      );
    }
    promises.push(
      httpPost('/backstage/dangerous/video-src/add', [
        {
          id: null,
          videoId,
          src: bv,
          srcName: '720p',
        },
      ]),
    );
    i += 1;
  }

  const res = await Promise.all(promises);

  if (res.some((r) => r.code !== 200)) {
    return {
      code: 500,
      msg: '添加失败',
      data: res,
    };
  }

  return {
    code: 200,
    msg: '添加成功',
    data: null,
  };
};

export const addBangumi = async (ssid: string, SESSDATA?: string) => {
  const url = `https://api.bilibili.com/pgc/view/pc/season?season_id=${ssid}`;
  const bRes = await proxy(url, {
    headers: {
      cookie: SESSDATA ? `SESSDATA=${SESSDATA}` : '',
    },
  });

  const { title, cover, evaluate, publish, styles, episodes } = bRes.result;
  const tags = styles.join(';');

  const groupRes = await httpPost('/backstage/dangerous/video-group/add', [
    {
      id: null,
      userId: '1',
      title,
      cover: proxyImgUrl + cover,
      description: evaluate,
      createTime: dayjs(publish.pub_time).format('YYYY-MM-DDTHH:mm:ss'),
      type: '1',
      tags,
      videoGroupStatus: '1',
      weight: 1,
    },
  ]);

  if (groupRes.code !== 200) {
    return groupRes;
  }

  const videoGroupId = (groupRes?.data as string[])[0];

  const bangumiGroupRes = await httpPost('/backstage/dangerous/bangumi-video-group/add', [
    {
      videoGroupId,
      releaseTime: dayjs(publish.pub_time).format('YYYY-MM-DDTHH:mm:ss'),
      updateAtAnnouncement: '已完结',
      status: 0,
      updateTime: dayjs(publish.pub_time).format('YYYY-MM-DDTHH:mm:ss'),
    },
  ]);

  if (bangumiGroupRes.code !== 200) {
    return bangumiGroupRes;
  }

  const data = [];

  let i = 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const episode of episodes) {
    data.push({
      id: null,
      title: episode.long_title,
      videoGroupId,
      index: i,
      description: '',
      cover: proxyImgUrl + episode.cover,
      uploadTime: dayjs(new Date(episode.pub_time * 1000)).format('YYYY-MM-DDTHH:mm:ss'),
      status: '1',
    });
    i += 1;
  }

  const vRes = await httpPost('/backstage/dangerous/video/add', data);
  if (vRes.code !== 200) {
    return vRes;
  }

  const promises = [];
  i = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const videoId of vRes.data as string[]) {
    const bv = episodes[i].bvid;
    const duration = Math.ceil(episodes[i].duration / 6 / 60 / 1000);

    for (let j = 1; j <= duration; j += 1) {
      promises.push(
        fetch(`https://fast.abdecd.xyz/test-bilibili/dm?type=1&bvid=${bv}&segment_index=${j}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code !== 200) {
              return data;
            }
            // eslint-disable-next-line no-param-reassign
            data = data.data;
            if (!Array.isArray(data) || data.length === 0) {
              return {
                code: 200,
                msg: '添加成功',
                data: null,
              };
            }
            let danmaku = data.filter(
              (item: any) =>
                !(
                  item.progress === undefined ||
                  item.progress === null ||
                  item.mode === undefined ||
                  item.mode === null ||
                  item.fontsize === undefined ||
                  item.fontsize === null ||
                  item.color === undefined ||
                  item.color === null ||
                  item.ctime === undefined ||
                  item.ctime === null ||
                  item.content === undefined ||
                  item.content === null
                ),
            );

            danmaku = danmaku.map((item: any) => ({
              id: null,
              videoId,
              userId: 1,
              timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
              begin: item.progress / 1000,
              mode: item.mode,
              size: item.fontsize,
              // 16777215 -> 0xffffff
              color: `#${parseInt(item.color, 10).toString(16).padStart(6, '0')}`,
              time: item.ctime,
              pool: 0,
              author: '1',
              text: item.content,
            }));

            return httpPost('/backstage/dangerous/danmaku/import', danmaku);
          }),
      );
    }

    promises.push(
      httpPost('/backstage/dangerous/video-src/add', [
        {
          id: null,
          videoId,
          src: bv,
          srcName: '720p',
        },
      ]),
    );

    i += 1;
  }

  const res = await Promise.all(promises);

  if (res.some((r) => r.code !== 200)) {
    return {
      code: 500,
      msg: '添加失败',
      data: res,
    };
  }

  return {
    code: 200,
    msg: '添加成功',
    data: null,
  };
};
