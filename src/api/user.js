////////用户登录////////
import request from '@/utils/request'
import Url from '../../public/proxyUrl'

// 登录
export function login(params) {
  return request({
    url: `${Url.ProxyUrl}/auth/login`,
    // url: `${Url.ProxyUrl}/login`,
    method: 'post',
    data:params
  })
}
// 退出登录
export function loginOut(params) {
  return request({
    url: `${Url.ProxyUrl}/session/loginOut`,
    method: 'POST',
    params
  })
}
//修改密码
export function updateUserPassword(params) {
  return request({
    url: `${Url.ProxyUrl}/auth/updateUserPassword`,
    method: 'POST',
    data:params
  })
}
// 重置密码
export function resetUserPassword(params) {
  return request({
    url: `${Url.ProxyUrl}/auth/resetUserPassword`,
    method: 'POST',
    data:params
  })
}
