import axios, { AxiosRequestConfig } from 'axios';
import { isUserLoggedInSync } from '../login';
import { MessagePlugin } from 'tdesign-react';

export interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

export const baseURL = 'https://abdecd.xyz/moe';
const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    if (response.headers.token) {
      localStorage.setItem('token', response.headers.token);
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (isUserLoggedInSync()) {
        MessagePlugin.error('登录过期，请重新登录').then(() => {
          localStorage.removeItem('token');
          window.location.reload();
        });
      }
    }
    return Promise.reject(error);
  },
);

// eslint-disable-next-line no-use-before-define
export const httpGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T | null>> =>
  instance
    .get(url, config)
    .then((res) => res.data as ResponseData<T>)
    .catch((res) => ({
      code: res.response?.status || 400,
      data: null,
      msg: res.response?.data?.msg || '',
    }));

export const httpPost = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ResponseData<T | null>> => {
  // eslint-disable-next-line no-param-reassign
  config = config || {};
  config.headers = {
    'Content-Type': 'application/json',
  };

  return instance
    .post(url, data, config)
    .then((res) => res.data as ResponseData<T>)
    .catch((res) => ({
      code: res.response?.status,
      data: null,
      msg: res.response?.data.msg,
    }));
};

export const httpPostForm = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ResponseData<T | null>> => {
  // eslint-disable-next-line no-param-reassign
  config = config || {};
  config.headers = {
    'Content-Type': 'multipart/form-data',
  };

  return instance
    .post(url, data, config)
    .then((res) => res.data as ResponseData<T>)
    .catch((res) => ({
      code: res.response?.status,
      data: null,
      msg: res.response?.data.msg,
    }));
};

export const errorResponse: ResponseData<null> = {
  code: 400,
  data: null,
  msg: '网络错误',
};

export default instance;
