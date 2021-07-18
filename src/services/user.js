import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;

export async function queryUsers() {
  return request(`${prefix}/user/users`);
}
export async function queryCurrent() {
  return request(`${prefix}/user/currentUser`);
}
export async function queryCurAccount() {
  return request(`${prefix}/user/curAccount`);
}
export async function queryMenu() {
    return request(`${prefix}/admin/sys/user/adminMenu`);
}
export async function queryNotices() { // @Todo 消息提醒下一步实现
  return request('/api/notices');
}
