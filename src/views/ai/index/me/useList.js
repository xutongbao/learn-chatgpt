import { useState, useEffect } from 'react'
import Api from '../../../../api'

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
        props.history.push(`/welcome/home`)
      }
    })
  }

  const handleSendMessage = () => {
    let friendUserId = '41f2e0a3-d136-41fd-ba95-918ee510b8e6'
    Api.h5.realTalkAdd({ userIds: [friendUserId] }).then((res) => {
      if (res.code === 200) {
        let realTalkId = res.data.realTalkId
        window.reactRouter.push(
          `/single/home/realChat?realTalkId=${realTalkId}&name=徐同保&friendUserId=${friendUserId}`
        )
      }
    })
  }

  //跳转
  const handleJumpPage = (path) => {
    if (path === '/ai/single/me/customerService') {
      console.log('人工客服')
      handleSendMessage()
    } else {
      props.history.push(path)
    }
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
      } else {
        setUserInfo({ isVipStatus: false })
      }
    })
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
