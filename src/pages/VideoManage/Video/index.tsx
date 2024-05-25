import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps, useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, MessagePlugin, Row, Table, Tag } from 'tdesign-react';
import { VIDEO_STATUS_COLOR, VIDEO_STATUS_OPTIONS } from './components/consts';
import SearchForm from './components/SearchForm';
import { deleteVideo, getVideoList, lockVideo, unlockVideo } from '../../../services/video';

const Video: React.FC<BrowserRouterProps> = () => {
  const q = window.location.search;
  const page = new URLSearchParams(q).get('page');
  const size = new URLSearchParams(q).get('size');

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([0, 1]);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page || '1', 10));
  const [pageSize, setPageSize] = useState(parseInt(size || '10', 10));
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const handleFetchData = useCallback(
    (current: number, size: number, value?: any) => {
      setLoading(true);
      getVideoList({
        pageSize: size,
        page: current,
        ...value,
      }).then((res) => {
        setVideoList(res.list);
        setLoading(false);
        setTotal(res.total);
      });
    },
    [currentPage, pageSize],
  );

  useEffect(() => {
    setCurrentPage(parseInt(page || '1', 10));
    setPageSize(parseInt(size || '10', 10));
  }, [page, size]);

  useEffect(() => {
    handleFetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <Row justify='start' style={{ marginBottom: '20px' }}>
        <SearchForm
          onSubmit={async (value) => {
            handleFetchData(currentPage, pageSize, value);
          }}
          onCancel={() => {
            handleFetchData(currentPage, pageSize);
          }}
        />
      </Row>
      <Table
        loading={loading}
        data={
          videoList.map((item, index) => ({
            ...item,
            index,
          })) || []
        }
        columns={[
          {
            title: '视频名称',
            fixed: 'left',
            align: 'left',
            ellipsis: true,
            colKey: 'name',
          },
          {
            title: '上传者',
            colKey: 'uploader',
            width: 200,
            cell({ row }) {
              return row.uploader.nickname;
            },
          },
          {
            title: '上传时间',
            colKey: 'createTime',
            width: 200,
            cell({ row }) {
              return new Date(row.createTime).toLocaleString();
            },
          },
          {
            title: '视频状态',
            colKey: 'status',
            width: 200,
            cell({ row }) {
              const color = VIDEO_STATUS_COLOR[row.status];
              return (
                <Tag color={color}>
                  {VIDEO_STATUS_OPTIONS.find((item) => item.value === row.status.toString())?.label}
                </Tag>
              );
            },
          },
          {
            title: '视频ID',
            width: 200,
            ellipsis: true,
            colKey: 'id',
          },
          {
            align: 'center',
            fixed: 'right',
            width: 300,
            colKey: 'op',
            title: '操作',
            cell(record) {
              return (
                <>
                  <Button
                    theme='primary'
                    variant='text'
                    onClick={() => {
                      navigate(`/video/detail/${videoList[record.rowIndex].id}`);
                    }}
                  >
                    管理
                  </Button>
                  <Button
                    theme='primary'
                    variant='text'
                    onClick={() => {
                      setVisible(true);
                      setDeleteId(videoList[record.rowIndex].id);
                    }}
                  >
                    删除
                  </Button>
                  <Button
                    theme='primary'
                    variant='text'
                    onClick={() => {
                      console.log(videoList[record.rowIndex]);
                      if (videoList[record.rowIndex].status === 1) {
                        lockVideo(videoList[record.rowIndex].id).then((res) => {
                          if (res.code === 200) {
                            MessagePlugin.success('锁定成功');
                            handleFetchData(currentPage, pageSize);
                          } else {
                            MessagePlugin.error('锁定失败');
                          }
                        });
                      } else if (videoList[record.rowIndex].status === 0) {
                        unlockVideo(videoList[record.rowIndex].id).then((res) => {
                          if (res.code === 200) {
                            MessagePlugin.success('解锁成功');
                            handleFetchData(currentPage, pageSize);
                          } else {
                            MessagePlugin.error('解锁失败');
                          }
                        });
                      }
                    }}
                    disabled={videoList[record.rowIndex].status === 2}
                  >
                    {videoList[record.rowIndex].status === 0 ? '解锁' : '锁定'}
                  </Button>
                </>
              );
            },
          },
        ]}
        rowKey='index'
        selectedRowKeys={selectedRowKeys}
        onSelectChange={(keys) => {
          setSelectedRowKeys(keys);
        }}
        hover
        pagination={{
          total,
          pageSize,
          current: currentPage,
          showJumper: true,
          onCurrentChange(current, pageInfo) {
            navigate(`/video/group?page=${current}&size=${pageInfo.pageSize}`);
          },
          onPageSizeChange(size) {
            navigate(`/video/group?page=1&size=${size}`);
          },
        }}
      />
      <Dialog
        header='确认删除当前所选视频？'
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={() => {
          setVisible(false);
          deleteVideo(parseInt(deleteId.toString(), 10)).then((res) => {
            if (res.code === 200) {
              handleFetchData(currentPage, pageSize);
              MessagePlugin.success(`删除成功`);
            } else {
              MessagePlugin.error('删除失败');
            }
          });
        }}
      >
        <p>删除后的所有信息将被清空,且无法恢复</p>
      </Dialog>
    </>
  );
};

export default React.memo(Video);
