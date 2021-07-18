import {parse, stringify} from 'querystring';
import {matchRoutes} from "react-router-config";
import {history} from "umi";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
export const getHome = () => { // 退出返回首页
    return '/';
};

export function getRouteAuthority(path, routerData) {
    const routes = matchRoutes(routerData, path);
    let authorities = [];
    routes.forEach(item => {
        if (Array.isArray(item.route.authority)) {
            authorities = authorities.concat(item.route.authority);
        } else if (typeof item.route.authority === 'string') {
            authorities.push(item.route.authority);
        }
    });

    return authorities;
};

export const redirectReq = (path) => { // 请求后重定向回来
    const {redirect} = getPageQuery();

    if (typeof window !== 'undefined' && window.location.pathname !== path && !redirect) {
        history.replace({
            pathname: path,
            search: stringify({
                redirect: window.location.href,
            }),
        });
    }
}