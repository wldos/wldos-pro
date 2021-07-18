import ProLayout from '@ant-design/pro-layout';
import React, {useEffect, useMemo, useRef} from 'react';
import {connect, history, Link, useIntl} from 'umi';
import {BackTop, Button, Result} from 'antd';
import RightContent from '@/components/GlobalHeader/RightContentAdmin';
import {getMatchMenu} from '@umijs/route-utils';
import logo from '../assets/logo-wldos.png';
import wldosFooterDom from '@/layouts/foot';
import styles from '@/wldos.less';
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
const AdminLayout = (props) => {
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
      dispatch({
        type: 'user/fetchAdminMenu',
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
  return (
    <>
      <ProLayout
        className={styles.slideNavWldos}
        logo={logo}
        formatMessage={formatMessage}
        menuDataRender={() => menuHandle(menuData)} // menuData 的 render 方法，用来自定义 menuData
        {...props}
        menu={{loading, locale: false}}
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

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
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
          return first ? (
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
  menuData: user.adminMenu,
  loading: loading.models.user,
  ...settings,
  layout: "side",
  contentWidth: "Fluid",
  headerHeight: 48,
}))(AdminLayout);
