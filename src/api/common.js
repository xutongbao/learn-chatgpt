import axios from 'axios'
import { message } from 'antd'
import { baseURL } from '../utils/config'
import qs from 'qs'
import { showLoading, hideLoading, addLog } from '../utils/tools'
let isCanShow = true
const service = axios.create()

service.defaults.baseURL = baseURL

service.interceptors.request.use(
  (config) => {
    //不同的平台提供不同的token和loginUserId

    if (config.isNotNeedToken !== true) {
      config.headers.authorization = localStorage.getItem('token')
    }
    if (window.platform === 'rn') {
      config.headers.platformos = localStorage.getItem('platformos') ? localStorage.getItem('platformos') : 'rn'
      config.headers.version = localStorage.getItem('appVersion') ? localStorage.getItem('appVersion') : ''
    } else {
      config.headers.platformos = 'h5'
      config.headers.version = window.version
    }
    config.headers.href = `${document.location.href}?platformos=${config.headers.platformos}&version=${config.headers.version}`
    config.timeout = 30 * 60 * 1000

    // 请求接口时显示loading，接口响应后隐藏loading，如果有特殊情况不能满足需求的，例如同时请求了多个接口
    // 且接口响应时间有比较大的差异，loading的显示隐藏状态不能友好的展示，可以直接在业务代码或api层，把
    // isLoading设置为false，则不再使用拦截器控制loading的状态，自己在业务代码里手动控制loading的状态
    if (config.isLoading !== false) {
      showLoading()
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

service.interceptors.response.use(
  (res) => {
    if (res.config.isLoading !== false) {
      setTimeout(() => {
        hideLoading()
      }, 500)
    }
    if (res.config.allResponse) {
      return res
    } else {
      //code是node接口的状态码，state是java接口的状态码
      if (res.data.code === 200 || res.data.state === 1) {
        return res.data
      } else if (
        res.data.code === 400 ||
        res.data.code === 500 ||
        res.data.state === 0
      ) {
        let msg = ''
        msg = res.data.message
        if (res.data && res.data.data) {
          msg += res.data.data.error_msg ? `:${res.data.data.error_msg} ` : ''
          msg += res.data.data.error_code ? res.data.data.error_code : ''
        }
        if (res.config.isShowMessage !== false) {
          message.warning(msg)
        }
        //Promise.reject(res)
        return res.data
      } else if (res.data.code === 403) {
        if (isCanShow) {
          message.warning(res.data.message)
          isCanShow = false
        }
        setTimeout(() => {
          isCanShow = true
        }, 1000)
        if (window.platform === 'rn') {
          message.warning('请重新登录')
        } else {
          if (document.location.href.includes('#/h5')) {
            window.reactRouter.replace({ pathname: '/ai/login' })
          } else if (document.location.href.includes('#/light')) {
            window.reactRouter.replace({ pathname: '/light/login' })
          } else if (document.location.href.includes('#/ai')) {
            window.reactRouter.replace({ pathname: '/welcome/home' })
          } else {
            //window.reactRouter.replace({ pathname: '/welcome/home' })
          }
        }

        return res.data
      } else if (res.data.code === 40001) {
        // if (isCanShow) {
        //   message.warning(res.data.message)
        //   isCanShow = false
        // }
        // setTimeout(() => {
        //   isCanShow = true
        // }, 1000)
        // if (document.location.href.includes('#/h5')) {
        //   window.reactRouter.replace({ pathname: '/h5/single/me/exchange' })
        // }

        return res.data
      } else if (res.data.code === 40002) {
        if (isCanShow) {
          isCanShow = false
          const reloadTime = Date.now()
          const historyReloadTime = localStorage.getItem('reloadTime')
          if (historyReloadTime) {
            if (reloadTime - historyReloadTime >= 60 * 1000) {
              message.warning(res.data.message)
              localStorage.setItem('reloadTime', reloadTime)
              window.location.reload()
            }
          } else {
            message.warning(res.data.message)
            localStorage.setItem('reloadTime', reloadTime)
            window.location.reload()
          }
        }
        setTimeout(() => {
          isCanShow = true
        }, 1000)

        return res.data
      } else if (res.data.code === 40003) {
        return res.data
      } else {
        return Promise.reject(res)
      }
    }
  },
  (err) => {
    hideLoading()
    let { response } = err
    if (typeof response === 'undefined') {
      return Promise.reject(err)
    }

    if (response) {
      let { status } = response
      if (status === 401) {
      } else {
        message.warning(err && err.message)
        if (!(process.env.REACT_APP_MODE === 'dev')) {
          addLog({
            errorTitle: err.toString(),
            detail: `responseURL: ${
              response.request && response.request.responseURL
            }`,
          })
        }
      }
    } else {
      message.warning(err && err.message)
      if (!(process.env.REACT_APP_MODE === 'dev')) {
        addLog({ errorTitle: err.toString(), detail: err.message })
      }
    }
    return Promise.reject(err)
  }
)

export const common = async (config) => {
  if (config.contentType === 'application/x-www-form-urlencoded') {
    config.headers = { 'content-type': 'application/x-www-form-urlencoded' }
    config.data = qs.stringify(config.data)
  }
  let res = await service(config)
  return res
}
