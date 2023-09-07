import { io } from 'socket.io-client'
import { socketBaseURL } from '../utils/config'
import Api from './index'
import Store from '../store'

const socket = io(`${socketBaseURL}`)

//let timer
let timer1
let count = 0
let audio
let loginAudio
let historyLoginUserIds = []
const getConfig = () => {
  let config = {
    headers: {},
  }
  if (config.isNotNeedToken !== true) {
    config.headers.authorization = localStorage.getItem('token')
  }
  if (window.platform === 'rn') {
    config.headers.platformos = localStorage.getItem('platformos')
      ? localStorage.getItem('platformos')
      : 'rn'
    config.headers.version = localStorage.getItem('appVersion')
      ? localStorage.getItem('appVersion')
      : ''
  } else {
    config.headers.platformos = 'h5'
    config.headers.version = window.version
  }
  config.headers.href = `${document.location.href}?platformos=${config.headers.platformos}&version=${config.headers.version}`

  return config
}

function onConnect() {
  console.log('已连接 socket.id', socket.id)
}
socket.on('connect', onConnect)

socket.on('/socket/login', (res) => {
  let socketLoginAlarmHistory =
    localStorage.getItem('socketLoginAlarm') === 'false' ? false : true
  if (res.uid !== localStorage.getItem('uid') && socketLoginAlarmHistory) {
    if (historyLoginUserIds.includes(res.uid) === false) {
      try {
        loginAudio.play()
        historyLoginUserIds.push(res.uid)
        console.log('play', res)
      } catch (error) {
        console.log('用户点击网页后，再收到消息时，会有提示音')
      }
    }
  }
})

const handleLogin = () => {
  const config = getConfig()
  let socketLoginTime = localStorage.getItem('socketLoginTime')
  if (socketLoginTime) {
    let now = Date.now()
    //60秒内socket登录只会执行一次
    let seconds = process.env.REACT_APP_MODE === 'dev' ? 3 : 60
    if (now - socketLoginTime > 1000 * seconds) {
      // 继续
    } else {
      return
    }
  }
  if (config.headers.authorization) {
    socket.emit('/socket/login', {
      ...config,
      code: 200,
      data: {},
      message: '成功',
      time: Date.now(),
    })
    console.log('socket login')
    let socketLoginTime = Date.now()
    localStorage.setItem('socketLoginTime', socketLoginTime)
  }
}
handleLogin()

const initAudio = () => {
  let alarm = document.getElementById('js-alarm')
  if (alarm) {
    alarm.remove()
  }
  audio = document.createElement('audio')
  audio.id = 'js-alarm'
  audio.src = 'https://static.xutongbao.top/music/alarm_20230905.mp3'
  audio.style.display = 'none'
  audio.controls = true

  document.body.append(audio)

  let loginAlarm = document.getElementById('js-login-alarm')
  if (loginAlarm) {
    loginAlarm.remove()
  }
  loginAudio = document.createElement('audio')
  loginAudio.id = 'js-login-alarm'
  //loginAudio.src = 'https://static.xutongbao.top/music/login_2023090601.mp3' //咳嗽
  loginAudio.src = 'https://static.xutongbao.top/music/login_20230907.mp3' //敲门
  loginAudio.style.display = 'none'
  loginAudio.controls = true

  document.body.append(loginAudio)
}
const playAudio = () => {
  try {
    audio.play()
  } catch (error) {
    console.log('用户点击网页后，再收到消息时，会有提示音')
  }
}

const handleRealTalkAppSearch = () => {
  let searchData = { pageNum: '1', pageSize: 1, isLightData: true }
  Api.h5.realTalkAppSearch(searchData).then((res) => {
    if (res.code === 200) {
      let unReadCount = res.data.unReadCount
      let homeMsgCount = Store.getState().getIn(['light', 'homeMsgCount'])
      if (homeMsgCount !== '' && unReadCount > homeMsgCount) {
        console.log('您有新消息，socket文件', unReadCount)
        playAudio()
      }
      Store.dispatch({
        type: 'SET_LIGHT_STATE',
        key: ['homeMsgCount'],
        value: unReadCount,
      })
      console.log('未读消息数', unReadCount)
      clearInterval(timer1)
      document.title = '学习'
      if (unReadCount > 0) {
        timer1 = setInterval(() => {
          count++
          if (count % 2 === 0) {
            document.title = '您有新消息\u{1F514}'
          } else {
            document.title = '您有新消息'
          }
        }, 1000)
      }
    }
  })
}

const handleWatchChatUpdate = ({ callback } = {}) => {
  socket.off('/socket/chatUpdate')
  socket.on('/socket/chatUpdate', (res) => {
    callback && callback(res)
    handleRealTalkAppSearch()
    // clearTimeout(timer)
    // timer = setTimeout(() => {
    //   handleRealTalkAppSearch()
    // }, 3000)
  })
}
handleRealTalkAppSearch()
handleWatchChatUpdate()

const handleTriggerChatUpdate = () => {
  const config = getConfig()
  socket.emit('/socket/chatUpdate', {
    ...config,
    code: 200,
    data: {},
    message: '成功',
    time: Date.now(),
  })
}

export {
  socket,
  initAudio,
  handleLogin,
  handleWatchChatUpdate,
  handleTriggerChatUpdate,
}
