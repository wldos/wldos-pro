import React from 'react';
import {Button, Form, Input, Modal, Select} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    apps,
    reses
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    const value = {...values, ...fieldsValue};
    handleUpdate(value);
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="resourceName"
          label="资源名称"
          rules={[
            {
              required: true,
              message: '请输入名称，不能为空，最多25个字！',
              max: 25,
            },
          ]}
        >
          <Input placeholder="请输入，不能为空，最多25个字！"/>
        </FormItem>
        <FormItem
          name="resourceCode"
          label="资源编码"
          rules={[
            {
              required: true,
              message: '最多50个字母！',
              max: 50,
            },
          ]}
        >
          <Input placeholder="请输入英文编码，最多50个"/>
        </FormItem>
        <FormItem
          name="resourcePath"
          label="资源路径"
          rules={[
            {
              required: true,
              message: '最多250个字母！',
              max: 250,
            },
          ]}
        >
          <Input placeholder="请输入英文或符号字符，最多250个"/>
        </FormItem>
        <FormItem
          name="icon"
          label="icon名称"
        >
          <Input placeholder="请输入icon front中的名称"/>
        </FormItem>
        <FormItem name="resourceType" label="资源类型">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="menu">菜单</Option>
            <Option value="button">操作</Option>
            <Option value="admin_menu">管理菜单</Option>
            <Option value="webServ">服务</Option>
            <Option value="_static">静态</Option>
          </Select>
        </FormItem>
        <FormItem name="requestMethod" label="请求方法">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        </FormItem>
        <FormItem name="target" label="打开方式">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="_self">self</Option>
            <Option value="_blank">blank</Option>
            <Option value="_parent">parent</Option>
            <Option value="_top">top</Option>
          </Select>
        </FormItem>
        <FormItem name="parentId" label="上级资源">
          <Select
            style={{
              width: '100%',
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

            options={reses}
          >
          </Select>
        </FormItem>
        <FormItem
          name="displayOrder"
          label="展示顺序"
          rules={[
            {
              required: true,
              message: '展示顺序1~100！',
              pattern: '^([1-9]|[1-9]\\d|100)$',
              max: 3,
            },
          ]}
        >
          <Input placeholder="请输入数字"/>
        </FormItem>
        <FormItem name="appId" label="归属应用">
          <Select
            style={{
              width: '100%',
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

            options={apps}
          >
          </Select>
        </FormItem>
        <FormItem
          name="remark"
          label="资源描述"
          rules={[
            {
              required: false,
              message: '最多50个字！',
              max: 50,
            },
          ]}
        >
          <TextArea rows={4} placeholder="请输入描述，最多50个字"/>
        </FormItem>
        <FormItem name="isValid" label="应用状态">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="1">有效</Option>
            <Option value="0">无效</Option>
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () =>
    (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>提交</Button>
      </>
    );

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="应用配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          resourceName: props.values.resourceName,
          resourceCode: props.values.resourceCode,
          resourcePath: props.values.resourcePath,
          icon: props.values.icon,
          resourceType: props.values.resourceType,
          requestMethod: props.values.requestMethod,
          target: props.values.target,
          parentId: props.values.parentId,
          appId: props.values.appId,
          remark: props.values.remark,
          isValid: props.values.isValid,
          displayOrder: props.values.displayOrder,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
