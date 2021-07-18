import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;

export async function queryProvince() {
  return request(`${prefix}/region/prov`);
}
export async function queryCity(province) {
  return request(`${prefix}/region/city/${province}`);
}
export async function queryRegionInfo(city) {
  return request(`${prefix}/region/info/${city}`);
}
export async function saveBaseInfo(params) {
  return request(`${prefix}/user/conf`, {
    method: 'POST',
    data: params,
  });
}
