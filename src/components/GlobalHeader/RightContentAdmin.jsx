import {Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import React from 'react';
import {connect, SelectLang} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';

const GlobalHeaderRightAdmin = (props) => {
    const {theme, layout, currentUser = {
        avatar: '',
        name: '',
    },} = props;
    let className = styles.right;

    if (theme === 'dark' &&  layout === 'top') {
        className = `${styles.right}  ${styles.dark}`;
    }

    return (
        <div className={className}>
            { <Tooltip title="使用文档">
                <a
                    style={{
                        color: 'inherit',
                    }}
                    target="_blank"
                    href="#"
                    rel="noopener noreferrer"
                    className={styles.action}
                >
                    <QuestionCircleOutlined/>
                </a>
            </Tooltip> }
            {
                currentUser && currentUser.name ? (<NoticeIconView/>) : ('')
                // @TODO isManageSide从后端取
            }
            <Avatar menu isManageSide={0}/>
          {/* <SelectLang className={styles.action}/> */}
        </div>
    )
}

export default connect(({ settings }) => ({
theme: settings.navTheme,
layout: settings.layout,
}))(GlobalHeaderRightAdmin);
