import { DefaultFooter } from '@ant-design/pro-layout';
import { GithubOutlined } from '@ant-design/icons';
import React from 'react';

const wldosFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} WLDOS XICP备2xxxx011号`}
    links={[
      {
        key: '智乐兔科技',
        title: '智乐兔科技',
        href: 'https://www.zhiletu.com',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/wldos',
        blankTarget: true,
      },
      {
        key: 'Udast机器人',
        title: 'Udast机器人',
        href: 'https://www.ypgpt.com',
        blankTarget: true,
      },
    ]}
  />
);

export default wldosFooterDom;
