import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;

export async function queryPage(params) {
  return request(`${prefix}/admin/sys/res`, {
    params,
  });
}
export async function removeEntity(params) {
  return request(`${prefix}/admin/sys/res/delete`, {
    method: 'DELETE',
    data: params,
  });
}
export async function removeEntitys(params) {
  return request(`${prefix}/admin/sys/res/deletes`, {
    method: 'DELETE',
    data: params,
  });
}
export async function addEntity(params) {
  return request(`${prefix}/admin/sys/res/add`, {
    method: 'POST',
    data: params,
  });
}
export async function updateEntity(params) {
  return request(`${prefix}/admin/sys/res/update`, {
    method: 'POST',
    data: params,
  });
}
export async function getAppList() {
  return request(`${prefix}/admin/sys/app/all`);
}
export async function getResList() {
  return request(`${prefix}/admin/sys/res/all`);
}
