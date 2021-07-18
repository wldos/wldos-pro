import {fakeRegister} from './service';
import {setAuthority} from "@/utils/authority";

const Model = {
    namespace: 'userAndregister',
    state: {
        status: undefined,
    },
    effects: {
        * submit({payload}, {call, put}) {
            const response = yield call(fakeRegister, payload);

            if (typeof response !== 'undefined' && response.data !== undefined && response.data.status === 'ok') {
                yield put({
                    type: 'registerHandle',
                    payload: response.data,
                });
            } else {
                yield put({
                    type: 'registerHandle',
                    payload: {
                        status: 'error',
                    },
                });
            }
        },
    },
    reducers: {
        registerHandle(state, {payload}) {
            // 注册成功，同时保存token自动登录
            if (payload && payload.currentAuthority)
                setAuthority(payload);
            return {...state, status: payload.status};
        },
    },
};
export default Model;
