////////账号管理页////////
import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

// 账户分页
export function getUserInfo(params) {
  return axios({
    url: `${Url.ProxyUrl}/auth/getUserInfo`,
    method: 'POST',
    data:params
  })
}
//搜索用户
export function searchUser(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/searchUser`,
    method: 'POST',
    params
  })
}
// 禁用启用
export function disable(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/disable`,
    method: 'POST',
    params
  })
}

//批量启用禁用
export function batchUpdateStatus(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/batchUpdateStatus`,
    method: 'POST',
    data:params
  })
}

// 更改用户权限
export function updateUserRole(params) {
  return axios({
    url: `${Url.ProxyUrl}/Role/updateUserRole`,
    // headers:{
    //   'Content-Type': 'multipart/form-data',
    // },
    method: 'POST',
    data:params
  })
}

// 重置密码
export function resetPassword(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/resetPassword`,
    method: 'POST',
    params
  })
}

// 添加用户
export function add(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/add`,
    method: 'POST',
    data:params
  })
}
// delete
// 删除用户
export function deleteUser(params) {
  return axios({
    url: `${Url.ProxyUrl}/User/deleteUser`,
    method: 'POST',
    params
  })
}

// 自动生成登录密码
export function generateRandomPasswords() {
  return axios({
    url: `${Url.ProxyUrl}/User/generateRandomPasswords`,
    method: 'GET',
  })
}

//弹窗获取用户邮箱列表
export function getAddUserPopData() {
  return axios({
    url: `${Url.ProxyUrl}/User/getAddUserPopData`,
    method: 'GET',
  })
}
