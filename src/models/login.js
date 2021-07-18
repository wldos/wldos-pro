import {stringify} from 'querystring';
import {history} from 'umi';
import * as service from '@/services/login';
import {clearAuthority, setAuthority} from '@/utils/authority';
import {getHome, getPageQuery} from '@/utils/utils';
import {message} from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      const response = yield call(service.accountLogin, payload);
      if (response && response.data && response.data.status === 'ok') {
        yield put({
          type: 'changeLoginStatus',
          payload: response.data,
        }); // Login successfully

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！').then(
          () => {
            let {redirect} = params;

            if (redirect) {
              const redirectUrlParams = new URL(redirect);

              if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);

                if (redirect.match(/^\/.*#/)) {
                  redirect = redirect.substr(redirect.indexOf('#') + 1);
                }
              } else {
                window.location.href = '/';
                return;
              }
            }

            history.replace(redirect || '/');
        });

      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            type: response.data.type,
            currentAuthority: 'guest',
          },
        });
      }
    },

    * logout({payload}, {call, put}) {
      const res = yield call(service.logout, payload);

      // 清除本地缓存
      yield call(clearAuthority);

      yield put({
        type: 'user/saveCurrentUser',
        payload: res.data,
      });

      const {isManageSide = false} = payload;

      if (!isManageSide) { // 前端注销回主页
        if (window.location.pathname !== getHome()) {
          history.replace({
            pathname: getHome(),
          });
        }
      } else { // 后端注销回登录页
        const {redirect} = getPageQuery();

        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      if (payload.currentAuthority)
        setAuthority(payload);
      return {...state, status: payload.status, type: payload.type};
    },
  },
};
export default Model;
