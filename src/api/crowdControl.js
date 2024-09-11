import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

//人群管理列表分页查询
export function getCrowdByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getCrowdByPage`,
    method: 'POST',
    data:params
  })
}
//人群管理列表--下载人群包
export function downloadCrowdFile(crowdId) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/downloadCrowdFile?crowdId=${crowdId}`,
    method: 'POST',
    responseType:'blob',
  })
}
//人群管理列表--删除人群包
export function deleteCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/deleteCrowd`,
    method: 'POST',
    params
  })
}
//自定义人群上传--文件模板下载
export function downloadModuleFile() {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/downloadModuleFile`,
    method: 'GET',
    responseType:'blob',
  })
}
//获取人群包文件列表
export function getCrowdPackageFileById(crowdId) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getCrowdPackageFileById?crowdId=${crowdId}`,
    method: 'POST',
  })
}
//自定义人群上传--确定
export function crowdConfirm(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/crowdConfirm`,
    method: 'POST',
    data:params
  })
}
//获取全部人群包
export function getAllVO(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getAllVO`,
    method: 'POST',
    params
  })
}
export function getAllFileCrowdVo(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getAllFileCrowdVo`,
    method: 'POST',
    params
  })
}
//获取已有报告人群包
export function getHaveReportCrowdVo(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getHaveReportCrowdVo`,
    method: 'POST',
    params
  })
}
//生成人群包报告
export function generateCrowdReport(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/generateCrowdReport`,
    method: 'POST',
    params
  })
}
//app圈人--获取分页信息
export function getAppListByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getAppListByPage`,
    method: 'POST',
    data:params
  })
}
//app圈人--获取选择框信息
export function getQueryData(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getQueryData`,
    method: 'POST',
    params
  })
}
//app圈人--新增app人群（确定）
export function addAppCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/addAppCrowd`,
    method: 'POST',
    data:params
  })
}
//TA标签圈人--标签查询
export function getTagData(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getTagData`,
    method: 'POST',
    params
  })
}
//TA标签圈人--获取城市
export function getCityList(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getCityList`,
    method: 'POST',
    params
  })
}
//TA标签圈人--添加TA标签圈人
export function addTagCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/addTagCrowd`,
    method: 'POST',
    data:params
  })
}
//到访场所圈人--标签查询
export function getRegionTag(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getRegionTag`,
    method: 'POST',
    params
  })
}
//到访场所圈人--城市查询
export function getAllCityCode(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getAllCityCode`,
    method: 'POST',
    params
  })
}
//到访场所圈人--行政区查询
export function getAdministrativeRegionsCodeByCityName(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getAdministrativeRegionsCodeByCityName`,
    method: 'POST',
    params
  })
}
//到访场所圈人--添加场景标签人群
export function addRegionTagCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/addRegionTagCrowd`,
    method: 'POST',
    data:params
  })
}
//组合圈人--添加组合人群
export function combinationCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/combinationCrowd`,
    method: 'POST',
    data:params
  })
}
//区域圈人--添加区域人群
export function addLbsCrowd(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/addLbsCrowd`,
    method: 'POST',
    data:params
  })
}
//活动选址--标签查询
export function getActiveLocalTagData(params) {
  return axios({
    url: `${Url.ProxyUrl}/crowd/crowdPackage/getActiveLocalTagData`,
    method: 'POST',
    params
  })
}