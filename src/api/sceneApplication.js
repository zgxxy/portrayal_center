import axios from '@/utils/request'
import Url from '../../public/proxyUrl'
//分页获取活动选址项目
export function getActiveLocalProjectByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getActiveLocalProjectByPage`,
    method: 'POST',
    data:params
  })
}
//获取活动选址数据
export function active(projectId) {
  return axios({
    url: `${Url.ProxyUrl}/insight/active?projectId=${projectId}`,
    method: 'POST',
  })
}
//新增活动选址项目
export function addActiveLocalProject(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addActiveLocalProject`,
    method: 'POST',
    data:params
  })
}
//获取省份城市--二级下拉
export function getPoiList(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getPoiList`,
    method: 'POST',
    params
  })
}
//获取省份城市--一级下拉
export function getActiveLocalCity(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getActiveLocalCity`,
    method: 'POST',
    params
  })
}
//获取行政区
export function getCityDistrictByCityName(cityName) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getCityDistrictByCityName?cityName=${cityName}`,
    method: 'POST',
  })
}
//根据城市信息获取商场的Poi
export function getMarketPoiInfo(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getMarketPoiInfo`,
    method: 'POST',
    params
  })
}
//根据城市信息获取住宅区的Poi
export function getResidencePoiInfo(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getResidencePoiInfo`,
    method: 'POST',
    params
  })
}
//商场详情信息--折叠
export function getShopBriefDataById(shopName) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getShopBriefDataById?shopName=${shopName}`,
    method: 'POST',
  })
}
//商场详情页
export function getShopDataById(shopName) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getShopDataById?shopName=${shopName}`,
    method: 'POST',
  })
}
//客流来源--小区
export function getCustomerSourceCommunityData(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getCustomerSourceCommunityData`,
    method: 'POST',
    data:params
  })
}
//客流来源--写字楼
export function getCustomerSourceOfficeData(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getCustomerSourceOfficeData`,
    method: 'POST',
    data:params
  })
}
//商场周边配套数据
export function getPeripheralDataByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getPeripheralDataByPage`,
    method: 'POST',
    data:params
  })
}
//商场业态数据
export function marketAnalysisService(shopId) {
  return axios({
    url: `${Url.ProxyUrl}/insight/marketAnalysisService?shopId=${shopId}`,
    method: 'POST',
  })
}
//商场业态--分页表格数据
export function getMarketBusinessByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getMarketBusinessByPage`,
    method: 'POST',
    data:params
  })
}
// 获取商场对比数据--mock
// export function getMarketcontrast(params) {
//   return axios({
//     url:'/api/ratings/list',
//     method: 'POST',
//     params
//   })
// }
export function getMarketcontrast(){
  return axios.get('/testData/shopContrast.json')
}
//获取商场对比数据
export function getShopContrastData(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getShopContrastData`,
    method: 'POST',
    data:params
  })
}
//获取商场对比画像数据
export function getShopContrastAudience(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getShopContrastAudience`,
    method: 'POST',
    data:params
  })
}
//门店选址详情信息
export function getStoreInfo(){
  return axios.get('/testData/storeInfoReport.json')
}