import { useState, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import Api from '../../../api'
import { objArrayUnique, showLoading, hideLoading } from '../../../utils/tools'
import * as clipboard from 'clipboard-polyfill/text'
import { Icon } from '../../../components/light'

let count = 0
let isLoadingForSearch = false
let timer, timer2
let toBottom = 0

export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [total, setTotal] = useState()
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 20,
  })
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isGetNewest, setIsGetNewest] = useState(false)
  const scrollEl = useRef(null)

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isGetNewest = false,
  } = {}) => {
    let searchData = {
      pageNum: page,
      pageSize,
      isGetNewest,
    }
    setIsGetNewest(isGetNewest)
    showLoading()
    Api.h5.chatSearchForRealPeople(searchData, false).then((res) => {
      if (res.code === 200) {
        let list = res.data.list.map((item) => {
          let message = item.message.replace(/ /g, '&nbsp;')
          if (item.userAvatarCdn === 'http://static.xutongbao.top/img/logo.png') {
            item.userAvatarCdn = 'http://static.xutongbao.top/img/m-default-avatar.jpg'
          }
          return {
            ...item,
            message,
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

  //发送
  const handleSend = () => {
    if (message === '' || message.trim() === '') {
      antdMessage.warning('请输入内容')
      return
    }
    let talkId = localStorage.getItem('talkId')
    if (talkId === 'guest') {
      antdMessage.warning('游客仅可以在群聊中看别人提问，请注册账号')
    } else {
      setIsSending(true)
      Api.h5
        .chatAddForRealPeople({
          message,
          talkId,
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
  const handleJumpPage = (item) => {
    // eslint-disable-next-line
    if (item.messageType === '1') {
      props.history.push(`/ai/editUserInfo`)
    } else if (item.messageType === '2') {
      props.history.push(`/ai/editRobot`)
    }
  }

  const handleScroll = (scrollValues) => {
    // eslint-disable-next-line
    let { scrollTop, clientHeight, scrollHeight } = scrollValues
    //console.log(scrollTop, clientHeight, scrollHeight )
    if (scrollTop < 100) {
      if (isLoadingForSearch === false && current > 0) {
        showLoading()
        //console.log('触发', scrollTop, clientHeight, scrollHeight)
        isLoadingForSearch = true
        //console.log('滚动触发查询')
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
    } else if (type === 'editRobot') {
      props.history.push(`/ai/editRobot`)
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
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        handleSearch({ isGetNewest: true })
      }
    } else {
      handleSearch({ isGetNewest: true })
    }
    // eslint-disable-next-line
  }, [props.isRNGotToken])

  return {
    username,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    message,
    isSending,
    scrollEl,
    handleSearch,
    handleSend,
    handleQuit,
    handleJumpPage,
    handleInputChange,
    handleScroll,
    handleAction,
    getMessageToolbar,
  }
}
