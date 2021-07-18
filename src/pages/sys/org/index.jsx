import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, message, Popconfirm} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { QuestionCircleOutlined } from '@ant-design/icons';
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
  updateEntity,
  addOrgUser
} from './service';
import AuthRes from "@/pages/sys/org/components/AuthRole";
import {getComList, getArchList} from "@/pages/sys/arch/service";
import AddUserForm from "@/pages/sys/org/components/AddUserForm";

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
      orgName: fields.orgName,
      orgCode: fields.orgCode,
      orgType: fields.orgType,
      comId: fields.comId,
      archId: fields.archId,
      parentId: fields.parentId,
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
const handleAuth = async (fields = {roleIds: [], orgId: '', archId: '', comId: ''}, existRes = []) => {
  if (existRes?.length === fields.roleIds?.length &&
      fields.roleIds.every(id => existRes.some(eid => eid === id))) {
    message.info('没有任何改变，不做操作！');
    return false;
  }

  const hide = message.loading('正在授权');

  try {
    await authRole({
      roleIds: fields.roleIds,
      orgId: fields.orgId,
      archId: fields.archId,
      comId: fields.comId,
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
const addUser = async (value={ids: [], orgId: '', archId: '', comId: ''}) => {
  if (!!value && value.ids?.length === 0) {
    message.info('请选择要添加的成员！');
    return false;
  }

  const hide = message.loading('正在添加');

  try {
    await addOrgUser({
      userIds: value.ids,
      orgId: value.orgId,
      archId: value.archId,
      comId: value.comId
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

const OrgList = () => {
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
  const [comList, setComList] = useState({});
  const [coms, setComs] = useState([]);
  const [archList, setArchList] = useState({});
  const [archs, setArchs] = useState([]);
  const [addUserModalVisible, handleAddUserModalVisible] = useState(false);
  const [addUserValues, setAddUserValues] = useState({});

  useEffect(async () => {
    const roleData = await getRoleList();

    let data = {'0': {text: '平台'},};
    let temp = [{label: '平台', value: '0'}];
    if (roleData && roleData.data) {

      roleData.data.forEach(item => {
        data[item.id] = {
          text: item.orgName,
        }
        temp.push({label: item.orgName, value: item.id});
      });

    }
    setRoleList(data);
    setRoles(temp);

    const comData = await getComList();
    data = {'0': {text: '平台'},};
    temp = [{label: '平台', value: '0'}];
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

    const archData = await getArchList();
    data = {'0': {text: '平台'},};
    temp = [{label: '平台', value: '0'}];
    if (archData && archData.data) {
      archData.data.forEach(item => {
        data[item.id] = {
          text: item.archName,
        }
        temp.push({label: item.archName, value: item.id});
      });
    }
    setArchList(data);
    setArchs(temp);
  }, []);

  const queryExistRes = async (orgId) => {
    const res = await getExistRes({orgId});

    return res;
  };

  const columns = [
    {
      title: '组织名称',
      dataIndex: 'orgName',
      tip: '组织是业务域运营的人员管理',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '组织名称为必填项',
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
      title: '组织编码',
      dataIndex: 'orgCode',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '组织编码为必填项',
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
      title: '组织类型',
      dataIndex: 'orgType',
      filters: true,
      onFilter: false,
      valueEnum: {
        'platform': {
          text: '系统用户组',
        },
        'org': {
          text: '组织机构',
        },
        'role_org': {
          text: '角色组',
        },
        'team': {
          text: '团队',
        },
        'group': {
          text: '群组',
        },
        'circle': {
          text: '圈子',
        }
      },
    },
    {
      title: '上级组织',
      dataIndex: 'parentId',
      hideInTable: true,
      hideInForm: true,
      valueEnum: roleList,
    },
    {
      title: '归属公司',
      dataIndex: 'comId',
      filters: true,
      onFilter: false,
      valueEnum: comList,
    },
    {
      title: '归属体系',
      dataIndex: 'archId',
      filters: true,
      onFilter: false,
      valueEnum: archList,
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
                  const {orgRole = [], authRes = []} = res.data;
                  const temp = orgRole.map(item => item.id);
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
          <a
            onClick={() => {
              handleAddUserModalVisible(true);
              setAddUserValues(record);
            }}
          >
            人员
          </a>
          <Divider type="vertical"/>
          <Popconfirm title="您确定要删除？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
           onConfirm={async () => {
             await handleRemoveOne(record);
             actionRef.current?.reloadAndRest?.();
           }}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="组织清单"
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
          <Popconfirm title="您确定要删除？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={async () => {
                        await handleRemove(selectedRowsState);
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                      }}>
            <Button>
              批量删除
            </Button>
          </Popconfirm>
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
          archs={archs}
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
      {addUserValues && Object.keys(addUserValues).length ?
      <AddUserForm
        onCancel={() => {
          handleAddUserModalVisible(false);
          setAddUserValues({});
        }}
        addUserModalVisible={addUserModalVisible}
        values={addUserValues}
        addUser={addUser}
      /> : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.orgName && (
          <ProDescriptions
            column={2}
            title={row?.orgName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.orgName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrgList;