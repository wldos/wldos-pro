import React, {useState} from 'react'
import {Button, Modal, Tree} from 'antd';

const AuthRes = (props) => {
  const {
    onSubmit: handleAuth,
    onCancel: handleAuthModalVisible,
    authModalVisible,
    existRes,
    res,
    values,
  } = props;

  const [expandedKeys, setExpandedKeys] = useState(['0']);
  const [checkedKeys, setCheckedKeys] = useState(existRes);
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeysValue) => {

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };
  /*
  const onSelect = (selectedKeysValue, info) => {
    console.log('onselect=', selectedKeysValue, selectedKeys);
    setSelectedKeys(selectedKeysValue);
  }; */

  const handleAddRes = () => {
    handleAuth({roleIds: checkedKeys, orgId: values.id, archId: values.archId, comId: values.comId});
  }

  const renderFooter = () =>
    (
      <>
        <Button onClick={() => handleAuthModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleAddRes()}>授权</Button>
      </>
    );

  return (
    <Modal
      width={640}
      height={700}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="组织授权"
      visible={authModalVisible}
      footer={renderFooter()}
      onCancel={() => handleAuthModalVisible()}
    >
      <Tree
        checkable
        showLine
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        // onSelect={onSelect}
        // selectedKeys={selectedKeys}
        treeData={res}
      />
    </Modal>
  );
}

export default AuthRes;
