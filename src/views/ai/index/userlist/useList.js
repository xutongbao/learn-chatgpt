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


  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 30,
      })
      setPlayerList([])
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.userUserlist(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data

        let list = res.data.list
        list = list.map(item => {
          let { avatarCdn } = item
          if (avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
            avatarCdn = 'http://static.xutongbao.top/img/m-default-avatar.jpg'
          }
          return {
            ...item,
            avatarCdn
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

  //详情
  const handleDetail = ({ lessonUid, urlCnd }) => {
    props.history.push(
      `/h5/single/play?lessonUid=${lessonUid}&urlCnd=${urlCnd}`
    )
  }

  const formatLessonTime = (text) => {
    const resultTime = text.split(':')
    if (resultTime[0] === '00') {
      return text.slice(3)
    } else {
      return text
    }
  }

  //关注
  const handleFollow = (item) => {
    Api.h5
      .behaviorFollowAction({
        courseUserIds: [item.uid],
        isFollow: !item.isFollow
      })
      .then((res) => {
        if (res.code === 200) {
          let { dataSource, pageSize } = state
          let resultIndex = dataSource.findIndex(
            (dataSourceItem) => dataSourceItem.uid === item.uid
          )
          if (resultIndex >= 0) {
            if (dataSource[resultIndex].isFollow) {
              dataSource[resultIndex].isFollow = false
              dataSource[resultIndex].followCount =
                dataSource[resultIndex].followCount - 1
            } else {
              dataSource[resultIndex].isFollow = true
              dataSource[resultIndex].followCount =
                dataSource[resultIndex].followCount + 1
            }
            setState({
              dataSource: dataSource,
              pageSize: pageSize,
            })
          }
        }
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
    setVisible,
    handleSearch,
    handleDetail,
    formatLessonTime,
    handleFollow,
    handleAvatarClick,
    handleImageClick,
  }
}
