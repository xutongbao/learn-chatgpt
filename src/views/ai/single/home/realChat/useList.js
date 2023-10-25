import { useState, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import Api from '../../../../../api'
import {
  handleWatchChatUpdate,
  handleLogin,
} from '../../../../../api/socket'
import {
  objArrayUnique,
  uploadGetTokenFromLocalStorageForH5,
  uploadGetTokenForH5,
  showLoading,
  hideLoading,
} from '../../../../../utils/tools'
import * as clipboard from 'clipboard-polyfill/text'
import Clipboard from 'clipboard'
import { Icon } from '../../../../../components/light'
import uaParser from 'ua-parser-js'
import Music from 'xgplayer-music'
import axios from 'axios'
import urls from '../../../../../api/urls'
import { getRouterSearchObj } from '../../../../../utils/tools'

import { v4 as uuidv4 } from 'uuid'

let isLoadingForSearch = false
let timer, timer2, timer3
let toBottom = 0
let myClipboard
let ua = uaParser(navigator.userAgent)
const { device } = ua
let player

let isCurrentPage = '1'

export default function useList(props) {
  const {
    location: { pathname },
  } = props
  let pageType = '1' //1单聊，2群聊
  let initTitle = 'ChatGPT'
  if (pathname === '/ai/groupChat') {
    pageType = '2'
    initTitle = '群聊'
  } else if (pathname === '/ai/chat-gpt-4') {
    pageType = '3'
    initTitle = 'GPT-4'
  }

  // eslint-disable-next-line
  const [title, setTitle] = useState(initTitle)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [total, setTotal] = useState()
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [message, setMessage] = useState('')
  // eslint-disable-next-line
  const [isSending, setIsSending] = useState(false)
  const [isGetNewest, setIsGetNewest] = useState(false)
  const [trigger, setTrigger] = useState('click')
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useState({})
  const [inputType, setInputType] = useState('1') //1文字，2录音
  const [isLoading, setIsLoading] = useState(false)

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  const scrollEl = useRef(null)

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isGetNewest = false,
  } = {}) => {
    let talkId = routerSearchObj.realTalkId
    let searchData = {
      pageNum: page,
      pageSize,
      talkId,
      isGetNewest,
    }
    setIsGetNewest(isGetNewest)
    setIsLoading(true)
    Api.h5.realChatAppSearch(searchData).then((res) => {
      setIsLoading(false)
      hideLoading()
      if (res.code === 200) {
        let list = res.data.list.map((item) => {
          let message = item.message
          let isShowToAudioBtn = false
          let messageOwner = item.users.find((item) => item.isOwner === '1')
          let friendsUserInfoArr = item.users.filter(
            (item) => item.uid !== localStorage.getItem('uid')
          )

          if (friendsUserInfoArr.length === 0) {
            friendsUserInfoArr=[{
              isRead: '1'
            }]
          }

          return {
            ...item,
            chatGPTVersion: '',
            message,
            messageForHtml: message,
            isAudioLoading: false,
            isShowToAudioBtn,
            isOpenPopover: false,
            messageOwner,
            friendsUserInfoArr,
          }
        })
        if (isGetNewest === true) {
          if (Array.isArray(list) && list.length > 0) {
            let mergeList = [...list]
            mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
            setState({
              dataSource: mergeList,
              pageSize: res.data.pageSize,
            })
          }
        } else {
          let mergeList = [...list, ...state.dataSource]
          mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
          if (Array.isArray(mergeList) && mergeList.length > 0) {
            setState({
              dataSource: mergeList,
              pageSize: res.data.pageSize,
            })
          }
        }
        setTotal(res.data.total)
        const currentTemp = res.data.pageNum - 1
        setCurrent(currentTemp)
      }
    })
  }

  //发送
  const handleSend = ({ messageByRecorder = '' } = {}) => {
    if (inputType === '2') {
      if (messageByRecorder === '' || messageByRecorder.trim() === '') {
        antdMessage.warning('请录音')
        return
      }
    } else {
      if (message === '' || message.trim() === '') {
        antdMessage.warning('请输入内容')
        return
      }
    }

    let info = {
      messageType: '1',
      message: message,
    }
    showLoading()
    Api.h5
      .realChatAdd({ info, talkId: routerSearchObj.realTalkId })
      .then((res) => {
        if (res.code === 200) {
          handleSearch({ isGetNewest: true, page: 1 })
        }
      })
    setMessage('')
  }

  //#region 录音
  const handleUploadAudio = async (blob) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    const uid = uuidv4()
    let formData = new FormData()
    formData.append('file', blob, `${uid}.webm`)
    formData.append('token', uploadGetTokenFromLocalStorageForH5())
    formData.append('key', `ai/audio/real01/${Date.now()}-${uid}.webm`)
    formData.append('fname', `${uid}.webm`)

    let uploadRes = await axios({
      url: urls.light.uploadToCDN,
      method: 'post',
      data: formData,
    })
    let fileWisperForH5Res
    if (uploadRes?.data?.code === 200) {
      fileWisperForH5Res = await Api.h5.fileWisperForH5({
        url: uploadRes.data.data.key,
      })
    }
    if (fileWisperForH5Res?.code === 200) {
      handleSend({
        messageByRecorder: fileWisperForH5Res.data.info.data.respData.text,
        audioUrlCdnForRecorder: fileWisperForH5Res.data.urlCdn,
        audioUrlForRecorder: uploadRes.data.data.key,
      })
    }
  }
  const handleNotAllowedOrFound = () => {
    console.log('todo')
  }
  //#endregion

  const handleToolbarOpenChange = ({ open, item }) => {
    const { uid } = item
    let { dataSource, pageSize } = state
    const resultIndex = dataSource.findIndex((item) => item.uid === uid)
    if (resultIndex >= 0) {
      dataSource[resultIndex].isOpenPopover = open
      setState({
        dataSource,
        pageSize,
      })
    }
  }

  // eslint-disable-next-line
  const handleToolbarVisible = () => {
    let { dataSource, pageSize } = state
    dataSource = dataSource.map((item) => {
      return {
        ...item,
        isOpenPopover: false,
      }
    })
    setState({
      dataSource,
      pageSize,
    })
  }

  //转音频
  const handleToAudio = (item, robotMessage = '') => {
    const { uid } = item
    let { dataSource, pageSize } = state
    if (item.isAudioLoading) {
      antdMessage.success('转音频中，请耐心等待')
    } else {
      const resultIndex = dataSource.findIndex((item) => item.uid === uid)
      if (resultIndex >= 0) {
        dataSource[resultIndex].isAudioLoading = true
        let newDataSource = [...dataSource]
        newDataSource = newDataSource.filter(
          (item) => (item.uid + '').indexOf('robot-loading') < 0
        )

        setState({
          dataSource: newDataSource,
          pageSize,
        })
        let talkId = localStorage.getItem('talkId')
        //handleToolbarVisible()
        antdMessage.success('转音频中，请耐心等待')
        Api.h5.chatAddAudio({ uid, robotMessage, talkId }).then((res) => {
          if (res.code === 200) {
            const { audioUrlCdn, isCutMessage } = res.data
            dataSource[resultIndex] = {
              ...dataSource[resultIndex],
              audioUrlCdn,
              isAudioLoading: false,
              //isShowToAudioBtn: false,
            }

            if (isCutMessage) {
              antdMessage.warning('成功-超出部分已自动截断')
            } else {
              antdMessage.success('成功')
            }
            let newDataSource = [...dataSource]
            newDataSource = newDataSource.filter(
              (item) => (item.uid + '').indexOf('robot-loading') < 0
            )

            setState({
              dataSource: newDataSource,
              pageSize,
            })
          }
        })
      }
    }
  }

  //播放音频
  const handleAudioPlayerBtnClick = (item) => {
    setTimeout(() => {
      let { dataSource } = state
      let url = []

      dataSource.forEach((item) => {
        if (item.audioUrlCdn) {
          url.push({
            src: item.audioUrlCdn,
            name: item.nickname,
            vid: item.uid,
            poster: 'http://static.xutongbao.top/img/logo.png',
            //poster: item.userAvatarCdn
            //poster: null
          })
        }
      })
      let resultIndex = url.findIndex((urlItem) => urlItem.vid === item.uid)
      if (player) {
        player.destroy()
        //player.pause()
      }
      let clientWidth = document.body.clientWidth
      let width = 500
      let height = 50
      if (clientWidth < 768) {
        width = 260
        height = 120
      }
      player = new Music({
        id: `m-chat-audio-player-${item.uid}`,
        url,
        volume: 0.8,
        width,
        height,
        preloadNext: true,
        switchKeepProgress: false,
        abCycle: {
          // start: 3,
          // end: 9,
          loop: false,
        },
        offline: false,
      })
      player.setIndex(resultIndex)
      // player.on('change', (res) => {
      //   console.log(res);
      // });
    }, 100)
  }

  const handleCtrlEnter = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSend()
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  const changeMessageByUpload = ({ data }) => {
    setMessage(`${message}${data.urlCdn}`)
  }

  //跳转
  const handleJumpPage = (path) => {
    isCurrentPage = '2'
    props.history.push(path)
  }

  const handleUpdateToGPT4 = (path) => {
    props.dialogShow({ type: 'exchange' })
  }

  const handleScroll = (scrollValues) => {
    // eslint-disable-next-line
    let { scrollTop, clientHeight, scrollHeight } = scrollValues
    if (scrollTop < 200) {
      if (isLoadingForSearch === false && current > 0) {
        isLoadingForSearch = true
        handleSearch()
      }
    }
  }

  const handleCopy = (text) => {
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
    clipboard.writeText(text).then(() => {
      antdMessage.success('复制成功')
    })
    // handleToolbarVisible()
  }

  const getMessageToolbar = (item) => {
    return (
      <div className="m-real-chat-message-toolbar">
        {item.audioUrlCdn ? (
          // eslint-disable-next-line
          <a
            href={item.audioUrlCdn}
            target="_blank"
            className="m-real-chat-toolbar-link"
          >
            <Icon
              name="download"
              title="复制"
              className="m-real-chat-toolbar-icon"
            ></Icon>
            <div>下载音频</div>
          </a>
        ) : null}

        {item.isShowToAudioBtn ? (
          <div
            className="m-real-chat-toolbar-item"
            onClick={() => handleToAudio(item)}
            title={item.isAudioLoading ? '转音频中' : '转音频'}
          >
            <Icon name="music" className="m-real-chat-toolbar-icon"></Icon>
            <div>{item.isAudioLoading ? '转音频中' : '转音频'}</div>
          </div>
        ) : null}
        <div
          className="m-real-chat-toolbar-item"
          onClick={() => handleCopy(item.info.message)}
        >
          <Icon
            name="copy"
            title="复制"
            className="m-real-chat-toolbar-icon"
          ></Icon>
          <div>复制</div>
        </div>
      </div>
    )
  }

  //操作
  const handleAction = ({ type, record }) => {
    if (type === 'refresh') {
      handleSearch({ isGetNewest: true })
    }
  }

  useEffect(() => {
    uploadGetTokenForH5()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        Api.h5.userGetInfo({ isLoading: false }).then((res) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          }
        })
      }
    } else {
      Api.h5.userGetInfo({ isLoading: false }).then((res) => {
        if (res.code === 200) {
          setUserInfo(res.data)
        }
      })
    }
  }, [props.isRNGotToken])

  useEffect(() => {
    let dataSource = state.dataSource

    if (isGetNewest) {
      if (Array.isArray(dataSource) && dataSource.length > 0) {
        setTimeout(() => {
          if (isCurrentPage === '1') {
            const current = scrollEl.current
            current.scrollToBottom()
          }
        }, 100)
        setTimeout(() => {
          if (isCurrentPage === '1') {
            const current = scrollEl.current
            current.scrollToBottom()
          }
        }, 500)
      }
    } else {
      if (scrollEl.current) {
        const current = scrollEl.current
        // eslint-disable-next-line
        let { scrollTop, clientHeight, scrollHeight } = current.scrollValues
        toBottom = scrollHeight - scrollTop
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        if (isCurrentPage === '1') {
          isLoadingForSearch = false
          if (scrollEl.current) {
            const current = scrollEl.current

            let { scrollHeight } = current.scrollValues
            let toTop = scrollHeight - toBottom
            current.scrollTo(undefined, toTop)
            clearTimeout(timer2)

            timer2 = setTimeout(() => {
              if (isCurrentPage === '1') {
                current.scrollTo(undefined, toTop)
              }
            }, 200)
          }
        }
      }, 100)
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        handleSearch({ isGetNewest: true })
      }
    } else {
      handleSearch({ isGetNewest: true })
    }

    // eslint-disable-next-line
  }, [props.isRNGotToken])

  useEffect(() => {
    //过滤1：消息【不是我】发的，过滤2：这条消息我【未读】
    let uids = state.dataSource
      .filter((item) => {
        let messageOwner = item.users.find((item) => item.isOwner === '1')
        return messageOwner.uid !== localStorage.getItem('uid')
      })
      .filter((item) => {
        let myUserInfo = item.users.find(
          (item) => item.uid === localStorage.getItem('uid')
        )
        return myUserInfo.isRead === '1' ? false : true
      })
      .map((item) => item.uid)
    if (Array.isArray(uids) && uids.length > 0) {
      Api.h5
        .realChatEdit({
          uids,
          isRead: '1',
        })
        .then((res) => {
          if (res.code === 200) {
            //handleSearch({ isGetNewest: true, page: 1 })
          }
        })
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    const codeDoms = document.querySelectorAll('pre')

    let i = document.createElement('span')
    i.setAttribute(
      'class',
      'icon iconfont icon-copy m-group-chat-code-copy-icon hljs-copy'
    )
    i.setAttribute('data-clipboard-action', 'copy')
    Array.from(codeDoms).forEach((item, index) => {
      let dom = i.cloneNode(false)
      let i_text = document.createTextNode('复制')
      dom.appendChild(i_text)
      dom.setAttribute('data-clipboard-target', '#copy' + index)
      item.appendChild(dom)
      let child = item.children[0]
      child.setAttribute('id', 'copy' + index)
    })

    myClipboard = new Clipboard('.hljs-copy')
    myClipboard.on('success', (e) => {
      antdMessage.success('复制代码块成功')
      e.clearSelection() // 清除文本的选中状态
    })
    myClipboard.on('error', (e) => {
      antdMessage.warning('复制失败')
      e.clearSelection() // 清除文本的选中状态
    })
    let domList = document.getElementsByClassName('m-group-chat-code-copy-icon')
    if (domList.length > 0) {
      for (let i = 0; i < domList.length; i++) {
        // eslint-disable-next-line
        domList[i].onclick = function (e) {
          setTrigger('')
          clearTimeout(timer3)

          timer3 = setTimeout(() => {
            setTrigger('click')
          }, 200)
        }
      }
    }
    return () => {
      myClipboard?.destroy()
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    handleLogin()
    handleWatchChatUpdate({
      callback: () => {
        if (document.location.href.includes('/single/home/realChat')) {
          handleSearch({ isGetNewest: true })
        }
      },
    })
    // eslint-disable-next-line
  }, [])

  return {
    username,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    message,
    isSending,
    scrollEl,
    trigger,
    device,
    pageType,
    title,
    inputType,
    routerSearchObj,
    isLoading,
    handleSearch,
    handleSend,
    handleCtrlEnter,
    handleJumpPage,
    handleInputChange,
    handleScroll,
    handleUpdateToGPT4,
    handleAction,
    getMessageToolbar,
    handleToAudio,
    handleAudioPlayerBtnClick,
    handleToolbarOpenChange,
    changeMessageByUpload,
    setInputType,
    handleUploadAudio,
    handleNotAllowedOrFound,
  }
}
