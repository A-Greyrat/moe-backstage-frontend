import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Button, MessagePlugin, Row, Table, Tag } from 'tdesign-react';
import SearchForm from './components/SearchForm';
import { getFeedbackList, handleFeedback } from 'services/feedback';

const Feedback: React.FC<BrowserRouterProps> = () => {
  document.title = '反馈管理';
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([0, 1]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handleFetchData = useCallback(
    (current: number, size: number, value?: any) => {
      setLoading(true);

      getFeedbackList({
        pageSize: size,
        page: current,
        ...value,
      }).then((res) => {
        setUserList(res.records);
        setLoading(false);
        setTotal(res.total);
      });
    },
    [currentPage, pageSize],
  );

  useEffect(() => {
    handleFetchData(currentPage, pageSize);
  }, []);

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
          userList.map((item, index) => ({
            ...item,
            index,
          })) || []
        }
        columns={[
          {
            title: 'ID',
            colKey: 'id',
            ellipsis: true,
          },
          {
            title: '用户邮箱',
            colKey: 'email',
            ellipsis: true,
          },
          {
            title: '反馈内容',
            colKey: 'content',
            ellipsis: true,
          },
          {
            title: '反馈时间',
            colKey: 'timestamp',
            ellipsis: true,
            cell({ row }) {
              return new Date(row.timestamp).toLocaleString();
            },
          },
          {
            title: '反馈状态',
            colKey: 'status',
            cell({ row }) {
              return row.status === 1 ? <Tag color='red'>未处理</Tag> : <Tag color='green'>已处理</Tag>;
            },
          },
          {
            align: 'center',
            fixed: 'right',
            colKey: 'op',
            title: '操作',
            cell(record) {
              return (
                <>
                  <Button
                    theme='primary'
                    variant='text'
                    onClick={() => {
                      if (userList[record.rowIndex].status === 1) {
                        handleFeedback(userList[record.rowIndex].id).then((res) => {
                          if (res.code === 200) {
                            MessagePlugin.success('处理成功');
                            handleFetchData(currentPage, pageSize);
                          } else {
                            MessagePlugin.error('处理失败');
                          }
                        });
                      } else {
                        MessagePlugin.info('已处理');
                      }
                    }}
                    disabled={userList[record.rowIndex].status === 0}
                  >
                    {userList[record.rowIndex].status === 1 ? '处理' : '已处理'}
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
            setCurrentPage(current);
            setPageSize(pageInfo.pageSize);
            handleFetchData(current, pageInfo.pageSize);
          },
          onPageSizeChange(size) {
            setPageSize(size);
            setCurrentPage(1);
            handleFetchData(1, size);
          },
        }}
      />
    </>
  );
};

export default React.memo(Feedback);
