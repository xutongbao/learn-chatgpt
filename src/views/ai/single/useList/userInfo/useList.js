import { useState, useEffect } from 'react'
import Api from '../../../../../api'
import { getRouterSearchObj } from '../../../../../utils/tools'

export default function useList(props) {
  const [userInfo, setUserInfo] = useState({})

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  const handleSendMessage = () => {
    console.log(11)
  }

  useEffect(() => {
    //获取路由参数
    const routerSearchObj = getRouterSearchObj(props)
    Api.h5.userGetUserInfoById({ uid: routerSearchObj.uid }).then((res) => {
      if (res.code === 200) {
        let userInfo = res.data
        setUserInfo(userInfo)
      } else {
        setUserInfo({ isVipStatus: false })
      }
    })
    // eslint-disable-next-line
  }, [])

  return {
    userInfo,
    handleJumpPage,
    handleAvatarClick,
    handleSendMessage,
  }
}
