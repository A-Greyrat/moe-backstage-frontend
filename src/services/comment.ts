import { httpPost } from './axios';

export const deleteComment = async (id: number) => httpPost(`/backstage/video/comment/delete`, { id });
