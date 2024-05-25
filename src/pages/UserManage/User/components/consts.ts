export const USER_STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '已封禁', value: '1' },
];

export const USER_STATUS_COLOR: {
  [key: number]: string;
} = {
  0: '#108ee9',
  1: '#f50',
};

export const USER_PERMISSION_OPTIONS = [
  { label: '普通用户', value: '1' },
  { label: '管理员', value: '99' },
];

export const USER_PERMISSION_COLOR: {
  [key: number]: string;
} = {
  1: '#979797',
  99: '#ff4d4f',
};
