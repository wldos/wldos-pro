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
  authRole,
  getExistRes,
  getRoleList,
  queryPage,
  removeEntity,
  removeEntitys,
  updateEntity
} from './service';
import AuthRes from "@/pages/sys/role/components/AuthRes";

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
      roleName: fields.roleName,
      roleCode: fields.roleCode,
      roleType: fields.roleType,
      parentId: fields.parentId,
      roleDesc: fields.roleDesc,
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
/**
 * 角色授权
 * @param fields
 */
const handleAuth = async (fields = {roleIds: [], roleId: ''}, existRes = []) => {
  if (existRes?.length === fields.roleIds?.length && fields.roleIds.every(id => existRes.some(eid => eid === id))) {
    message.info('没有任何改变，不做操作！');
    return false;
  }

  const hide = message.loading('正在授权');

  try {
    await authRole({
      resIds: fields.resIds,
      roleId: fields.roleId,
    });
    hide();
    message.success('授权成功');
    return true;
  } catch (error) {
    hide();
    message.error('授权失败请重试！');
    return false;
  }
};

const RoleList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [authModalVisible, handleAuthModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [parentId, setParentId] = useState('0'); // 默认新增实体的父级id为0，如果不是请修改
  const [roleList, setRoleList] = useState({});
  const [roles, setRoles] = useState([]);
  const [resTree, setResTree] = useState([]);
  const [existRes, setAuthRes] = useState([]);
  const [authRoleValues, setAuthRoleValues] = useState({});

  useEffect(async () => {
    const roleData = await getRoleList();

    const data = {'0': {text: '根角色'},};
    const temp = [{label: '根角色', value: '0'}];
    if (roleData && roleData.data) {

      roleData.data.forEach(item => {
        data[item.id] = {
          text: item.roleName,
        }
        temp.push({label: item.roleName, value: item.id});
      });

    }
    setRoleList(data);
    setRoles(temp);
  }, []);

  const queryExistRes = async (roleId) => {
    const res = await getExistRes({roleId});

    return res;
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      tip: '角色是资源和用户的纽带，角色决定权限，角色继承以降低重复工作量',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色名称为必填项',
          },
          {
            max: 25,
            type: 'string',
            message: '最多25个字',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色编码为必填项',
          },
          {
            max: 32,
            type: 'string',
            message: '最多32位',
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'roleDesc',
      valueType: 'textarea',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      filters: true,
      onFilter: false,
      valueEnum: {
        'sys_role': {
          text: '系统角色',
        },
        'subject': {
          text: '社会主体',
        },
        'tal_role': {
          text: '租户角色',
        },
      },
    },
    {
      title: '父角色',
      dataIndex: 'parentId',
      hideInTable: true,
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
          <a
            onClick={() => {
              queryExistRes(record.id).then(res => {
                if (res && res.data && res.data.authRes) {
                  const {roleRes = [], authRes = []} = res.data;
                  const temp = roleRes.map(item => item.id);
                  setAuthRes([...temp]);
                  setResTree(authRes);

                  setAuthRoleValues(record);
                  handleAuthModalVisible(true);
                }
              });
            }}
          >
            授权
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
        headerTitle="角色清单"
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
        />
      ) : null}
      {authRoleValues && Object.keys(authRoleValues).length ?
        <AuthRes
          onSubmit={async (value) => {
            const success = await handleAuth(value, existRes);

            if (success) {
              handleAuthModalVisible(false);
              setAuthRoleValues({});
              setResTree([]);
              setAuthRes([]);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleAuthModalVisible(false);
            setAuthRoleValues({});
            setResTree([]);
            setAuthRes([]);
          }}
          authModalVisible={authModalVisible}
          res={resTree}
          existRes={existRes}
          values={authRoleValues}
        />
        : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.roleName && (
          <ProDescriptions
            column={2}
            title={row?.roleName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.roleName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;