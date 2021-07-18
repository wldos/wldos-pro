import * as service from '@/services/user';
import { setAuthority} from "@/utils/authority";

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    menuData: [],
    adminMenu: [],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(service.queryUsers);
      yield put({
        type: 'save',
        payload: {
          userInfo: response.userInfo,
          currentAuthority: response.currentAuthority
        },
      });
    },

    * fetchCurrent(_, {call, put}) {
      const response = yield call(service.queryCurrent);
      if (response && response.data) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        }); // 登录成功，记录用户信息
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            userInfo: {},
            menu: [],
            currentAuthority: ['guest'],
          },
        });
      }
    },
    * fetchAdminMenu({payload}, {call, put}) {
      const menus = yield call(service.queryMenu, payload);
      yield put({
        type: 'saveMenu',
        payload: menus.data,
      })
    },
  },
  reducers: {
    saveCurrentUser(state, {payload}) {
      if (payload && payload.currentAuthority)
        setAuthority(payload);
      return {
        ...state, currentUser: payload.userInfo,
        menuData: payload.menu || [],
      };
    },

    saveMenu(state, action) {
      return {
        ...state,
        adminMenu: action.payload || []
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
