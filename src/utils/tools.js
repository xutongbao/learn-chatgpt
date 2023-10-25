import React from 'react'
import store from '../store'
import { fromJS } from 'immutable'
import axios from 'axios'
import moment from 'moment'
import { Image } from 'antd'
import { imageBaseUrl, baseURL } from './config'
import Api from '../api'
//import { html2json, json2html } from 'html2json'
import Store from '../store'
import uaParser from 'ua-parser-js'

let timer
let ua = uaParser(navigator.userAgent)

//显示loading
const showLoading = (delay = 0) => {
  timer = setTimeout(() => {
    store.dispatch({
      type: 'SET_LIGHT_STATE',
      key: ['isLoading'],
      value: true,
    })
  }, delay)
}

//隐藏loading
const hideLoading = () => {
  clearTimeout(timer)
  store.dispatch({
    type: 'SET_LIGHT_STATE',
    key: ['isLoading'],
    value: false,
  })
}

//把url里的查询字段转换成对象
const parseQueryString = (url) => {
  let params = {}
  let arr = url.split('?')
  if (arr.length <= 1) {
    return params
  }
  arr = arr[1].split('&')
  for (let i = 0, l = arr.length; i < l; i++) {
    let a = arr[i].split('=')
    params[a[0]] = a[1]
  }
  return params
}

//把路由里的查询字段转换成对象
const getRouterSearchObj = (props) => {
  const {
    location: { search },
  } = props
  const routerSearchObj = parseQueryString(search)
  return routerSearchObj
}

//获取主机名
const getHost = (url) => {
  var reg = /http(s)?:\/\/([A-Za-z0123456789:.]+)\/\S+/
  var result = reg.exec(url)
  if (result) {
    return 'http://' + result[2]
  }
}

//深拷贝
const deepClone = (obj) => {
  return fromJS(obj).toJS()
}

// 模拟点击
const fake_click = (obj) => {
  var ev = document.createEvent('MouseEvents')
  ev.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  )
  obj.dispatchEvent(ev)
}

//导出
const exportFile = ({ url, fileName, data }) => {
  showLoading()
  axios({
    url,
    data,
    responseType: 'blob',
    method: 'post',
    headers: {
      ...addUploadToken(),
    },
  })
    .then((res) => {
      console.log(res)
      const blob = new Blob([res.data], { type: res.data.type })
      const file = new FileReader()

      file.readAsBinaryString(blob)
      file.onload = (ev) => {
        const myFileName = `${fileName}.xls`

        var urlObject = window.URL || window.webkitURL || window
        var save_link = document.createElementNS(
          'http://www.w3.org/1999/xhtml',
          'a'
        )
        save_link.href = urlObject.createObjectURL(blob)
        save_link.download = myFileName
        fake_click(save_link)
        console.log('下载报告')
        hideLoading()
      }
    })
    .catch((err) => {
      hideLoading()
      return Promise.reject(err)
    })
}

const downloadFile = ({ url }) => {
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
  save_link.href = `${baseURL}${url}?authorization=${localStorage.getItem(
    'token'
  )}`
  fake_click(save_link)
}

//销售导出，为了兼容左剑飞写的get下载接口
const exportFileGet = ({ url, fileName }) => {
  showLoading()
  axios({
    url,
    data: {},
    responseType: 'blob',
    method: 'get',
    headers: {
      ...addUploadToken(),
    },
  }).then((res) => {
    console.log(res)
    const blob = new Blob([res.data], { type: res.data.type })
    const file = new FileReader()

    file.readAsBinaryString(blob)
    file.onload = (ev) => {
      const myFileName = `${fileName}.docx`

      var urlObject = window.URL || window.webkitURL || window
      var save_link = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      )
      save_link.href = urlObject.createObjectURL(blob)
      save_link.download = myFileName
      fake_click(save_link)
      console.log('下载报告')
      hideLoading()
    }
  })
}

// 添加/更新时间
const renderTime = (text, record) => {
  return (
    <div className="m-time-item-wrap">
      <div className="m-time-item">
        {moment(text - 0)
          .format('YYYY-MM-DD HH:mm:ss')
          .split(' ')
          .map((item, index) => (
            <div key={index} className={`${index === 1 ? 'm-space-left' : ''}`}>
              {item}
            </div>
          ))}
      </div>
      <div className="m-time-item">
        {record.updateTime
          ? moment(record.updateTime - 0)
              .format('YYYY-MM-DD HH:mm:ss')
              .split(' ')
              .map((item, index) => (
                <div
                  key={index}
                  className={`${index === 1 ? 'm-space-left' : ''}`}
                >
                  {item}
                </div>
              ))
          : ''}
      </div>
    </div>
  )
}

// 渲染列表里的图片，如logo等
const renderImage = (text, record, index, width = 80) => {
  return (
    <>
      {text ? (
        <Image
          title={imageUrlFormat(text)}
          src={imageUrlFormat(text)}
          className="m-list-column-img"
          alt={'图片'}
          style={{ width }}
        ></Image>
      ) : null}
    </>
  )
}

// 图片链接处理
const imageUrlFormat = (text = '') => {
  if (typeof text === 'string' && text.includes('http')) {
    return text
  } else if (text !== '') {
    //return `http://140.210.69.190:8080/${text}`
    return `${imageBaseUrl}${text}`
  }
}

const getAuth = () => {
  let accessToken
  let loginUserId
  if (document.location.href.includes('#/sale')) {
    accessToken = localStorage.getItem('accessTokenForSale')
    loginUserId = localStorage.getItem('userIdForSale')
  } else if (document.location.href.includes('#/edu')) {
    accessToken = localStorage.getItem('accessTokenForEdu')
    loginUserId = localStorage.getItem('userIdForEdu')
  } else if (document.location.href.includes('#/producer')) {
    accessToken = localStorage.getItem('accessTokenForProducer')
    loginUserId = localStorage.getItem('userIdForProducer')
  } else {
    accessToken = localStorage.getItem('accessTokenForAdmin')
    loginUserId = localStorage.getItem('userIdForAdmin')
  }
  return {
    accessToken,
    loginUserId,
  }
}

//上传接口添加token
const addUploadToken = () => {
  return {
    authorization: localStorage.getItem('token'),
  }
}

//上传接口添加额外的参数
const addUploadExtraData = () => {
  const loginUserId = getAuth().loginUserId
  if (loginUserId) {
    return {
      loginUserId,
    }
  } else {
    return {}
  }
}

//格式化权限数据
const formatAuthData = ({ router, authData = [], isForTable = false }) => {
  router = deepClone(router)
  const newRouterAuthDataArr = []
  const find = (arr, parentId = '') => {
    for (let i = 0; i < arr.length; i++) {
      //查询后端提供的权限
      const findResult = authData.find(
        (item) => item.path === arr[i].path || item.path === arr[i].key
      )
      //后端的权限应用到菜单的显示隐藏
      if (findResult) {
        const checkResult =
          Array.isArray(findResult.auth) &&
          findResult.auth.find((item) => item.name === 'check')
        if (checkResult) {
          arr[i].isVisible = checkResult.isVisible
        } else {
          arr[i].isVisible = false
        }
      }
      //后端的权限应用到按钮的显示隐藏
      if (Array.isArray(arr[i].auth)) {
        arr[i].auth.forEach((authItem) => {
          if (findResult && Array.isArray(findResult.auth)) {
            const temp = findResult.auth.find(
              (item) => item.name === authItem.name
            )
            if (temp) {
              authItem.isVisible = temp.isVisible
            } else {
              authItem.isVisible = false
            }
          } else {
            if (authItem.name === 'check') {
              authItem.isVisible = true
            } else {
              authItem.isVisible = false
            }
          }
        })
        let path = ''
        if (arr[i].path) {
          path = arr[i].path
        } else if (arr[i].key) {
          path = arr[i].key
        }
        newRouterAuthDataArr.push({
          path,
          auth: deepClone(arr[i].auth),
        })
      }
      //后端的权限应用到数据范围
      if (arr[i].dataRange) {
        if (
          findResult &&
          findResult.dataRange &&
          typeof findResult.dataRange.value === 'number'
        ) {
          arr[i].dataRange.value = findResult.dataRange.value
        } else {
          arr[i].dataRange.value = 0
        }
        const index = newRouterAuthDataArr.findIndex(
          (item) => item.path === arr[i].path
        )
        if (index >= 0) {
          newRouterAuthDataArr[index] = {
            ...newRouterAuthDataArr[index],
            dataRange: deepClone(arr[i].dataRange),
          }
        }
      }
      //ID
      if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
        arr[i].id = `${parentId}${i + 1}`
        find(arr[i].children, `${parentId}${i + 1}`)
      } else {
        arr[i].id = `${parentId}${i + 1}`
        if (
          arr[i].isDevMenu === true &&
          isForTable &&
          !(process.env.REACT_APP_MODE === 'dev')
        ) {
          arr.splice(i, 1)
          i = i - 1
        }
      }
    }
  }
  find(router)
  return { newRouter: router, newRouterAuthDataArr }
}

//获取每个页面的权限
const getMyAuth = () => {
  const {
    location: { pathname },
  } = window.reactRouter
  const router = Store.getState().getIn(['light', 'router']).toJS()
  let myAuthArr = []
  let myDataRangeValue = 1
  //通过本地存在控制是否全部放开权限，方便后端调试，在控制台添加本地存储：isOpenAuth职位true
  const isOpenAuth = localStorage.getItem('isOpenAuth') === 'true'
  const find = (arr, parentId = '') => {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
        find(arr[i].children, `${parentId}${i + 1}`)
      } else {
        if (arr[i].path === pathname || arr[i].key === pathname) {
          myAuthArr = Array.isArray(arr[i].auth) ? arr[i].auth : []
          if (arr[i].dataRange) {
            myDataRangeValue = arr[i].dataRange.value
              ? arr[i].dataRange.value
              : 0
          }
        }
      }
    }
  }
  find(router)
  if (isOpenAuth) {
    myAuthArr.forEach((item) => {
      item.isVisible = true
    })
  }
  let myAuthObj = {}
  myAuthArr.forEach((item) => {
    myAuthObj[item.name] = item.isVisible === false ? false : true
  })
  // console.log(myAuthObj)
  return { myAuthObj, myAuthArr, myDataRangeValue }
}

/**
 * 过滤需要隐藏的菜单
 * @param menu 需要进行处理的菜单数据
 */
const filterHideMenu = function (menu) {
  const find = (menu) => {
    for (let i = 0; i < menu.length; i++) {
      let children = menu[i].children || []
      if (children.length) find(children)
      if (menu[i].hiddenMenu === false) {
        menu.splice(i, 1)
        i--
      }
    }
  }
  find(menu)
}

//并发执行异步事件，按顺序输出结果,总耗时为数组中最大的数
const order = async ({
  fun,
  selectedIds,
  onAddInfo,
  isUrl = false,
  urlKey = '?courseId=',
}) => {
  showLoading()
  const promises = selectedIds.map(async (id) => {
    if (isUrl) {
      return await fun(`${urlKey}${id}`, false, false)
    } else {
      return await fun({ id: id }, false, false)
    }
  })
  let myInfo = []
  for (const data of promises) {
    myInfo.push(await data)
  }
  myInfo = myInfo.map((item, index) => {
    return {
      ...item,
      id: selectedIds[index] ? selectedIds[index] : 0,
    }
  })
  onAddInfo && onAddInfo(myInfo)
  hideLoading()
  return myInfo
}

//只包含省市数据，不包含区
const getCityData = (options) => {
  const newOptions = deepClone(options)
  for (let i = 0; i < newOptions.length; i++) {
    for (let j = 0; j < newOptions[i].children.length; j++) {
      if (Array.isArray(newOptions[i].children[j].children)) {
        delete newOptions[i].children[j].children
      }
    }
  }
  return newOptions
}

//根据图片链接截取图片名称
const getImageName = (url) => {
  const arr = url && url.split('/')
  return arr[arr.length - 1]
}

//生成cancelToken，用于取消请求
const getCancelSource = () => {
  return axios.CancelToken.source()
}

//格式化手机号码
const formatPhone = (value) => {
  value = value.replace(/[^0-9]/gi, '')
  var arr = value.split('')
  if (arr.length >= 4) {
    arr.splice(3, 0, ' ')
  }
  if (arr.length >= 9) {
    arr.splice(8, 0, ' ')
  }
  value = arr.join('')
  return value
}

//添加日志
const addLog = ({ errorTitle, detail }) => {
  const {
    location: { pathname },
  } = window.reactRouter
  const tempValues = {
    username: localStorage.getItem('username'),
    nickname: localStorage.getItem('nickname'),
    path: pathname,
    errorTitle,
    detail,
  }
  Api.h5
    .emailCustomSend({ subject: '网页报错', html: JSON.stringify(tempValues) })
    .then(() => {})
}

//是否是PC
const isPC = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPod',
    'iPad',
  ]
  let flag = true
  for (let i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

//更新七牛云上传图片token
const uploadImgGetToken = () => {
  Api.light.uploadImgGetToken().then((res) => {
    if (res.code === 200) {
      localStorage.setItem('qiniuUploadImgToken', res.data.token)
    }
  })
}

//更新七牛云上传凭证：h5
const uploadGetTokenForH5 = () => {
  Api.h5.uploadGetTokenForH5().then((res) => {
    if (res.code === 200) {
      localStorage.setItem('qiniuUploadTokenForH5', res.data.token)
    }
  })
}

//获取七牛云上传图片token
const uploadImgGetTokenFromLocalStorage = () => {
  return localStorage.getItem('qiniuUploadImgToken')
}

//获取七牛云上传凭证：h5
const uploadGetTokenFromLocalStorageForH5 = () => {
  return localStorage.getItem('qiniuUploadTokenForH5')
}

//格式化顺序号
const formatOrderNo = (orderNo) => {
  let indexStr = ''
  let currentOrderNo = orderNo - 0
  if (currentOrderNo < 10) {
    indexStr = '00' + currentOrderNo
  } else if (currentOrderNo < 100) {
    indexStr = '0' + currentOrderNo
  } else {
    indexStr = currentOrderNo
  }
  return indexStr
}

//对象数组去重
const objArrayUnique = ({ arr, field }) => {
  if (Array.isArray(arr)) {
    let map = new Map()
    arr.forEach((item) => {
      map.set(item[field], item)
    })
    const resultArr = [...map.values()]
    return resultArr
  } else {
    return arr
  }
}

//获取管理员信息
const getAdminInfo = () => {
  let url = `${window.location.protocol}//${window.location.host}`
  let host = window.location.host
  //host = 'demo.xutongbao.top'
  // console.log('host', host, url)
  let now = Date.now()

  let myInfo = {
    url,
    wechatCode: 'xu1183391880',
    wechatQRCode: 'http://static.xutongbao.top/wechat.jpg?time=20230215',
    wechatGroupQRCode: `http://static.xutongbao.top/img/m-join-group-buffer.jpg?time=${now}`,
    email: '1183391880@qq.com',
    xingqiu1:
      'http://static.xutongbao.top/img/m-chat-xingqiu1.jpg?time=20230504',
    isHasBigWechatGroup: true,

    // host: 'gpt.xutongbao.top',
    // url,
    // wechatCode: 'zllt2075',
    // wechatQRCode:
    //   'http://static.xutongbao.top/img/m-gpt-wechat.jpg',
    // wechatGroupQRCode:
    //   `http://static.xutongbao.top/img/m-gpt-wechat-group.jpg?time=${now}`,
    // email: 'xxxx@qq.com',
    // isHasBigWechatGroup: false,
  }
  let hooks = [
    {
      id: 1,
      host: 'localhost:3000',
      ...myInfo,
    },
    {
      id: 2,
      host: 'chat.xutongbao.top',
      ...myInfo,
    },
    {
      id: 3,
      host: 'demo.xutongbao.top',
      url,
      wechatCode: 'xxxxxx',
      wechatQRCode:
        'http://static.xutongbao.top/img/m-wechat-demo.jpg?time=20230407',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-join-group-buffer.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 4,
      host: 'dunxia.com',
      url,
      wechatCode: 'xxxxxx',
      wechatQRCode:
        'http://static.xutongbao.top/img/m-wechat-demo.jpg?time=20230407',
      wechatGroupQRCode:
        'http://static.xutongbao.top/img/m-join-group-buffer-demo.jpg',
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 5,
      host: 'dalinvip.xutongbao.top',
      url,
      wechatCode: 'dalinvip2023',
      wechatQRCode: 'http://static.xutongbao.top/img/m-dalin-wechat.jpg',
      wechatGroupQRCode: 'http://static.xutongbao.top/img/m-dalin-wechat.jpg',
      xingqiu1: 'http://static.xutongbao.top/img/m-dalin-xingqiu1.jpg',
      xingqiu2: 'http://static.xutongbao.top/img/m-dalin-xingqiu2.jpg',
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 6,
      host: 'lntano.xutongbao.top',
      url,
      wechatCode: 'g15997086777',
      wechatQRCode: 'http://static.xutongbao.top/img/m-tan-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-tan-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 7,
      host: 'dk.xutongbao.top',
      url,
      wechatCode: 'wxid_51aibh0csyy322',
      wechatQRCode: 'http://static.xutongbao.top/img/m-dk-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-dk-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 8,
      host: 'cate.xutongbao.top',
      url,
      wechatCode: 'xch10472',
      wechatQRCode: 'http://static.xutongbao.top/img/m-cate-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-cate-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 9,
      host: 'luye.xutongbao.top',
      url,
      wechatCode: 'xch10472',
      wechatQRCode: 'http://static.xutongbao.top/img/m-luye-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-luye-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 10,
      host: 'erc.xutongbao.top',
      url,
      wechatCode: 'DIANBAN12',
      wechatQRCode: 'http://static.xutongbao.top/img/m-erc-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-erc-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
    {
      id: 11,
      host: 'gpt.xutongbao.top',
      url,
      wechatCode: 'zllt2075',
      wechatQRCode: 'http://static.xutongbao.top/img/m-gpt-wechat.jpg',
      wechatGroupQRCode: `http://static.xutongbao.top/img/m-gpt-wechat-group.jpg?time=${now}`,
      email: 'xxxx@qq.com',
      isHasBigWechatGroup: false,
    },
  ]

  const result = hooks.find((item) => item.host === host)
  if (result) {
    return result
  } else {
    return {
      ...hooks[1],
    }
  }
}

const handleWatchRNMessage = () => {
  if (window.ReactNativeWebView) {
    if (window.reactNative?.type === 'userInfo') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'userInfo' })
      )
    }
  }

  const eventListener = (e) => {
    let payload = e.data ? JSON.parse(e.data) : {}
    let type = payload.type

    if (type === 'userInfo') {
      localStorage.setItem('token', payload.token)
      localStorage.setItem('uid', payload.uid)
      localStorage.setItem('username', payload.username)
      localStorage.setItem('nickname', payload.nickname)
      localStorage.setItem('talkId', payload.talkId)
      localStorage.setItem('groupCode', payload.groupCode)
      localStorage.setItem('lastestVersion', payload.lastestVersion)
      localStorage.setItem('appVersion', payload.appVersion)
      localStorage.setItem('platformos', payload.platformos)

      Store.dispatch({
        type: 'SET_LIGHT_STATE',
        key: ['isRNGotToken'],
        value: true,
      })
    } else if (type === 'getBrowserInfo') {
      const { browser } = ua
      window.ReactNativeWebView.postMessage(JSON.stringify({ type, browser }))
    }
  }

  if (window.platform === 'rn') {
    if (ua.os.name === 'iOS') {
      window.addEventListener('message', eventListener)
    } else {
      window.document.addEventListener('message', eventListener)
    }
  }
}

handleWatchRNMessage()

//检查只能输入英文
const checkOnlyEnglish = (e, value) => {
  let zhCNReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (value && zhCNReg.test(value)) {
    return Promise.reject(new Error('只能输入英文!'))
  } else {
    return Promise.resolve()
  }
}

const checkIncrementOf = (e, value, number = 8) => {
  if (value && value % number !== 0) {
    return Promise.reject(new Error('请输入能被8整除的数!'))
  } else {
    return Promise.resolve()
  }
}

const sleep = async (count) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, count)
  })
}

export {
  //显示loading
  showLoading,
  //隐藏loading
  hideLoading,
  //把url里的查询字段转换成对象
  parseQueryString,
  //把路由里的查询字段转换成对象
  getRouterSearchObj,
  //获取主机名
  getHost,
  //深拷贝
  deepClone,
  //导出
  exportFile,
  //使用浏览器直接下载文件，url里拼接token
  downloadFile,
  //销售导出，为了兼容左剑飞写的get下载接口
  exportFileGet,
  // 添加/更新时间
  renderTime,
  // 渲染列表里的图片，如logo等
  renderImage,
  // 图片链接处理
  imageUrlFormat,
  //根据省市区编码查询省市区
  //上传接口添加token
  addUploadToken,
  //格式化权限数据
  formatAuthData,
  //获取每个页面的权限
  getMyAuth,
  //并发执行异步事件，按顺序输出结果,总耗时为数组中最大的数
  order,
  //只包含省市数据，不包含区
  getCityData,
  //根据图片链接截取图片名称
  getImageName,
  //上传接口添加额外的参数
  addUploadExtraData,
  //生成cancelToken，用于 取消请求
  getCancelSource,
  //格式化手机号码
  formatPhone,
  //添加日志
  addLog,
  //过滤需要隐藏的菜单
  filterHideMenu,
  //是否是PC
  isPC,
  //更新七牛云上传token
  uploadImgGetToken,
  //更新七牛云上传凭证：h5
  uploadGetTokenForH5,
  //获取七牛云上传token
  uploadImgGetTokenFromLocalStorage,
  //获取七牛云上传凭证：h5
  uploadGetTokenFromLocalStorageForH5,
  //格式化顺序号
  formatOrderNo,
  //对象数组去重
  objArrayUnique,
  //获取管理员信息
  getAdminInfo,
  checkOnlyEnglish,
  sleep,
  checkIncrementOf,
}
