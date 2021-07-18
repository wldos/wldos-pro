import ProLayout from '@ant-design/pro-layout';
import React, {useEffect, useMemo, useRef} from 'react';
import {connect, history, Link, useIntl} from 'umi';
import {BackTop, Button, Result} from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import {getMatchMenu} from '@umijs/route-utils';
import logo from '../assets/logo-wldos.png';
import wldosFooterDom from '@/layouts/foot';
import styles from '@/wldos.less';
import {Helmet} from "@/.umi/plugin-helmet/exports";
import {getHome} from "@/utils/utils";
import {
  FormOutlined,
  HomeOutlined,
  SmileOutlined,
  TableOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import Authorized from "@/components/Authorized/Authorized";

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
const iconMap = {
  home: <HomeOutlined/>,
  smile: <SmileOutlined/>,
  form: <FormOutlined/>,
  list: <UnorderedListOutlined/>,
  table: <TableOutlined/>,
};
const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    location = {
      pathname: '/',
    },
    menuData, // 从后端取菜单数据,路由仍然配置在config中。
    loading,
  } = props;
  /**
   * use Authorized check all menu item 检查所有菜单权限,只取有权限的菜单显示
   * 因为权限已经在后端过滤，返回的都是有权限菜单，不必检查权限。
   */
  const menuHandle = (menus) =>
    menus.map((item) => {
      const localItem = {
        ...item,
        icon: item.icon && iconMap[item.icon],
        children: item.children && menuHandle(item.children),
      };
      return Authorized.check(item.authority, localItem, null);
    });


  const menuDataRef = useRef([]);
  // 用户刚打开网站，应该是游客，触发请求，后台判断header中的token
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */
  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  /*  // get children authority */
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const {formatMessage} = useIntl();

  // 定义seo标签，首页取默认配置，内容页需要传递
  const headProps = location.pathname === getHome() ? {
    title: props.title,
    keywords: props.keywords,
    description: props.description
  } : {
    title: `${props.bookTitle || '无标题文档'}-${props.title}`,
    keywords: props.bookTag || '',
    description: props.bookDesc || ''
  };

  const wldosHeader = (
    /* 可自定义需不需要编码 */
    <Helmet encodeSpecialCharacters={false}>
      <html lang="zh_CN"/>
      <meta name="keywords" content={headProps.keywords}/>
      <meta name="description" content={headProps.description}/>
      <title>{headProps.title}</title>
    </Helmet>
  );

  return (
    <>
      {wldosHeader}
      <ProLayout
        className={styles.topNavWldos}
        logo={logo}
        // formatMessage={formatMessage} // 关掉国际化输出防止未作国际化处理时报错，不从menu改是因为top布局时menu设置menu={{loading, locale: false}}会导致刷新时多个齿轮效果
        menuDataRender={() => menuHandle(menuData)} // menuData 的 render 方法，用来自定义 menuData
        {...props}
        menu={loading}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if ( // 自定义菜单项的 渲染 方法
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}
                       target={menuItemProps.target?? '_self'}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          { // 自定义面包屑的数据
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) < routes.length - 1;
          return first ? ( // 只有存在子菜单时，面包屑才会展示
            <Link to={route.path}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuHeaderRender={(lgo/* , title */) => {
          return lgo;
        }}
        // pageTitleRender={(props) => { console.log('pageTitleRender>>>', props); return 'wldos'; }}
        footerRender={() => wldosFooterDom}
        rightContentRender={() => <RightContent/>}
        postMenuData={(menu) => { // 在显示前对菜单数据进行查看，修改不会触发重新渲染
          menuDataRef.current = menu || [];
          return menu || [];
        }}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      <BackTop/>
    </>
  );
};

export default connect(({global, settings, user, loading}) => ({
  collapsed: global.collapsed,
  menuData: user.menuData,
  loading: loading.models.user,
  ...settings,
}))(BasicLayout);
