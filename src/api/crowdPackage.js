import axios from '@/utils/request'
import Url from '../../public/proxyUrl'

//人群包上传
  export function uploadCrowdByFile(params) {
    return axios({
      url: `${Url.ProxyUrl}/crowd/crowdPackage/uploadCrowdByFile`,
      method: 'POST',
      headers:{
      //把content-type设置为multipard/form-data，同时还要设置boundary
      'Content-Type': 'multipart/form-data; boundary = ' + new Date().getTime()
    //   'Content-Type': 'multipart/form-data;boundary'
      },
      data:params
    })
}