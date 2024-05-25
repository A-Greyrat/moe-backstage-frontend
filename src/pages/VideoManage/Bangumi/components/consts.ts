export const VIDEO_STATUS_OPTIONS = [
  { label: '已锁定', value: '0' },
  { label: '正常', value: '1' },
  { label: '正在处理', value: '2' },
];

export const VIDEO_STATUS_COLOR: {
  [key: number]: string;
} = {
  0: '#d9534f',
  1: '#5cb85c',
  2: '#f0ad4e',
};
