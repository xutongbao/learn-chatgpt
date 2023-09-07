import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'

export default function useList(props) {
  const [total, setTotal] = useState(10)
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 100,
  })
  const [isHasMore, setIsHasMore] = useState(true)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 100,
      })
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.wordsAppSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data

        let list = res.data.list
        list = list.map((item) => {
          let { avatarCdn } = item
          if (avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
            avatarCdn = 'http://static.xutongbao.top/img/m-default-avatar.jpg'
          }
          return {
            ...item,
            avatarCdn,
            pageNum,
          }
        })
        if (isRefresh) {
          setState({
            dataSource: [...list],
            pageSize: res.data.pageSize,
          })
        } else {
          setState({
            dataSource: [...state.dataSource, ...list],
            pageSize: res.data.pageSize,
          })
        }
        setTotal(res.data.total)
        const currentTemp = res.data.pageNum + 1
        setCurrent(currentTemp)
        setIsHasMore(pageNum < Math.ceil(total / pageSize))
      }
    })
  }

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    Api.h5.exchangeCodeAppUse(values).then((res) => {
      if (res.code === 200) {
        message.success('恭喜您，兑换成功')
        //props.history.push('/h5/index/me')
      }
    })
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
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
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleCopy = (text) => {
    clipboard.writeText(text).then(() => {
      message.success('复制成功')
    })
  }

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        handleSearch()
      }
    } else {
      handleSearch()
    }
    // eslint-disable-next-line
  }, [props.isRNGotToken])

  return {
    username,
    form,
    initValues,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    isHasMore,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleSearch,
  }
}
