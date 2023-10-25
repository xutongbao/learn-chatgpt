import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'

export default function useList(props) {
  const [total, setTotal] = useState(10)
  const [current, setCurrent] = useState(1)
  let tempCount = Math.floor((window.innerWidth - 10) / 180)
  tempCount = Math.floor((window.innerWidth - (5 + tempCount * 5)) / 180)

  console.log('tempCount1', tempCount)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: tempCount * 10,
  })
  const [isHasMore, setIsHasMore] = useState(true)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})
  // eslint-disable-next-line
  const [columnCount, setColumnCount] = useState(tempCount)

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: tempCount * 10,
      })
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.sdImgSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data
        let list = res.data.list
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

  const handleImgDrawSameStyleClick = (item) => {
    console.log(item)
    props.history.push(
      `/single/home/sdSimple?modelId=${item.id}&name=${item.name}&link=${item.link}&imgUid=${item.imgUid}`
    )
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
    columnCount,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleSearch,
    handleImgDrawSameStyleClick,
  }
}
