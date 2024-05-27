import React, { useEffect, useState } from 'react';
import { BrowserRouterProps, useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Dialog, MessagePlugin, Table } from 'tdesign-react';
import { changeEpisodeIndex, deleteEpisode, getPlainVideoGroupEpisodeList, IEpisodeListItem } from 'services/video';
import { MoveIcon } from 'tdesign-icons-react';

const Episode: React.FC<BrowserRouterProps> = () => {
  const { id } = useParams() || {};
  const [loading, setLoading] = useState(false);
  const [episodeList, setEpisodeList] = useState<IEpisodeListItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number>('');
  const navigate = useNavigate();

  const handleFetchData = () => {
    if (!id) return;
    setLoading(true);
    getPlainVideoGroupEpisodeList({ id: parseInt(id, 10) }).then((res) => {
      setEpisodeList(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  if (!id) {
    window.location.href = '/video/group';
  }

  return (
    <Card>
      <Button
        theme='primary'
        style={{ marginBottom: '20px' }}
        onClick={() => {
          navigate(`/video/bangumi/episode/add/${id}`);
        }}
      >
        添加分集
      </Button>
      <Table
        loading={loading}
        data={episodeList}
        dragSort='row-handler'
        onDragSort={(data) => {
          changeEpisodeIndex(
            data.newData.map((item, index) => ({
              videoId: item.videoId,
              index: index + 1,
            })),
          ).then((res) => {
            if (res.code === 200) {
              handleFetchData();
            } else {
              MessagePlugin.error('修改失败');
            }
          });
        }}
        columns={[
          {
            colKey: 'drag',
            title: '排序',
            cell: () => (
              <span>
                <MoveIcon />
              </span>
            ),
            width: 46,
          },
          {
            title: '视频ID',
            colKey: 'videoId',
          },
          {
            title: '分集标题',
            colKey: 'title',
          },
          {
            title: 'Index',
            colKey: 'index',
            align: 'center',
          },
          {
            title: '操作',
            colKey: 'op',
            align: 'center',
            cell: (row) => (
              <div>
                <Button
                  theme='primary'
                  variant='text'
                  onClick={() => {
                    navigate(`/video/bangumi/episode/edit/${episodeList[row.rowIndex].videoId}`);
                  }}
                >
                  编辑
                </Button>
                <Button
                  theme='danger'
                  variant='text'
                  onClick={() => {
                    setVisible(true);
                    setDeleteId(episodeList[row.rowIndex].videoId);
                  }}
                >
                  删除
                </Button>
              </div>
            ),
          },
        ]}
        rowKey='index'
      />
      <Dialog
        header='确认删除当前所选视频？'
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={() => {
          setVisible(false);
          deleteEpisode(parseInt(deleteId.toString(), 10)).then((res) => {
            if (res.code === 200) {
              handleFetchData();
              MessagePlugin.success(`删除成功`);
            } else {
              MessagePlugin.error('删除失败');
            }
          });
        }}
      >
        <p>删除后的所有信息将被清空,且无法恢复</p>
      </Dialog>
    </Card>
  );
};

export default React.memo(Episode);
