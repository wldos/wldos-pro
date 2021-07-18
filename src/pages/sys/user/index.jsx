import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {addEntity, queryPage, removeEntity, removeEntitys, updateEntity} from './service';
import AddUserList from "@/pages/sys/user/components/add";

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addEntity({...fields});
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateEntity({
      accountName: fields.accountName,
      remark: fields.remark,
      loginName: fields.loginName,
      passwd: fields.passwd,
      status: fields.status,
      id: fields.id,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  批量删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeEntitys({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */
const handleRemoveOne = async (fields) => {
  const hide = message.loading('正在删除');
  if (!fields) return true;

  try {
    await removeEntity({
      id: fields.id,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const UserList = (props) => {
  const {orgId = '', archId = '', comId = '', addUser} = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [addModalVisible, handleAddModalVisible] = useState(false);

  const columns = [
    {
      title: '昵称',
      dataIndex: 'accountName',
      tip: '用户指注册会员，可以是自然人或者法人，不同身份可以认证',
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
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
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
      title: '密码',
      dataIndex: 'passwd',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '密码为必填项,最多120位字符',
            max: 120,
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
    {
      title: '简介',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      hideInForm: true,
      valueType: 'string',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: orgId !== '',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical"/>
          <a onClick={async () => {
            await handleRemoveOne(record);
            actionRef.current?.reloadAndRest?.();
          }}>删除</a>
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="用户清单"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key={1} type="primary" hidden={orgId === ''}  onClick={() => handleAddModalVisible(true)}>
            <PlusOutlined/> 添加
          </Button>,
          <Button key={0} type="primary" hidden={orgId !== ''} onClick={() => handleModalVisible(true)}>
            <PlusOutlined/> 新增
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const ps = (orgId && archId && comId) ? {orgId, archId, comId,} : {};
          const res = await queryPage({
            ...params,
            ...ps,
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
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量导出</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)}
                  modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {orgId !== '' ? (
        <AddUserList
          onCancel={() => handleAddModalVisible(false)}
          modalVisible={addModalVisible}
          onSubmit={async (value) => {
            const success = await addUser(value);

            if (success) {
              handleAddModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          addModalVisible={addModalVisible}
          values={{orgId, archId, comId}}
        />) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.accountName && (
          <ProDescriptions
            column={2}
            title={row?.accountName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.accountName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
