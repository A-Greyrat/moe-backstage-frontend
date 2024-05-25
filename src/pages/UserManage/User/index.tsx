import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import { Button, Dialog, MessagePlugin, Row, Table, Tag } from 'tdesign-react';
import {
  USER_PERMISSION_COLOR,
  USER_PERMISSION_OPTIONS,
  USER_STATUS_COLOR,
  USER_STATUS_OPTIONS,
} from './components/consts';
import SearchForm from './components/SearchForm';
import { banUser, getUserList, unbanUser } from 'services/user';
import defaultAvatar from 'assets/image/defaultAvatar.webp';

import Style from './index.module.less';

const User: React.FC<BrowserRouterProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([0, 1]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handleFetchData = useCallback(
    (current: number, size: number, value?: any) => {
      setLoading(true);

      getUserList({
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
            title: '用户头像',
            fixed: 'left',
            align: 'center',
            width: 100,
            colKey: 'avatar',
            cell({ row }) {
              return (
                <img
                  src={row.avatar || defaultAvatar}
                  alt='avatar'
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              );
            },
          },
          {
            title: '用户名称',
            fixed: 'left',
            align: 'left',
            ellipsis: true,
            colKey: 'nickname',
          },
          {
            title: '用户邮箱',
            colKey: 'email',
            ellipsis: true,
          },
          {
            title: '注册时间',
            colKey: 'createTime',
            ellipsis: true,
            cell({ row }) {
              return new Date(row.createTime).toLocaleString();
            },
          },
          {
            title: '用户权限',
            colKey: 'permission',
            ellipsis: true,
            cell({ row }) {
              const permission = row.permission
                .split(',')
                .sort((a: string, b: string) => parseInt(b, 10) - parseInt(a, 10));
              const color = USER_PERMISSION_COLOR[parseInt(permission[0], 10) || 1];
              return (
                <Tag color={color} className={Style.tag}>
                  {USER_PERMISSION_OPTIONS.find((option) => option.value === permission[0])?.label}
                </Tag>
              );
            },
          },
          {
            title: '用户状态',
            colKey: 'status',
            cell({ row }) {
              const color = USER_STATUS_COLOR[row.status];
              return <Tag color={color}>{USER_STATUS_OPTIONS[row.status].label}</Tag>;
            },
          },
          {
            title: '用户ID',
            ellipsis: true,
            colKey: 'id',
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
                      if (userList[record.rowIndex].status === 0) {
                        banUser(userList[record.rowIndex].id).then((res) => {
                          if (res.code === 200) {
                            MessagePlugin.success('封禁成功');
                            handleFetchData(currentPage, pageSize);
                          } else {
                            MessagePlugin.error('封禁失败');
                          }
                        });
                      } else {
                        unbanUser(userList[record.rowIndex].id).then((res) => {
                          if (res.code === 200) {
                            MessagePlugin.success('解封成功');
                            handleFetchData(currentPage, pageSize);
                          } else {
                            MessagePlugin.error('解封失败');
                          }
                        });
                      }
                    }}
                  >
                    {userList[record.rowIndex].status === 0 ? '封禁' : '解封'}
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

export default React.memo(User);
