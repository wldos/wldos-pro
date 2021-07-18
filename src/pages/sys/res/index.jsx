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
  getAppList,
  getResList,
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
      resourceName: fields.resourceName,
      resourcePath: fields.resourcePath,
      resourceCode: fields.resourceCode,
      resourceType: fields.resourceType,
      icon: fields.icon,
      requestMethod: fields.requestMethod,
      target: fields.target,
      appId: fields.appId,
      isValid: fields.isValid,
      id: fields.id,
      parentId: fields.parentId,
      remark: fields.remark,
      displayOrder: fields.displayOrder,
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

const ResourceList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [parentId, setParentId] = useState('0'); // 默认新增实体的父级id为0，如果不是请修改
  const [resList, setResList] = useState({});
  const [reses, setReses] = useState([]);
  const [appList, setAppList] = useState({});
  const [apps, setApps] = useState([]);

  useEffect(async () => {
    const res = await getAppList();

    if (res && res.data) {
      const data = {};
      const temp = [];
      res.data.forEach(item => {
          data[item.id] = {
            text: item.appName,
            value: item.id,
          }
        temp.push({label: item.appName, value: item.id});
      });
      setAppList(data);
      setApps(temp);
    }

    const resData = await getResList();

    const data = {'0': {text: '根资源'}};
    const temp = [{label: '根资源', value: '0'}];

    if (resData && resData.data) {
      resData.data.forEach(item => {
        data[item.id] = {
          text: item.resourceName,
          value: item.id,
        }
        temp.push({label: item.resourceName, value: item.id});
      });
    }
    setResList(data);
    setReses(temp);
  }, []);
  const columns = [
    {
      title: '资源名称',
      dataIndex: 'resourceName',
      tip: '资源包括菜单、组件、api或静态资源，特点是需要用确定的方式请求(URI+HTTP METHOD)',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '资源名称为必填项',
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
      title: '资源编码',
      dataIndex: 'resourceCode',
      tip: '菜单和路由保持一致：资源编码在同一应用下唯一，资源编码原则上取urlPattern的叶子节点：/appCode/resName，子资源名称在父资源名称之后。',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '应用编码为必填项',
          },
          {
            max: 50,
            type: 'string',
            message: '最大50个字符',
          },
        ],
      },
    },
    {
      title: '资源路径',
      dataIndex: 'resourcePath',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '资源路径为必填项',
          },
          {
            max: 250,
            type: 'string',
            message: '最大250个字符',
          },
        ],
      },
    },
    {
      title: 'icon名称',
      dataIndex: 'icon',
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      filters: true,
      onFilter: false,
      valueEnum: {
        'menu': {
          text: '菜单',
        },
        'button': {
          text: '操作',
        },
        'admin_menu': {
          text: '管理菜单',
        },
        'webServ': {
          text: '服务',
        },
        '_static': {
          text: '静态',
        },
      },
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
      filters: true,
      onFilter: false,
      valueEnum: {
        GET: {
          text: 'GET',
        },
        POST: {
          text: 'POST',
        },
        PUT: {
          text: 'PUT',
        },
        DELETE: {
          text: 'DELETE',
        },
      },
    },
    {
      title: '打开方式',
      dataIndex: 'target',
      valueEnum: {
        'self': {
          text: '_self',
        },
        'blank': {
          text: '_blank',
        },
        'parent': {
          text: '_parent',
        },
        'top': {
          text: '_top',
        },
      },
    },
    {
      title: '上级资源',
      dataIndex: 'parentId',
      hideInTable: true,
      hideInForm: true,
      valueEnum: resList,
    },
    {
      title: '展示顺序',
      dataIndex: 'displayOrder',
      hideInTable: true,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '归属应用',
      dataIndex: 'appId',
      filters: true,
      onFilter: false,
      valueEnum: appList,
    },
    {
      title: '资源描述',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: '资源状态',
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
        headerTitle="资源清单"
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
              <span>
                应用调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
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
          apps={apps}
          reses={reses}
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
        {row?.resourceName && (
          <ProDescriptions
            column={2}
            title={row?.resourceName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.resourceName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ResourceList;
