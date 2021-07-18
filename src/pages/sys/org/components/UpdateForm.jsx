import React from 'react';
import {Button, Form, Input, Modal, Select} from 'antd';

const FormItem = Form.Item;
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
    coms,
    archs,
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
          name="orgName"
          label="组织名称"
          rules={[
            {
              required: true,
              message: '请输入名称，不能为空，最多60个字！',
              max: 60,
            },
          ]}
        >
          <Input placeholder="请输入，不能为空，最多60个字！"/>
        </FormItem>
        <FormItem
          name="orgCode"
          label="组织编码"
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
        <FormItem name="orgType" label="组织类型">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="platform">系统用户组</Option>
            <Option value="org">组织机构</Option>
            <Option value="role_org">角色组</Option>
            <Option value="team">团队</Option>
            <Option value="group">群组</Option>
            <Option value="circle">圈子</Option>
          </Select>
        </FormItem>
        <FormItem name="parentId" label="上级组织">
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
        <FormItem name="comId" label="归属公司">
          <Select
            style={{
              width: '100%',
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

            options={coms}
          >
          </Select>
        </FormItem>
        <FormItem name="archId" label="归属体系">
          <Select
            style={{
              width: '100%',
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

            options={archs}
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
      title="公司配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          orgName: props.values.orgName,
          orgCode: props.values.orgCode,
          orgType: props.values.orgType,
          parentId: props.values.parentId,
          comId: props.values.comId,
          archId: props.values.archId,
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
