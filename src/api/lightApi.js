import urls from './urls'
import { common } from './common'

//common函数传递的参数添加 contentType: 'application/x-www-form-urlencoded' 即可改变post请求参数传递的格式
const Api = {
  //#region 用户
  userLogout: (data) => common({ url: urls.light.userLogout, data, method: 'post' }),
  //#endregion 
  
  //#region 上传
  uploadImgGetToken: (data) => common({ url: urls.light.uploadImgGetToken, data, method: 'post' }),
  //#endregion
}

export default Api
