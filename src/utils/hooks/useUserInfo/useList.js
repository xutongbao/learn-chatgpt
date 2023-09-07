import { useState } from 'react'
import Api from '../../../api'

export default function useList(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [item, setItem] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleAvatarClick = (e) => {
    e.stopPropagation()
  }

  const handleSendMessage = () => {
    Api.h5.realTalkAdd({ userIds: [item.uid] }).then((res) => {
      if (res.code === 200) {
        let realTalkId = res.data.realTalkId
        let name = userInfo.nickname
        window.reactRouter.push(
          `/single/home/realChat?realTalkId=${realTalkId}&name=${name}&friendUserId=${userInfo.uid}`
        )
      }
    })
  }

  const showModel = (item) => {
    setIsModalVisible(true)
    setItem(item)
    setIsLoading(true)
    Api.h5.userGetUserInfoById({ uid: item.uid }).then((res) => {
      if (res.code === 200) {
        let userInfo = res.data
        setUserInfo(userInfo)
      } else {
        setUserInfo({ isVipStatus: false })
      }
      setIsLoading(false)
    })
  }

  return {
    isModalVisible,
    userInfo,
    item,
    isLoading,
    setIsModalVisible,
    handleJumpPage,
    handleAvatarClick,
    handleSendMessage,
    showModel,
  }
}
