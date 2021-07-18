import request from '@/utils/request';
import config from '@/utils/config';

const { prefix } = config;

export async function accountLogin(params) {
  return request(`${prefix}/login/account`, {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
    return request(`${prefix}/login/logout`, {
        method: 'DELETE'
    });
}

export async function getFakeCaptcha(mobile) {
  return request(`${prefix}/login/captcha?mobile=${mobile}`);
}

export async function queryCaptcha() {
    return request(`${prefix}/authcode/code`);
}

export async function checkCaptcha(params) {
    return request(`${prefix}/authcode/check`, {
        method: 'POST',
        data: params,
    });
}

export async function refreshTokenService() {
    // const refreshTokenJSON = { 'CU_RefreshToken_WLDOS': wldosStorage.get('refreshToken')};
    return request(`${prefix}/login/refresh`
        /* ,{
        method: 'GET',
         headers: { // request自带token，无须这个了。
            'Content-Type': 'application/json',
            'CU_RefreshToken_WLDOS': wldosStorage.get('accessToken'),
        },
        // data: refreshTokenJSON,
    } */
    );
}


