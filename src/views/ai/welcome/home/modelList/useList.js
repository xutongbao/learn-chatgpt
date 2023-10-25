import { useState, useEffect } from 'react'
import Api from '../../../../../api'
import { getRouterSearchObj } from '../../../../../utils/tools'

export default function useList(props) {
  const [config, setConfig] = useState({})
  const [models, setModels] = useState([])
  const [userInfo, setUserInfo] = useState({})

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  const handleGetConfig = () => {
    Api.h5.configWelcome().then((res) => {
      if (res.code === 200) {
        setConfig(res.data.config)
        let models = res.data.config.models
        setModels(models)
      }
    })
  }

  const getUserInfo = () => {
    let token = localStorage.getItem('token')
    if (token) {
      Api.h5.userGetInfo({ isLoading: false }).then((res) => {
        if (res.code === 200) {
          setUserInfo(res.data)
        } else {
        }
      })
    }
  }

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleTagClick = () => {
    if (userInfo.avatarCdn) {
      props.history.push('/ai/index/home/chatList')
    } else {
      props.history.push('/ai/login')
    }
  }

  const handleModelClick = (item) => {
    props.history.push(
      `/single/home/sdSimple?modelId=${item.id}&name=${item.name}&link=${item.link}`
    )
  }

  useEffect(() => {
    handleGetConfig()
    getUserInfo()
    // eslint-disable-next-line
  }, [])

  return {
    config,
    models,
    userInfo,
    routerSearchObj,
    handleJumpPage,
    handleTagClick,
    handleModelClick,
  }
}
