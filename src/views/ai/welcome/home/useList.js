import { useState, useEffect } from 'react'
import Api from '../../../../api'
import { getRouterSearchObj } from '../../../../utils/tools'

export default function useList(props) {
  const [config, setConfig] = useState({})
  const [models, setModels] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [imgList, setImgList] = useState([])

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  const handleGetConfig = () => {
    Api.h5.configWelcome().then((res) => {
      if (res.code === 200) {
        setConfig(res.data.config)
        let models = res.data.config.models
        if (Array.isArray(models)) {
          let tempModels = []
          for (let i = 0; i < models.length; i = i + 3) {
            tempModels = [
              ...tempModels,
              { first: models[i], second: models[i + 1], third: models[i + 2] },
            ]
          }
          setModels(tempModels)
        }
      }
    })
  }

  const handleImgSearch = () => {
    Api.h5
      .sdImgSearch({
        pageNum: 1,
        pageSize: 40,
      })
      .then((res) => {
        if (res.code === 200) {
          let list = res.data.list
          if (Array.isArray(list)) {
            let tempModels = []
            for (let i = 0; i < list.length; i = i + 2) {
              tempModels = [
                ...tempModels,
                {
                  first: list[i],
                  second: list[i + 1],
                  // third: list[i + 2],
                  // fourth: list[i + 3],
                },
              ]
            }
            setImgList(tempModels)
          }
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

  const handleImgDrawSameStyleClick = (item) => {
    console.log(item)
    props.history.push(
      `/single/home/sdSimple?modelId=${item.id}&name=${item.name}&link=${item.link}&imgUid=${item.imgUid}`
    )
  }

  useEffect(() => {
    handleGetConfig()
    getUserInfo()
    handleImgSearch()
    // eslint-disable-next-line
  }, [])

  return {
    config,
    models,
    userInfo,
    routerSearchObj,
    imgList,
    handleJumpPage,
    handleTagClick,
    handleModelClick,
    handleImgDrawSameStyleClick,
  }
}
