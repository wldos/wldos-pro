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
    roles,
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
          name="roleName"
          label="角色名称"
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
          name="roleCode"
          label="角色编码"
          rules={[
            {
              required: true,
              message: '请输入编码，不能为空，最多32位！',
              max: 32,
            },
          ]}
        >
          <Input placeholder="请输入编码，不能为空，最多32位！"/>
        </FormItem>
        <FormItem name="roleType" label="角色类型">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="sys_role">系统角色</Option>
            <Option value="subject">社会主体</Option>
            <Option value="tal_role">租户角色</Option>
          </Select>
        </FormItem>
        <FormItem name="parentId" label="父角色">
          <Select
            style={{
              width: '100%',
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

            options={roles}
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

        <FormItem
          name="roleDesc"
          label="描述"
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
        <FormItem name="isValid" label="状态">
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
      title="角色配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          roleName: props.values.roleName,
          roleCode: props.values.roleCode,
          roleType: props.values.roleType,
          parentId: props.values.parentId,
          roleDesc: props.values.roleDesc,
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
