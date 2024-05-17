export const VIDEO_STATUS_OPTIONS = [
  { label: '正在处理', value: '1' },
  { label: '正常', value: '2' },
  { label: '已冻结', value: '3' },
];

export const VIDEO_STATUS_COLOR: {
  [key: number]: string;
} = {
  1: '#f0ad4e',
  2: '#5cb85c',
  3: '#d9534f',
};
