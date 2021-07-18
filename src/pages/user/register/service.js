import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;
export async function fakeRegister(params) {
  return request(`${prefix}/login/register`, {
    method: 'POST',
    data: params,
  });
}
