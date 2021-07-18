import React from 'react';
import {Modal} from 'antd';
import UserList from "@/pages/sys/user";

const AddUserForm = (props) => {
  const {
    onCancel: handleAddUserModalVisible,
    addUserModalVisible,
    values,
    addUser
  } = props;


  return (
    <Modal
      width={"fit-content"}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      visible={addUserModalVisible}
      title={values.orgName}
      footer={null}
      onCancel={() => handleAddUserModalVisible()}
    >
      <UserList  orgId={values.id} archId={values.archId} comId={values.comId} addUser={addUser}/>
    </Modal>
  );
};

export default AddUserForm;
