/* import {Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons'; */
import React from 'react';
import {history, connect, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import {Button} from "antd";

const GlobalHeaderRight = (props) => {
    const {theme, layout, currentUser = {
        avatar: '',
        name: '',
    },} = props;
    let className = styles.right;

    if (theme === 'dark' &&  layout === 'top') {
        className = `${styles.right}  ${styles.dark}`;
    }
    const search = (pathname = '/search', value, type = 'book') => {
        const data = {wd: value, tp: type};
        const path = {
            pathname,
            state: data,
        };
        history.push(path);
    }

    return (
        <div className={className}>
            <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                defaultValue="个人信息"
                options={[
                    {
                        label: <a onClick={() => search('/search', '个人信息', 'book')}
                                  href="#">个人信息</a>,
                        value: '个人信息',
                    },
                    {
                        label: <a onClick={() => search('/search', '历史信息', 'book')}
                                  href="#">历史信息</a>,
                        value: '历史信息',
                    },
                    {
                        label: <a onClick={() => search('/search', '秦始皇', 'book')}
                                  href="#">秦始皇</a>,
                        value: '秦始皇',
                    },
                    {
                        label: <a onClick={() => search('/search', '成吉思汗', 'book')}
                                  href="#">成吉思汗</a>,
                        value: '成吉思汗',
                    },
                ]}
                onSearch={value => {
                    search('/search', value, 'book');
                }}
            />
            {
                currentUser && currentUser.name ? (<NoticeIconView/>) : ('')
            }
            <Avatar menu/>
          {/* <SelectLang className={styles.action}/> */}
        </div>
    )
}

export default connect(({ settings }) => ({
theme: settings.navTheme,
layout: settings.layout,
}))(GlobalHeaderRight);
