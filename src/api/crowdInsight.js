import axios from '@/utils/request'
import Url from '../../public/proxyUrl'
//我的画像报告列表分页查询
export function getPortraitReportByPage(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getPortraitReportByPage`,
    method: 'POST',
    data:params
  })
}
//我的画像报告--更新报告
export function updateReport(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/updateReport`,
    method: 'POST',
    params
  })
}
//我的画像报告--分享报告(发送邮箱)
export function shareReportByEmail(params) {
  return axios({
    url: `${Url.ProxyUrl}/mail/shareReportByEmail`,
    method: 'POST',
    params
  })
}
//对比画像报告--分享报告(发送邮箱)--reportType == 3
export function shareContrastReportByMail(params) {
  return axios({
    url: `${Url.ProxyUrl}/mail/shareContrastReportByMail`,
    method: 'POST',
    params
  })
}
//自定义人群洞察--新增画像报告
export function addPortraitReport(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addPortraitReportByFile`,
    method: 'POST',
    data:params
  })
}
//车型洞察--自主车系下拉框数据查询
export function getCarSeries(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getCarSeries`,
    method: 'POST',
    params
  })
}
//车型洞察--其他品牌车系下拉框数据查询
export function getCarBrandData(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/getCarBrandData`,
    method: 'POST',
    params
  })
}
//车型洞察--增加车型洞察（确定）
export function addCarSeriesInsight(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addCarSeriesInsight`,
    method: 'POST',
    data:params
  })
}
//客群对比--已有人群包对比
export function addExistCrowdContrastInsight(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addExistCrowdContrastInsight`,
    method: 'POST',
    data:params
  })
}
//客群对比--车型人群对比
export function addCarCrowdContrastInsight(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addCarCrowdContrastInsight`,
    method: 'POST',
    data:params
  })
}
//客群对比--城市人群对比
export function addCityCrowdContrastInsight(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/addCityCrowdContrastInsight`,
    method: 'POST',
    data:params
  })
}
//客群对比--更新报告
export function updateContrastReport(params) {
  return axios({
    url: `${Url.ProxyUrl}/insight/updateContrastReport`,
    method: 'POST',
    params
  })
}
