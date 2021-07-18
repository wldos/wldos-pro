import { extend } from 'umi-request';
import { notification } from 'antd';
import {clearAuthority, setAuthority} from "@/utils/authority";
import wldosStorage from "@/utils/wldostorage";
import {getPageQuery} from "@/utils/utils";
import {history} from "umi";
import {stringify} from "querystring";
import {refreshTokenService} from "@/services/login";
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
const guest = "guest";

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '权限不足，访问被禁止。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
    const { response } = error;

    if (response && response.status) {
        if (response.status === 401) {
            // 刷新token失败则重新登录
            clearAuthority();
            const {redirect} = getPageQuery();
            if (typeof window !== 'undefined' && window.location.pathname !== '/user/login' && !redirect) {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                });
            }
        } else {
            const errorText = codeMessage[response.status] || response.statusText;
            // const { status, url } = response;
            notification.error({
                message: '', // `请求错误 ${status}: ${url}`,
                description: errorText,
            });
        }
    } else if (!response) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }
    return response;
};

/**
 * 配置request请求时的默认参数
 */
const req = extend();

const checkStatus = (response, url, options) => {
    if (response && response.status === 401) {
        return new Promise((resolve, reject) => {
            if (wldosStorage.get('accessToken') !== -1) {
                refreshTokenService().then((res) => {
                    if (res && res.data && res.data.status === "ok") {
                        setAuthority(res.data);
                        resolve(res);
                    } else {
                        reject();
                    }
                }).catch(e => {
                    reject(e)
                });
            } else {
                reject();
            }
        }).then(res => {
                return req(url, Object.assign(options, {
                    headers:
                        {
                            'X-CU-AccessToken-WLDOS': res.data.token.accessToken,
                        }
                }))
                    .then(checkStatus)
                    .catch(err => ({
                        err
                    }))
            }
        ).catch(e => e);
    }

    return response;
}

const request = (url, params) => {

    const { method = 'GET' } = params || {};
    const options = {
        method,
        headers: { // umi-request默认Content-Type为application/json，此处省略。
            'X-CU-AccessToken-WLDOS': wldosStorage.get('accessToken') || guest,
            Accept: '*/*',
        },
    };
    if (method === 'GET') {
        Object.assign(options,
            // method为get，umi-request默认为get
            params, // get方法数据域schema为params，表示请求参数，完整写法是：params: {key: value,...}
        );
    } else {
        Object.assign(options, {
            // method可以为：POST、PATCH、PUT、DELETE
            data: params.data, // post方法数据域schema为data，表示要提交的数据，完整写法是：data: {key: value,...}
        });
    }

    return req(url, options).then((res) => {
        return checkStatus(res, url, options);
    }).catch(err => errorHandler(err));
};

const postFile = (url, params) => {
    const formData = new FormData();
    formData.append('file', params);
    return request(url, { method:'post', data: formData });
};
export { postFile, guest };
export default request;