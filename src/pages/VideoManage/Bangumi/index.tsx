import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps, useNavigate } from 'react-router-dom';
import { Button, Dialog, MessagePlugin, Row, Table, Tag } from 'tdesign-react';
import { VIDEO_STATUS_COLOR, VIDEO_STATUS_OPTIONS } from './components/consts';
import SearchForm from './components/SearchForm';
import { deleteVideo } from '../../../services/video';

import { getBangumiList } from '../../../services/bangumi';

const Bangumi: React.FC<BrowserRouterProps> = () => {
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
      getBangumiList({
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
                      navigate(`/video/bangumi/detail`);
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
                      MessagePlugin.success('操作成功');
                    }}
                    disabled={videoList[record.rowIndex].status === '1'}
                  >
                    {videoList[record.rowIndex].status === '3' ? '解冻' : '冻结'}
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
            navigate(`/video/bangumi?page=${current}&size=${pageInfo.pageSize}`);
          },
          onPageSizeChange(size) {
            navigate(`/video/bangumi?page=${currentPage}&size=${size}`);
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
              MessagePlugin.success(`删除成功${deleteId}`);
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

export default React.memo(Bangumi);
