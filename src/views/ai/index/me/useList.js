import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import Api from '../../../../api'

const { confirm } = Modal

export default function useList(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({})
  // eslint-disable-next-line
  const [followCount, setFollowCount] = useState()
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  // eslint-disable-next-line
  const [nickname, setNickname] = useState(localStorage.getItem('nickname'))
  const [groupButton1, setGroupButton1] = useState([])

  //退出
  const handleQuit = () => {
    Api.light.userLogout().then((res) => {
      if (res.code === 200) {
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('nickname')
        window.localStorage.removeItem('token')
        localStorage.removeItem('token')
        localStorage.removeItem('talkId')
        props.history.push(`/ai/login`)
      }
    })
  }

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    Api.h5.configGetMeData().then((res) => {
      if (res.code === 200) {
        setGroupButton1(res.data.me.groupButton2)
        setIsLoading(false)
      }
    })
    Api.h5.userGetInfo({ isLoading: false }).then((res) => {
      if (res.code === 200) {
        let userInfo = res.data
        if (userInfo.avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
          userInfo.avatarCdn =
            'http://static.xutongbao.top/img/m-default-avatar.jpg'
        }
        setUserInfo(userInfo)
        setNickname(res.data.nickname)
        localStorage.setItem('uid', res.data.uid)

        let groupCodeHistory = localStorage.getItem('groupCode')
        const { payStatus } = userInfo
        if (payStatus !== '2' && groupCodeHistory !== '672913') {
          let historyAddMsgTime = localStorage.getItem('addGroupMsgTime')
          let now = Date.now()

          if (historyAddMsgTime) {
            if (now - historyAddMsgTime > 1000 * 60 * 60) {
              // 继续
            } else {
              return
            }
          } else {
            // 继续
          }
          if (username.includes('G-')) {
            return
          }
          confirm({
            title: '推荐加入微信群获得更多提问次数',
            onOk() {
              props.history.push('/ai/single/me/joinGroup')
            },
          })
          let addGroupMsgTime = Date.now()
          localStorage.setItem('addGroupMsgTime', addGroupMsgTime)
        }
      } else {
        setUserInfo({ isVipStatus: false })
      }
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // if (username.includes('G-')) {
    //   confirm({
    //     title: '推荐游客观看本页的【视频教程】',
    //     onOk() {
    //       props.history.push('/ai/single/me/videoQuestion')
    //     },
    //   })
    // }
    // eslint-disable-next-line
  }, [])

  return {
    isLoading,
    userInfo,
    username,
    nickname,
    groupButton1,
    followCount,
    handleQuit,
    handleJumpPage,
    handleAvatarClick,
  }
}
