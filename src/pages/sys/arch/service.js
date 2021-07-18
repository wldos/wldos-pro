import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;

export async function queryPage(params) {
  return request(`${prefix}/admin/sys/arch`, {
    params,
  });
}
export async function removeEntity(params) {
  return request(`${prefix}/admin/sys/arch/delete`, {
    method: 'DELETE',
    data: params,
  });
}
export async function removeEntitys(params) {
  return request(`${prefix}/admin/sys/arch/deletes`, {
    method: 'DELETE',
    data: params,
  });
}
export async function addEntity(params) {
  return request(`${prefix}/admin/sys/arch/add`, {
    method: 'POST',
    data: params,
  });
}
export async function updateEntity(params) {
  return request(`${prefix}/admin/sys/arch/update`, {
    method: 'POST',
    data: params,
  });
}
export async function getArchList() {
  return request(`${prefix}/admin/sys/arch/all`);
}
export async function getComList() {
  return request(`${prefix}/admin/sys/com/all`);
}