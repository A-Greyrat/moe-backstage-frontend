import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Button, Dialog, MessagePlugin, Row, Table, Tag } from 'tdesign-react';
import { USER_STATUS_COLOR, USER_STATUS_OPTIONS } from './components/consts';
import SearchForm from './components/SearchForm';
import { getUserList } from '../../../services/user';

const Video: React.FC<BrowserRouterProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([0, 1]);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handleFetchData = useCallback(
    (current: number, size: number) => {
      setLoading(true);
      getUserList({
        pageSize: size,
        current,
      }).then((res) => {
        setUserList(res.list);
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
            console.log(value);
          }}
          onCancel={() => {}}
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
            title: '用户名称',
            fixed: 'left',
            align: 'left',
            ellipsis: true,
            colKey: 'name',
          },
          {
            title: '用户状态',
            colKey: 'status',
            width: 200,
            cell({ row }) {
              const color = USER_STATUS_COLOR[row.status];
              return <Tag color={color}>{USER_STATUS_OPTIONS[row.status - 1].label}</Tag>;
            },
          },
          {
            title: '用户ID',
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
                      setVisible(true);
                      setDeleteId(userList[record.rowIndex].id);
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
                  >
                    {userList[record.rowIndex].status === '1' ? '封禁' : '解封'}
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
      <Dialog
        header='确认删除当前所选视频？'
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={() => {
          setVisible(false);
          MessagePlugin.success(`删除成功${deleteId}`);
        }}
      >
        <p>删除后的所有信息将被清空,且无法恢复</p>
      </Dialog>
    </>
  );
};

export default React.memo(Video);
