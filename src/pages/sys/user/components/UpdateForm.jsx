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
          name="accountName"
          label="昵称"
          rules={[
            {
              required: true,
              message: '请输入昵称，不能为空，最多60个字！',
              min: 1,
              max: 60,
            },
          ]}
        >
          <Input placeholder="请输入，不能为空，最多60个字！"/>
        </FormItem>
        <FormItem
          name="remark"
          label="简介"
          rules={[
            {
              required: false,
              message: '最多50个字！',
              max: 50,
            },
          ]}
        >
          <TextArea rows={4} placeholder="请输入，最多50个字"/>
        </FormItem>
        <FormItem
          name="loginName"
          label="登录名"
          rules={[
            {
              required: true,
              message: '最多60位！',
              max: 60,
            },
          ]}
        >
          <Input placeholder="请输入登录名，最多60位"/>
        </FormItem>
        <FormItem
          name="passwd"
          label="密码"
          rules={[
            {
              required: true,
              message: '最多120个半角字符！',
              max: 120,
            },
          ]}
        >
          <Input placeholder="请输入密码"/>
        </FormItem>
        <FormItem name="status" label="状态">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="locked">已锁定</Option>
            <Option value="cancelled">已注销</Option>
            <Option value="normal">正常</Option>
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {

    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>提交</Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="用户配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          accountName: props.values.accountName,
          remark: props.values.remark,
          loginName: props.values.loginName,
          passwd: props.values.passwd,
          status: props.values.status,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
