import { useState, useEffect } from 'react'
import Api from '../../../../../api'
import { handleWatchChatUpdate } from '../../../../../api/socket'

let chatListTemp = []
export default function useList(props) {
  // eslint-disable-next-line
  const [total, setTotal] = useState(10)
  const currentInit = localStorage.getItem('current')
    ? localStorage.getItem('current') - 0
    : 1
  // eslint-disable-next-line
  const [current, setCurrent] = useState(currentInit)
  const [currentImage, setCurrentImage] = useState()
  const [visible, setVisible] = useState(false)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 20,
  })
  const [isHasMore, setIsHasMore] = useState(true)

  //搜索
  const handleSearch = async ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 20,
      })
    }
    let searchData = {
      pageNum: page,
      pageSize,
    }
    await Api.h5.realTalkAppSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data

        let list = res.data.list

        if (isRefresh) {
          chatListTemp = list
          setState({
            dataSource: [...list],
            pageSize: res.data.pageSize,
          })
        } else {
          chatListTemp = [...state.dataSource, ...list]
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

    let username = localStorage.getItem('username')
    let isAll = false
    if (username === 'admin' || username === '1183391880@qq.com') {
      isAll = true
    }
    let routerSearchObjNew = { talkId: localStorage.getItem('talkId'), isAll }

    const searchParams = {
      ...routerSearchObjNew,
    }

    if (page === 1) {
      Api.h5.chatListSearch(searchParams).then((res) => {
        if (res.code === 200) {
          let {
            chatInfo,
            chatInfoForGPT4,
            groupChatInfo,
            realPeopleInfo,
            sdSingleUserInfo,
            sdGroupInfo,
          } = res.data
          if (chatInfo.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 0)
            chatListTemp[resultIndex].createTime = chatInfo.createTime
            chatListTemp[resultIndex].intro = chatInfo.message
          }
          if (chatInfoForGPT4.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 1)
            chatListTemp[resultIndex].createTime = chatInfoForGPT4.createTime
            chatListTemp[resultIndex].intro = chatInfoForGPT4.message
          }
          if (groupChatInfo.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 2)

            chatListTemp[resultIndex].createTime = groupChatInfo.createTime
            chatListTemp[resultIndex].intro = groupChatInfo.message
          }
          if (realPeopleInfo.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 3)
            chatListTemp[resultIndex].createTime = realPeopleInfo.createTime
            chatListTemp[resultIndex].intro = realPeopleInfo.message
          }
          if (sdSingleUserInfo.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 8)
            chatListTemp[resultIndex].createTime = sdSingleUserInfo.createTime
            chatListTemp[resultIndex].intro = sdSingleUserInfo.message
          }
          if (sdGroupInfo.createTime) {
            let resultIndex = chatListTemp.findIndex((item) => item.uid === 9)
            chatListTemp[resultIndex].createTime = sdGroupInfo.createTime
            chatListTemp[resultIndex].intro = sdGroupInfo.message
          }
          setState({
            dataSource: chatListTemp,
            pageSize: 20,
          })
        }
      })
    }
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

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  const handleImageClick = (e, item) => {
    setCurrentImage(item.avatar)
    //setVisible(true)
    //e.stopPropagation()
  }

  //操作
  const handleAction = ({ uid, chatListItemType, name, users }) => {
    if (chatListItemType === '1') {
      if (uid === 0) {
        props.history.push(`/ai/chat`)
      } else if (uid === 1) {
        props.history.push(`/ai/chat-gpt-4`)
      } else if (uid === 2) {
        props.history.push(`/ai/groupChat`)
      } else if (uid === 3) {
        props.history.push(`/ai/realPeopleGroupChat`)
      } else if (uid === 4) {
        props.history.push(`/ai/course`)
      } else if (uid === 5) {
        props.history.push(`/ai/words`)
      } else if (uid === 6) {
        props.history.push(`/single/home/google`)
      } else if (uid === 7) {
        props.history.push(`/single/home/fileList`)
      } else if (uid === 8) {
        props.history.push(`/single/home/sd?type=1`)
      } else if (uid === 9) {
        props.history.push(`/single/home/sd?type=2`)
      } else if (uid === 10) {
        props.history.push(`/welcome/home?type=2`)
      }
    } else if (chatListItemType === '2') {
      name = encodeURIComponent(name)
      let ownerUser = users.find((item) => item.isOwner === '1')
      let friendUser = users.find((item) => item.isOwner === '0')
      let friendUserId
      if (friendUser) {
        friendUserId = friendUser.uid
      } else if (ownerUser) {
        friendUserId = ownerUser.uid
      }
      props.history.push(
        `/single/home/realChat?realTalkId=${uid}&name=${name}&friendUserId=${friendUserId}`
      )
    }
  }

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    handleWatchChatUpdate({
      callback: () => {
        if (document.location.href.includes('/ai/index/home/chatList')) {
          handleSearch()
        }
      },
    })
    // eslint-disable-next-line
  }, [])

  return {
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    currentImage,
    visible,
    isHasMore,
    handleSearch,
    handleDetail,
    formatLessonTime,
    handleAction,
    handleImageClick,
    handleAvatarClick,
    setVisible,
  }
}
