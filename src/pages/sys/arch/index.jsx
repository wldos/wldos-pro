import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {
  addEntity,
  getArchList,
  getComList,
  queryPage,
  removeEntity,
  removeEntitys,
  updateEntity
} from './service';

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
      archName: fields.archName,
      archCode: fields.archCode,
      parentId: fields.parentId,
      comId: fields.comId,
      archDesc: fields.archDesc,
      isValid: fields.isValid,
      displayOrder: fields.displayOrder,
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
  if (!fields) return true;

  if (fields.children) {
    message.info("存在子节点，请先删除子节点");
    return true;
  }
  const hide = message.loading('正在删除');
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

const ArchList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [parentId, setParentId] = useState('0'); // 默认新增实体的父级id为0，如果不是请修改
  const [roleList, setRoleList] = useState({});
  const [roles, setRoles] = useState([]);
  const [comList, setComList] = useState({});
  const [coms, setComs] = useState([]);

  useEffect(async () => {
    const archData = await getArchList();
    const arch = {'0': {text: '平台'},};
    const temp = [{label: '平台', value: '0'}];
    if (archData && archData.data) {
      archData.data.forEach(item => {
        arch[item.id] = {
          text: item.archName,
        }
        temp.push({label: item.archName, value: item.id});
      });
    }
    setRoleList(arch);
    setRoles(temp);
  }, []);
  useEffect(async () => {
    const comData = await getComList();
    const data = {'0': {text: '平台'},};
    const temp = [{label: '平台', value: '0'}];
    if (comData && comData.data) {
      comData.data.forEach(item => {
        data[item.id] = {
          text: item.comName,
        }
        temp.push({label: item.comName, value: item.id});
      });
    }
    setComList(data);
    setComs(temp);
  },[]);

  const columns = [
    {
      title: '体系名称',
      dataIndex: 'archName',
      tip: '体系结构是对组织架构的定义，用来定义平台系统或租户内部的组织架构，不同的体系代表不同的业务方面，是对系统内成员的组织形式划分，比如人事、财务、项目等拥有各自的组织机构，体系上下级之间没有权属关系',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '体系名称为必填项',
          },
          {
            max: 12,
            type: 'string',
            message: '最多12个字',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '体系编码',
      dataIndex: 'archCode',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '体系编码为必填项',
          },
          {
            max: 50,
            type: 'string',
            message: '最多50位',
          },
        ],
      },
    },
    {
      title: '归属公司',
      dataIndex: 'comId',
      filters: true,
      onFilter: false,
      valueEnum: comList,
    },
    {
      title: '描述',
      dataIndex: 'archDesc',
      valueType: 'textarea',
    },
    {
      title: '上级体系',
      dataIndex: 'parentId',
      hideInTable: false,
      hideInForm: true,
      valueEnum: roleList,
    },
    {
      title: '展示顺序',
      dataIndex: 'displayOrder',
      hideInTable: true,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'isValid',
      hideInForm: true,
      filters: true,
      onFilter: false,
      valueEnum: {
        '0': {
          text: '无效',
          status: 'invalid',
        },
        '1': {
          text: '有效',
          status: 'valid',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleModalVisible(true);
              setParentId(record.id);
            }}
          >
            新增子级
          </a>
          <Divider type="vertical"/>
          <a onClick={() => {
            handleModalVisible(true);
            setParentId(record.parentId);
          }}>新增同级</a>
          <Divider type="vertical"/>
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
        headerTitle="体系清单"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key={0} type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const res = await queryPage({
            ...params,
            sorter: {...sorter, 'displayOrder': 'ascend',},
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
            const success = await handleAdd({...value, parentId});

            if (success) {
              handleModalVisible(false);
              setParentId('0');

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
          roles={roles}
          coms={coms}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.archName && (
          <ProDescriptions
            column={2}
            title={row?.archName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.archName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ArchList;