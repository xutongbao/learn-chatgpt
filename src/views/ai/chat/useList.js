import { useState, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import Api from '../../../api'
import { objArrayUnique, showLoading, hideLoading } from '../../../utils/tools'
import * as clipboard from 'clipboard-polyfill/text'
import Clipboard from 'clipboard'
import { Icon } from '../../../components/light'
import MarkdownIt from 'markdown-it'
import mdKatex from 'markdown-it-katex'
import mdHighlight from 'markdown-it-highlightjs'
import { codeArr } from './config'
import uaParser from 'ua-parser-js'
// eslint-disable-next-line
import Player from 'xgplayer'
import Music from 'xgplayer-music'

let count = 0
let isLoadingForSearch = false
let timer, timer2, timer3
let toBottom = 0
let myClipboard
const md = MarkdownIt().use(mdKatex).use(mdHighlight)
let ua = uaParser(navigator.userAgent)
const { device } = ua
let player

let isCurrentPage = '1'
let touchStartTime, touchEndTime
let touchTimer
let selecttionObj

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
  let robotAvatar = 'http://static.xutongbao.top/img/m-gpt-3_5-logo.png'

  if (pageType === '1') {
    robotAvatar = 'http://static.xutongbao.top/img/m-gpt-3_5-logo.png'
  } else if (pageType === '3') {
    robotAvatar = 'http://static.xutongbao.top/img/m-gpt-4-logo.png'
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
  const [isSending, setIsSending] = useState(false)
  const [isGetNewest, setIsGetNewest] = useState(false)
  const [trigger, setTrigger] = useState('click')
  const [userInfo, setUserInfo] = useState({})

  const scrollEl = useRef(null)
  let uidForFrontEndPeopleMesssage

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isGetNewest = false,
  } = {}) => {
    let talkId = localStorage.getItem('talkId')
    let searchParams = {}
    let searchData = {}
    if (pageType === '1') {
      let routerSearchObjNew = { talkId, gptVersion: '3.5' }
      searchParams = {
        ...routerSearchObjNew,
      }
      searchData = { pageNum: page, pageSize, ...searchParams, isGetNewest }
      if (talkId === 'guest') {
        return
      }
    } else if (pageType === '3') {
      let talkId = localStorage.getItem('talkId')
      let routerSearchObjNew = { talkId, gptVersion: '4' }
      searchParams = {
        ...routerSearchObjNew,
      }
      searchData = { pageNum: page, pageSize, ...searchParams, isGetNewest }
      if (talkId === 'guest') {
        return
      }
    } else if (pageType === '2') {
      searchParams = {
        talkId: '',
        gptVersion: '',
      }

      let username = localStorage.getItem('username')
      let isAll = false
      if (username === 'admin' || username === '1183391880') {
        isAll = true
      }
      searchData = {
        pageNum: page,
        pageSize,
        ...searchParams,
        isGetNewest,
        isAll,
      }
    }
    setIsGetNewest(isGetNewest)
    showLoading()
    Api.h5.chatSearch(searchData, false).then((res) => {
      if (res.code === 200) {
        let list = res.data.list.map((item) => {
          let message = item.message
          let codeHighLightHistory =
            localStorage.getItem('codeHighLight') === 'false' ? false : true
          let messageForHtml
          let isIncludeCode =
            [...message].filter((item) => item === '`').length >= 6 ||
            message.includes(`:--`) ||
            message.includes(`: --`) ||
            message.includes(`|--`) ||
            message.includes(`| --`)

          if (
            codeHighLightHistory &&
            item.messageType === '2' &&
            isIncludeCode
          ) {
            const messageTemp = formatCode({ message: item.message })
            messageForHtml = md.render(messageTemp)
          } else {
            if (message.includes('http')) {
              const messageTemp = formatCode({ message: item.message })
              messageForHtml = md.render(messageTemp)
            } else {
              message = item.message.replace(/ /g, '&nbsp;')
              messageForHtml = message
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
            }
          }

          let isShowToAudioBtn = getIsShowToAudioBtn({
            message,
            item,
            isIncludeCode,
          })

          if (
            item.userAvatarCdn === 'http://static.xutongbao.top/img/logo.png'
          ) {
            item.userAvatarCdn =
              'http://static.xutongbao.top/img/m-default-avatar.jpg'
          }
          let chatGPTVersion = item.chatGPTVersion
          if (pageType === '3') {
            chatGPTVersion = '4'
          }
          return {
            ...item,
            chatGPTVersion,
            message,
            messageForHtml,
            isAudioLoading: false,
            isShowToAudioBtn,
            isOpenPopover: false,
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
          hideLoading()
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
        selecttionObj?.empty()
      }
    })
  }

  const addRobotMessage = ({
    robotMessage = '',
    chatGPTVersion = '3.5',
    uidForPeopleMesssage,
    uidForRobotMessage,
  }) => {
    let { dataSource, pageSize } = state
    let message = robotMessage
    let codeHighLightHistory =
      localStorage.getItem('codeHighLight') === 'false' ? false : true
    let messageForHtml = message
    let isIncludeCode =
      [...message].filter((item) => item === '`').length >= 6 ||
      message.includes(`:--`)
    if (codeHighLightHistory && isIncludeCode) {
      const messageTemp = formatCode({ message })
      messageForHtml = md.render(messageTemp)
    }

    let isShowToAudioBtn = getIsShowToAudioBtn({ message, isIncludeCode })

    const now = Date.now()
    dataSource.push({
      uid: uidForRobotMessage,
      userAvatarCdn: robotAvatar,
      nickname: 'robot',
      messageOwner: 'robot',
      message: robotMessage,
      messageForHtml,
      messageType: '2',
      chatGPTVersion,
      isAudioLoading: false,
      isShowToAudioBtn,
      isOpenPopover: false,
      createTime: now,
      userInfo: {},
    })

    let resultIndex = dataSource.findIndex(
      (item) => item.uid === uidForFrontEndPeopleMesssage
    )
    if (resultIndex >= 0) {
      const { message, isIncludeCode } = dataSource[resultIndex]
      dataSource[resultIndex].uid = uidForPeopleMesssage
      let isShowToAudioBtn = getIsShowToAudioBtn({ message, isIncludeCode })
      dataSource[resultIndex].isShowToAudioBtn = isShowToAudioBtn
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

  const handleSendLoop = ({ isNeedContext = true } = {}) => {
    let talkId = localStorage.getItem('talkId')
    let groupCode = localStorage.getItem('groupCode')
    let gptVersion = '3.5'
    if (pageType === '1') {
      talkId = localStorage.getItem('talkId')
      gptVersion = '3.5'
    } else if (pageType === '3') {
      talkId = localStorage.getItem('talkId')
      gptVersion = '4'
    }

    setIsSending(true)
    Api.h5
      .chatAdd({
        message,
        talkId,
        isNeedContext,
        groupCode,
        gptVersion,
      })
      .then(async (res) => {
        if (res.code === 200) {
          if (res.data.isRobotBusy === true) {
            count = count + 1
            if (count < 5) {
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve()
                }, 1000)
              })
              handleSendLoop({ isNeedContext: false })
            } else {
              antdMessage.warning(res.message)
              setIsSending(false)
              count = 0
            }
          } else {
            //请求列表
            //handleSearch({ isGetNewest: true })
            const {
              robotMessage,
              chatGPTVersion,
              uidForPeopleMesssage,
              uidForRobotMessage,
            } = res.data
            addRobotMessage({
              robotMessage,
              chatGPTVersion,
              uidForPeopleMesssage,
              uidForRobotMessage,
            })
            count = 0
            setIsSending(false)
            setMessage('')
          }
        } else if (res.code === 400) {
          setIsSending(false)
        } else if (res.code === 500) {
          setIsSending(false)
        } else if (res.code === 40001) {
          setIsSending(false)
          isCurrentPage = '2'
          props.history.push(`/ai/exchange`)
        } else if (res.code === 40003) {
          setIsSending(false)
          isCurrentPage = '2'
          antdMessage.success('提问数受限，请加入微信群获取验证码')
          props.history.push(`/ai/single/me/joinGroup`)
        }
      })
  }

  //发送
  const handleSend = ({ isNeedContext = true } = {}) => {
    if (message === '' || message.trim() === '') {
      antdMessage.warning('请输入内容')
      return
    }
    let talkId = localStorage.getItem('talkId')

    if (talkId === 'guest') {
      antdMessage.warning('游客仅可以在群聊中看别人提问，请注册账号')
    } else {
      let { dataSource, pageSize } = state
      let { avatarCdn, nickname, payStatus, createTime } = userInfo

      let messageForHtml = ''
      if (message.includes('http')) {
        const messageTemp = formatCode({ message })
        messageForHtml = md.render(messageTemp)
      } else {
        const messageTemp = message.replace(/ /g, '&nbsp;')
        messageForHtml = messageTemp.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }
      if (avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
        avatarCdn = 'http://static.xutongbao.top/img/m-default-avatar.jpg'
      }
      if (
        avatarCdn === 'http://static.xutongbao.top/img/m-default-avatar.jpg'
      ) {
        if (Array.isArray(dataSource) && dataSource.length > 40) {
          antdMessage.success({
            content: '请上传头像后再提问',
            duration: 30,
          })
          props.history.push('/ai/single/me/editUserInfo')
          return
        }
      }
      const now = Date.now()
      uidForFrontEndPeopleMesssage = now
      dataSource.push({
        uid: now,
        userAvatarCdn: avatarCdn,
        nickname,
        messageOwner: nickname,
        message,
        messageForHtml,
        messageType: '1',
        chatGPTVersion: '4',
        isAudioLoading: false,
        isShowToAudioBtn: false,
        isOpenPopover: false,
        createTime: now,
        userInfo: {
          payStatus,
          createTime,
        },
      })

      dataSource.push({
        uid: `${now}-robot-loading`,
        userAvatarCdn: robotAvatar,
        nickname: 'robot',
        messageOwner: 'robot',
        message: '...',
        messageForHtml: `<div style="display:flex"><img src="http://static.xutongbao.top/img/loading.gif" style="width:20px;height:20px"/></div>`,
        messageType: '2',
        chatGPTVersion: '0',
        isAudioLoading: false,
        isShowToAudioBtn: false,
        isOpenPopover: false,
        createTime: now,
        userInfo: {},
      })
      let newDataSource = [...dataSource]

      setIsGetNewest(true)
      setState({
        dataSource: newDataSource,
        pageSize,
      })
      handleSendLoop({ isNeedContext })
      setMessage('')
    }
  }

  const getIsShowToAudioBtn = ({ message, isIncludeCode }) => {
    let isShowToAudioBtn = true
    let zhCNReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    let jaJPReg = new RegExp('[\\u3040-\\u309F\\u30A0-\\u30FF]+', 'g')
    let koKRReg = new RegExp('[\\u3130-\\u318F\\uAC00-\\uD7AF]+', 'g')
    if (jaJPReg.test(message)) {
      isShowToAudioBtn = true
    } else if (koKRReg.test(message)) {
      isShowToAudioBtn = true
    } else if (zhCNReg.test(message) && message.length > 500) {
      isShowToAudioBtn = false
    }
    if (isIncludeCode) {
      isShowToAudioBtn = false
    } else if (message.includes('```')) {
      isShowToAudioBtn = false
    }
    if (localStorage.getItem('nickname').includes('徐同保-超级管理员')) {
      isShowToAudioBtn = true
    }
    return isShowToAudioBtn
  }

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
  const handleToAudio = (item) => {
    const { uid } = item
    let { dataSource, pageSize } = state
    if (item.isAudioLoading) {
      antdMessage.success('转音频中，请耐心等待')
    } else {
      const resultIndex = dataSource.findIndex((item) => item.uid === uid)
      if (resultIndex >= 0) {
        dataSource[resultIndex].isAudioLoading = true
        setState({
          dataSource,
          pageSize,
        })
        let talkId = localStorage.getItem('talkId')
        //handleToolbarVisible()
        antdMessage.success('转音频中，请耐心等待')
        Api.h5.chatAddAudio({ uid, talkId }).then((res) => {
          if (res.code === 200) {
            const { audioUrlCdn, isCutMessage } = res.data
            dataSource[resultIndex] = {
              ...dataSource[resultIndex],
              audioUrlCdn,
              isAudioLoading: false,
              //isShowToAudioBtn: false,
            }

            //console.log('dataSource', dataSource)
            if (isCutMessage) {
              antdMessage.warning('成功-超出部分已自动截断')
            } else {
              antdMessage.success('成功')
            }
            setState({
              dataSource,
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

  const formatCode = ({ message }) => {
    let result = message
    for (let i = 0; i < codeArr.length; i++) {
      let tempReg = '/[^\\n]```' + codeArr[i] + '[\\s\\S]*?```/ig'
      // eslint-disable-next-line
      let reg = eval(tempReg)
      result = result.replace(reg, (word) => {
        let endStr = '\n```\n'
        return `${word.slice(0, 1)}\n${word.slice(
          1,
          codeArr[i].length + 4
        )}\n${word.slice(codeArr[i].length + 4, word.length - 3)}${endStr}`
      })
    }
    return result
  }

  const handleCtrlEnter = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSend()
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  //退出
  const handleQuit = () => {
    Api.light.userLogout().then((res) => {
      if (res.code === 200) {
        isCurrentPage = '2'
        props.history.push('/h5/login')
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')
      }
    })
  }

  //跳转
  const handleJumpPage = (path) => {
    isCurrentPage = '2'
    props.history.push(path)
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
      <div className="m-ai-chat-message-toolbar">
        {item.audioUrlCdn ? (
          // eslint-disable-next-line
          <a
            href={item.audioUrlCdn}
            target="_blank"
            className="m-ai-chat-toolbar-link"
          >
            <Icon
              name="download"
              title="复制"
              className="m-ai-chat-toolbar-icon"
            ></Icon>
            <div>下载音频</div>
          </a>
        ) : null}

        {item.isShowToAudioBtn ? (
          <div
            className="m-ai-chat-toolbar-item"
            onClick={() => handleToAudio(item)}
            title={item.isAudioLoading ? '转音频中' : '转音频'}
          >
            <Icon name="music" className="m-ai-chat-toolbar-icon"></Icon>
            <div>{item.isAudioLoading ? '转音频中' : '转音频'}</div>
          </div>
        ) : null}
        <div
          className="m-ai-chat-toolbar-item"
          onClick={() => handleCopy(item.message)}
        >
          <Icon
            name="copy"
            title="复制"
            className="m-ai-chat-toolbar-icon"
          ></Icon>
          <div>复制</div>
        </div>
      </div>
    )
  }

  const handleSelectText = (uid) => {
    // const newRange = document.createRange()
    // let dom = document.getElementById(`m-ai-message-value-${uid}`)
    // newRange.selectNode(dom)
    // var selecttionObj = window.getSelection()
    // selecttionObj.empty()
    // selecttionObj.addRange(newRange)
  }
  const handleTouchStart = (uid) => {
    touchStartTime = Date.now()
    clearTimeout(touchTimer)
    touchTimer = setTimeout(() => {
      console.log('长按1')
      const newRange = document.createRange()
      let dom = document.getElementById(`m-ai-message-value-${uid}`)
      newRange.selectNode(dom)
      const selecttionObj = window.getSelection()
      setTimeout(() => {
        selecttionObj.empty()
        selecttionObj.addRange(newRange)
      }, 10)
    }, 100)
  }
  const handleTouchEnd = (uid) => {
    clearTimeout(touchTimer)

    touchEndTime = Date.now()
    // console.log(touchEndTime, touchStartTime, touchEndTime - touchStartTime)
    if (touchEndTime - touchStartTime < 50) {
      // console.log('长按时间太短')
    } else {
      console.log('长按2')
      const newRange = document.createRange()
      let dom = document.getElementById(`m-ai-message-value-${uid}`)
      newRange.selectNode(dom)
      selecttionObj = window.getSelection()
      setTimeout(() => {
        selecttionObj.empty()
        selecttionObj.addRange(newRange)
      }, 10)
    }
  }

  const handleDoubleClick = (uid) => {
    console.log('双击')
    const newRange = document.createRange()
    let dom = document.getElementById(`m-ai-message-value-${uid}`)
    newRange.selectNode(dom)
    selecttionObj = window.getSelection()
    setTimeout(() => {
      selecttionObj.empty()
      selecttionObj.addRange(newRange)
    }, 10)
  }

  //操作
  const handleAction = ({ type, record }) => {
    if (type === 'refresh') {
      handleSearch({ isGetNewest: true })
    } else if (type === 'invisible') {
      isCurrentPage = '2'
      props.history.push(`/ai/single/me/invisible`)
    } else if (type === 'contactUs') {
      isCurrentPage = '2'
      props.history.push(`/ai/contactUs`)
    } else if (type === 'quit') {
      isCurrentPage = '2'
      props.history.push(`/ai/login`)
    } else if (type === 'free') {
      isCurrentPage = '2'
      props.history.push(`/ai/single/me/joinGroup`)
    }
  }

  useEffect(() => {
    Api.h5.userGetInfo({ isLoading: false }).then((res) => {
      if (res.code === 200) {
        setUserInfo(res.data)
      }
    })
  }, [])

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

        hideLoading()
      }, 100)
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    handleSearch({ isGetNewest: true })
    // eslint-disable-next-line
  }, [])

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
    handleSearch,
    handleSend,
    handleCtrlEnter,
    handleQuit,
    handleJumpPage,
    handleInputChange,
    handleScroll,
    handleSelectText,
    handleTouchStart,
    handleTouchEnd,
    handleDoubleClick,
    handleAction,
    getMessageToolbar,
    handleToAudio,
    handleAudioPlayerBtnClick,
    handleToolbarOpenChange,
  }
}
