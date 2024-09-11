////////接口管理页////////
import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

//应用接口列表分页查询
export function getApplicationApiByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getApplicationApiByPage`,
    method: 'POST',
    data:params
  })
}
//应用接口--新增弹窗--接口名称查询
export function getPopUpData() {
  return axios({
    url: `${Url.ProxyUrl}/api/getPopUpData`,
    method: 'GET',
  })
}
//应用接口--新增弹窗--新增
export function addApplicationInterface(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/addApplicationInterface`,
    method: 'POST',
    data:params
  })
}
//应用接口编辑保存
export function updateApplyApiDetail(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/updateApplyApiDetail`,
    method: 'POST',
    data:params
  })
}
//应用接口--状态更改 启用or停用
export function updateApplicationInterface(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/updateApplicationInterface`,
    method: 'POST',
    data:params
  })
}
//应用接口--删除
export function deleteApplicationInterface(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/deleteApplicationInterface`,
    method: 'POST',
    params
  })
}
//应用接口--接口详情（详情页）
export function getApplyApiDetail(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getApplyApiDetail`,
    method: 'POST',
    params
  })
}

//////////////分割线////////////////分割线//////////////////分割线////////////////

//数据接口列表分页查询
export function getDataApiByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getDataApiByPage`,
    method: 'POST',
    data:params
  })
}
//数据接口编辑保存
export function updateDataApiDetail(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/updateDataApiDetail`,
    method: 'POST',
    data:params
  })
}
//数据接口--状态更改 启用or停用
export function updateDataApiStatus(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/updateDataApiStatus`,
    method: 'POST',
    params
  })
}
//数据接口--删除
export function deleteDataApi(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/deleteDataApi`,
    method: 'POST',
    params
  })
}
//数据接口--接口详情（详情页）
export function getDataApiDetail(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getDataApiDetail`,
    method: 'POST',
    params
  })
}
//数据接口--下载文档
export function getDataInterfaceDocument(modelId) {
  return axios({
    url: `${Url.ProxyUrl}/api/getDataInterfaceDocument?modelId=${modelId}`,
    method: 'GET',
    responseType:'blob',
  })
}
//数据接口--折线图数据
export function getChartData(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getChartData`,
    method: 'POST',
    data:params
  })
}
//应用接口--折线图数据
export function getApplyChartData(params) {
  return axios({
    url: `${Url.ProxyUrl}/api/getApplyChartData`,
    method: 'POST',
    data:params
  })
}