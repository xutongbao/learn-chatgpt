import { useState, useEffect } from 'react'
import Api from '../../../../api'

export default function useList(props) {
  const [total, setTotal] = useState(10)
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 30,
  })
  const [playerList, setPlayerList] = useState([])
  const [isHasMore, setIsHasMore] = useState(true)
  const [currentImage, setCurrentImage] = useState()
  const [visible, setVisible] = useState(false)
  const [searchNickname, setSearchNickname] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
    searchNicknameCurrent,
  } = {}) => {
    setIsLoading(true)
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 30,
      })
      setPlayerList([])
    }
    let nickname =
      typeof searchNicknameCurrent === 'string'
        ? searchNicknameCurrent
        : searchNickname
    setSearchNickname(nickname)
    let searchHistoryLocalStorage = localStorage.getItem('searchHistory')
      ? localStorage.getItem('searchHistory')
      : []
    try {
      searchHistoryLocalStorage = Array.isArray(searchHistoryLocalStorage)
        ? searchHistoryLocalStorage
        : JSON.parse(searchHistoryLocalStorage)
    } catch (error) {
      console.log(error)
    }
    if (Array.isArray(searchHistoryLocalStorage)) {
      searchHistoryLocalStorage.push({
        label: nickname,
        value: nickname,
        createTime: Date.now(),
      })
      let map = new Map()
      searchHistoryLocalStorage
        .filter((item) => item.value.trim() !== '')
        .filter((item) => item.createTime)
        .sort((a, b) => b.createTime - a.createTime)
        .slice(0, 20)
        .forEach((item) => {
          map.set(item.value, item)
        })
      searchHistoryLocalStorage = [...map.values()]
      setSearchHistory(searchHistoryLocalStorage)
      localStorage.setItem(
        'searchHistory',
        JSON.stringify(searchHistoryLocalStorage)
      )
    }

    let searchData = { pageNum: page, pageSize, nickname }
    Api.h5
      .userUserlist(searchData)
      .then((res) => {
        setIsLoading(false)
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
      .catch(() => {
        setIsLoading(false)
      })
  }

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  const handleImageClick = (e, item) => {
    setCurrentImage(item.avatarCdn)
    setVisible(true)
    e.stopPropagation()
  }

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleSearchNicknameChange = (e) => {
    setSearchNickname(e.target.value)
  }

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let playListTemp = []
    state.dataSource.forEach((item, index) => {
      const resultIndex = playerList.findIndex((item) => item.index === index)
      if (resultIndex < 0) {
      }
    })
    setPlayerList([...playerList, ...playListTemp])
    // eslint-disable-next-line
  }, [state.dataSource])

  return {
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    isHasMore,
    currentImage,
    visible,
    searchNickname,
    searchHistory,
    isLoading,
    setVisible,
    handleSearch,
    handleAvatarClick,
    handleImageClick,
    handleJumpPage,
    handleSearchNicknameChange,
  }
}
