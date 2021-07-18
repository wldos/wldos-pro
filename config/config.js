// https://umijs.org/config/
import {defineConfig} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const {REACT_APP_ENV} = process.env;
export default defineConfig({
  // ssr: {},
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes:
    [
      {
        path: '/',
        component: '../layouts/BlankLayout',
        routes: [
          {
            path: '/user',
            component: '../layouts/UserLayout',
            routes: [
              {
                path: '/user/login',
                //    name: 'login',
                component: './User/login',
              },
              {
                path: '/user',
                redirect: '/user/login',
              },
              {
                //   name: 'register-result',
                //   icon: 'smile',
                path: '/user/register-result',
                component: './user/register-result',
              },
              {
                //   name: 'register',
                //   icon: 'smile',
                path: '/user/register',
                component: './user/register',
              },
              {
                component: '404',
              },
            ],
          },
          {
            path: '/admin',
            component: '../layouts/AdminLayout',
            routes: [
              {
                path: '/admin',
                redirect: '/admin/dashboard',
              },
              {
                path: '/admin/dashboard',
                component: './dashboard/monitor',
              },
              {
                path: '/admin/sys',
                routes: [
                  {
                    path: '/admin/sys',
                    redirect: '/admin/dashboard',
                  },
                  {
                    path: '/admin/sys/app',
                    component: './sys/app',
                  },
                  {
                    path: '/admin/sys/res',
                    component: './sys/res',
                  },
                  {
                    path: '/admin/sys/role',
                    component: './sys/role',
                  },
                  {
                    path: '/admin/sys/com',
                    component: './sys/com',
                  },
                  {
                    path: '/admin/sys/arch',
                    component: './sys/arch',
                  },
                  {
                    path: '/admin/sys/org',
                    component: './sys/org',
                  },
                  {
                    path: '/admin/sys/user',
                    component: './sys/user',
                  },
                ],
              },
            ],
          },
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                name: 'home',
                icon: 'home',
                redirect: '/dashboard/analysis',
              },
              {
                name: 'analysis',
                icon: 'smile',
                path: '/dashboard/analysis',
                component: './dashboard/analysis',
              },
              {
                path: '/search',
                component: './search',
              },
              {
                path: '/list',
                // icon: 'table',
                // name: 'list',
                routes: [
                  {
                    path: '/list/search',
                    //  name: 'search-list',
                    component: './list/search',
                    routes: [
                      {
                        path: '/list/search',
                        redirect: '/list/search/articles',
                      },
                      {
                        //   name: 'articles',
                        //  icon: 'smile',
                        path: '/list/search/articles',
                        component: './list/search/articles',
                      },
                      {
                        //   name: 'projects',
                        //  icon: 'smile',
                        path: '/list/search/projects',
                        component: './list/search/projects',
                      },
                      {
                        //   name: 'applications',
                        //   icon: 'smile',
                        path: '/list/search/applications',
                        component: './list/search/applications',
                      },
                    ],
                  },
                ],
              },
              {
                  //name: 'account',
                  //icon: 'user',
                  path: '/account',
                  routes: [
                      {
                          path: '/',
                          redirect: '/account/center',
                      },
                      {
                          //name: 'center',
                          //icon: 'smile',
                          path: '/account/center',
                          component: './account/center',
                      },
                      {
                          //name: 'settings',
                          //icon: 'smile',
                          path: '/account/settings',
                          component: './account/settings',
                      },
                  ],
              },
              {
                component: '404',
              },
            ],
          },
        ],
      },
    ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
