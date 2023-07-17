import { useState, useEffect } from 'react'
import Api from '../../../../../api'
import moment from 'moment'

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
    dataSource: [
      {
        uid: 0,
        avatar: 'http://static.xutongbao.top/img/m-gpt-3_5-logo.png',
        name: 'ChatGPT',
        intro: '',
        createTime: '',
      },
      {
        uid: 1,
        avatar: 'http://static.xutongbao.top/img/m-gpt-4-logo.png',
        name: 'GPT-4',
        intro: '',
        createTime: '',
      },
      {
        uid: 2,
        avatar: 'http://static.xutongbao.top/img/logo.png',
        name: '群聊',
        intro: '',
        createTime: '',
      },
      {
        uid: 3,
        avatar:
          'http://static.xutongbao.top/img/m-real-people-group-chat2.png?time=20230302',
        name: '真人群聊',
        intro: '',
        createTime: '',
      },
      {
        uid: 4,
        avatar: 'http://static.xutongbao.top/img/m-course.png?time=2023040401',
        name: '课程',
        intro: '学而不思则罔',
        createTime: '',
      },
      {
        uid: 5,
        avatar: 'http://static.xutongbao.top/img/m-words.png',
        name: '识字',
        intro: '幼儿园起步',
        createTime: '',
      },
      {
        uid: 6,
        avatar: 'http://static.xutongbao.top/img/m-google.png',
        name: 'Google',
        intro: '通过api接口实现',
        createTime: '',
      },
      {
        uid: 7,
        avatar: 'http://static.xutongbao.top/img/m-file.png',
        name: '我的文件',
        intro: '私密存储',
        createTime: '',
      },
    ],
    pageSize: 10,
  })

  //搜索
  const handleSearch = () => {
    let username = localStorage.getItem('username')
    let isAll = false
    if (username === 'admin' || username === '1183391880') {
      isAll = true
    }
    let routerSearchObjNew = { talkId: localStorage.getItem('talkId'), isAll }

    const searchParams = {
      ...routerSearchObjNew,
    }

    Api.h5.chatListSearch(searchParams).then((res) => {
      if (res.code === 200) {
        let { chatInfo, chatInfoForGPT4, groupChatInfo, realPeopleInfo } =
          res.data
        const { dataSource } = state
        if (chatInfo.createTime) {
          dataSource[0].createTime = moment(chatInfo.createTime - 0).format(
            'MM-DD HH:mm:ss'
          )
          dataSource[0].intro = chatInfo.message
        }
        if (chatInfoForGPT4.createTime) {
          dataSource[1].createTime = moment(
            chatInfoForGPT4.createTime - 0
          ).format('MM-DD HH:mm:ss')
          dataSource[1].intro = chatInfoForGPT4.message
        }
        if (groupChatInfo.createTime) {
          dataSource[2].createTime = moment(
            groupChatInfo.createTime - 0
          ).format('MM-DD HH:mm:ss')
          dataSource[2].intro = groupChatInfo.message
        }
        if (realPeopleInfo.createTime) {
          dataSource[3].createTime = moment(
            realPeopleInfo.createTime - 0
          ).format('MM-DD HH:mm:ss')
          dataSource[3].intro = realPeopleInfo.message
        }
        setState({
          dataSource,
          pageSize: 10,
        })
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

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  const handleImageClick = (e, item) => {
    setCurrentImage(item.avatar)
    //setVisible(true)
    //e.stopPropagation()
  }

  //操作
  const handleAction = ({ uid }) => {
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
    }
  }

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line
  }, [])

  return {
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    currentImage,
    visible,
    handleSearch,
    handleDetail,
    formatLessonTime,
    handleAction,
    handleImageClick,
    handleAvatarClick,
    setVisible,
  }
}
