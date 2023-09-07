import { useState, useEffect } from 'react'
import Api from '../../../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'

export default function useList(props) {
  const [total, setTotal] = useState(10)
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [isLoading, setIsLoadinng] = useState(true)

  const [isHasMore, setIsHasMore] = useState(true)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 10,
      })
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.fileAppSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data

        let list = res.data.list
        list = list.map((item) => {
          let fileType = 'file'
          let urlCdn = item.urlCdn
          if (urlCdn.includes('.pdf')) {
            fileType = 'pdf'
          } else if (urlCdn.includes('.mp4') || urlCdn.includes('.avi')) {
            fileType = 'video1'
          } else if (urlCdn.includes('.mp3') || urlCdn.includes('.wav')) {
            fileType = 'music2'
          } else if (
            urlCdn.includes('.jpg') ||
            urlCdn.includes('.png') ||
            urlCdn.includes('.jpeg')
          ) {
            fileType = 'image'
          }
          return {
            ...item,
            fileType,
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
        setIsLoadinng(false)
      }
    })
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
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    isHasMore,
    isLoading,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleSearch,
  }
}
