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

let count = 0
let isLoadingForSearch = false
let timer, timer2, timer3
let toBottom = 0
let myClipboard
const md = MarkdownIt().use(mdKatex).use(mdHighlight)
let ua = uaParser(navigator.userAgent)
const { device } = ua

export default function useList(props) {
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
  const scrollEl = useRef(null)
  const [trigger, setTrigger] = useState('click')
  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isGetNewest = false,
  } = {}) => {
    let routerSearchObjNew = { talkId: localStorage.getItem('talkId') }

    const searchParams = {
      ...routerSearchObjNew,
      talkId: '',
    }

    let username = localStorage.getItem('username')
    let isAll = false
    if (username === 'admin' || username === '1183391880') {
      isAll = true
    }
    let searchData = {
      pageNum: page,
      pageSize,
      ...searchParams,
      isGetNewest,
      isAll,
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
            message.includes(`:--`)
          if (
            codeHighLightHistory &&
            item.messageType === '2' &&
            isIncludeCode
          ) {
            const messageTemp = formatCode({ message: item.message })
            messageForHtml = md.render(messageTemp)
          } else {
            message = item.message.replace(/ /g, '&nbsp;')
            messageForHtml = message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          }
          let isAudioLoading = false
          let isShowToAudioBtn = true
          if (
            (isIncludeCode ||
              item.audioUrlCdn ||
              item.nickname !== localStorage.getItem('nickname')) &&
            !localStorage.getItem('nickname').includes('徐同保')
          ) {
            isShowToAudioBtn = false
          }
          return {
            ...item,
            message,
            messageForHtml,
            isAudioLoading,
            isShowToAudioBtn,
          }
        })
        if (isGetNewest === true) {
          if (Array.isArray(list) && list.length > 0) {
            let mergeList = [...state.dataSource, ...list]
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
      }
    })
  }

  const handleToAudio = (item) => {
    const { uid } = item
    let { dataSource, pageSize } = state
    const resultIndex = dataSource.findIndex((item) => item.uid === uid)
    if (resultIndex >= 0) {
      dataSource[resultIndex].isAudioLoading = true
      setState({
        dataSource,
        pageSize,
      })
      let talkId = localStorage.getItem('talkId')
      Api.h5.chatAddAudio({ uid, talkId }).then((res) => {
        if (res.code === 200) {
          const { audioUrlCdn, isCutMessage } = res.data
          dataSource[resultIndex] = {
            ...dataSource[resultIndex],
            audioUrlCdn,
            isAudioLoading: false,
            isShowToAudioBtn: false,
          }

          console.log('dataSource', dataSource)
          if (isCutMessage) {
            antdMessage.warning('超出部分已自动截断')
          }
          setState({
            dataSource,
            pageSize,
          })
        }
      })
    }
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
      let modelType = localStorage.getItem('modelType')
        ? localStorage.getItem('modelType')
        : '1'
      let promptType = localStorage.getItem('promptType')
        ? localStorage.getItem('promptType')
        : '1'

      setIsSending(true)
      Api.h5
        .chatAdd({
          message,
          talkId,
          modelType,
          promptType,
          isNeedContext,
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
                handleSend({ isNeedContext: false })
              } else {
                antdMessage.warning(res.message)
                setIsSending(false)
                count = 0
              }
            } else {
              handleSearch({ isGetNewest: true })
              count = 0
              setIsSending(false)
              setMessage('')
            }
          } else if (res.code === 500) {
            setIsSending(false)
          } else if (res.code === 40001) {
            setIsSending(false)
            props.history.push(`/ai/exchange`)
          }
        })
    }
  }

  const handleCtrlEnter = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      console.log('触发')
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
        props.history.push('/h5/login')
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')
      }
    })
  }

  //跳转
  const handleJumpPage = (path) => {
    props.history.push(path)
  }

  const handleScroll = (scrollValues) => {
    // eslint-disable-next-line
    let { scrollTop, clientHeight, scrollHeight } = scrollValues
    //console.log(scrollTop, clientHeight, scrollHeight )
    if (scrollTop < 200) {
      if (isLoadingForSearch === false && current > 0) {
        showLoading()
        // console.log('触发', scrollTop, clientHeight, scrollHeight)
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
      antdMessage.success('复制信息成功')
    })
  }

  const getMessageToolbar = (item) => {
    return (
      <div>
        <div
          className="m-group-chat-toolbar-item"
          onClick={() => handleCopy(item.message)}
        >
          <Icon
            name="copy"
            title="复制"
            className="m-group-chat-copy-icon"
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
    } else if (type === 'invisible') {
      props.history.push(`/ai/single/me/invisible`)
    } else if (type === 'contactUs') {
      props.history.push(`/ai/contactUs`)
    } else if (type === 'quit') {
      props.history.push(`/ai/login`)
    }
  }

  useEffect(() => {
    let dataSource = state.dataSource

    if (isGetNewest) {
      if (Array.isArray(dataSource) && dataSource.length > 0) {
        setTimeout(() => {
          const current = scrollEl.current
          current.scrollToBottom()
        }, 100)
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
        isLoadingForSearch = false
        if (scrollEl.current) {
          const current = scrollEl.current
          let { scrollHeight } = current.scrollValues
          let toTop = scrollHeight - toBottom
          current.scrollTo(undefined, toTop)
          clearTimeout(timer2)

          timer2 = setTimeout(() => {
            current.scrollTo(undefined, toTop)
          }, 200)
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
          console.log('click')

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
    handleSearch,
    handleSend,
    handleCtrlEnter,
    handleQuit,
    handleJumpPage,
    handleInputChange,
    handleScroll,
    handleAction,
    getMessageToolbar,
    handleToAudio,
  }
}
