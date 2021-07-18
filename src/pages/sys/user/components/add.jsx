import {Button, message, Modal} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {queryPage} from "@/pages/sys/user/service";

const AddUserList = (props) => {
  const {
    values,
    onSubmit: addUser,
    modalVisible,
    onCancel,
  } = props;
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const {orgId = '', archId = '', comId = ''} = values;

  const handleAdd = async (selectedRows) => {
    const hide = message.loading('正在添加');

    try {
      await addUser({
        ids: selectedRows.map((row) => row.id),
        orgId,
        archId,
        comId
      });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const columns = [
    {
      title: '昵称',
      dataIndex: 'accountName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '昵称为必填项',
          },
          {
            max: 60,
            type: 'string',
            message: '最多60个字',
          },
        ],
      },
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      hideInForm: true,
      valueType: 'string',
    },
    {
      title: '账号',
      dataIndex: 'loginName',
      tip: '登录用户名',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '账号为必填项',
          },
          {
            max: 30,
            type: 'string',
            message: '最大30个字符',
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      onFilter: false,
      valueEnum: {
        locked: {
          text: '已锁定',
        },
        cancelled: {
          text: '已注销',
        },
        normal: {
          text: '正常',
        }
      },
    },
  ];
  return (
    <Modal
      width={"fit-content"}
      destroyOnClose
      title="添加成员"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable
        headerTitle="用户清单"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sorter, filter) => {
          const res = await queryPage({
            ...params,
            sorter,
            filter
          });
          return Promise.resolve({
            total: res.data.total || 0,
            data: res.data.rows || [],
            success: true,
          });
        }
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleAdd(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            添加成员
          </Button>
        </FooterToolbar>
      )}
    </Modal>
  );
};

export default AddUserList;
