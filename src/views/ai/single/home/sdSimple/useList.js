import { useState, useEffect, useRef } from 'react'
import Api from '../../../../../api'
import { getRouterSearchObj, objArrayUnique } from '../../../../../utils/tools'
import { message as antdMessage } from 'antd'

let upscaleDataSourceIndex
let upscaleResultImgIndex
let upscaleOriginalUrl

export default function useList(props) {
  const [userInfo, setUserInfo] = useState({})
  const [modelImgList, setModelImgList] = useState([])
  const [slidesPerView, setSlidesPerView] = useState(1.1)
  const [previewCurrent, setPreviewCurrent] = useState(0)
  const [total, setTotal] = useState()
  const [current, setCurrent] = useState(1)
  const [isHasMore, setIsHasMore] = useState(true)
  const [isUpscaleLoading, setIsUpscaleLoading] = useState(false)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isOnlySeeMe, setIsOnlySeeMe] = useState(
    localStorage.getItem('isOnlySeeMe') === '0' ? false : true
  )

  const swiperEl = useRef(null)

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  //搜索
  const handleSearch = async ({
    page = current,
    pageSize = state.pageSize,
    callback,
    isOnlySeeMeParam = isOnlySeeMe,
  } = {}) => {
    let token = localStorage.getItem('token')
    if (token) {
      let searchData = {
        pageNum: page,
        pageSize,
        isGroup: isOnlySeeMeParam === false ? true : false,
      }

      setIsLoading(true)
      Api.h5.sdSearchForSimpleSd(searchData).then((res) => {
        setIsLoading(false)
        if (res.code === 200) {
          const { pageNum, pageSize, total } = res.data
          let list = res.data.list.map((item) => {
            let pictureList = []
            if (
              Array.isArray(item?.info?.cdnPictureList) &&
              item?.info?.cdnPictureList.length > 0
            ) {
              pictureList = item?.info?.cdnPictureList
            } else if (Array.isArray(item?.info?.response?.output)) {
              pictureList = item?.info?.response?.output
            }

            let message
            if (item.info.originalPrompt) {
              message = item.info.originalPrompt
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
            } else {
              message = item.info.prompt
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
            }

            return {
              ...item,
              message,
              pictureList,
            }
          })
          let mergeList = [...state.dataSource, ...list]
          mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
          if (Array.isArray(mergeList) && mergeList.length > 0) {
            setState({
              dataSource: mergeList,
              pageSize: res.data.pageSize,
            })
          }

          setTotal(res.data.total)
          const currentTemp = res.data.pageNum + 1
          setCurrent(currentTemp)
          setIsHasMore(pageNum < Math.ceil(total / pageSize))
          callback && callback({ mergeList })
        }
      })
    }
  }

  //发送
  const handleSend = async (values, callback) => {
    let message = values.prompt
    if (message === '' || message.trim() === '') {
      antdMessage.warning('请输入提示词！')
      return
    }

    let isNeedTranslate = false
    let zhCNReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')

    if (message.length < 10) {
      antdMessage.warning('提示词太短！')
      return
    } else if (message && zhCNReg.test(message)) {
      // antdMessage.warning('只能输入英文！')
      // return
      isNeedTranslate = true
    }

    let sdHistoryParamsSinkin = localStorage.getItem('sdHistoryParamsSinkin')
    let sdHistoryParamsObj = {}
    try {
      if (sdHistoryParamsSinkin) {
        sdHistoryParamsObj = JSON.parse(sdHistoryParamsSinkin)
      }
    } catch (error) {
      console.log(error)
    }
    delete sdHistoryParamsObj.prompt
    let info = { ...sdHistoryParamsObj, prompt: message }

    setIsSending(true)
    let groupCode = localStorage.getItem('groupCode')

    let { uid, avatarCdn, nickname } = userInfo

    let tempMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;')

    let now = Date.now()
    let temp = {
      uid: Date.now(),
      isTest: '1',
      message: tempMessage,
      pictureList: [],
      info,
      user: {
        uid,
        avatarCdn,
        nickname,
      },
      isAudioLoading: false,
      isShowToAudioBtn: false,
      isOpenPopover: false,
      createTime: now,
    }
    let mergeList = [temp, ...state.dataSource]
    mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
    if (Array.isArray(mergeList) && mergeList.length > 0) {
      setState({
        dataSource: mergeList,
        pageSize: state.pageSize,
      })
    }

    Api.h5.sdAdd({ info, groupCode, isNeedTranslate }).then((res) => {
      if (res.code === 200) {
        callback && callback({ isNeedClear: true })

        let groupCode = localStorage.getItem('groupCode')

        if (res.data.code === 40004) {
          antdMessage.warning(res.message) //超出总上限
          if (groupCode === '672913') {
            props.dialogShow({ type: 'exchange' })
          } else {
            props.dialogShow({ type: 'joinGroup' })
          }
        } else if (res.data.code === 40005) {
          antdMessage.warning(res.message) //超出今日上限
          if (groupCode === '672913') {
            props.dialogShow({ type: 'exchange' })
          } else {
            props.dialogShow({ type: 'joinGroup' })
          }
        } else {
          antdMessage.success('添加成功')

          let pictureList = res.data.response?.output
            ? res.data.response?.output
            : []
          let response = res.data.response

          let temp = {
            uid: res.data.sdId,
            isTest: '1',
            message: tempMessage,
            pictureList,
            info: {
              ...info,
              response,
            },
            user: {
              uid,
              avatarCdn,
              nickname,
            },
            isAudioLoading: false,
            isShowToAudioBtn: false,
            isOpenPopover: false,
            createTime: now,
          }
          let mergeList = [...state.dataSource].filter(
            (item) => item.isTest !== '1'
          )
          mergeList = [temp, ...mergeList]
          mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
          if (Array.isArray(mergeList) && mergeList.length > 0) {
            setState({
              dataSource: mergeList,
              pageSize: state.pageSize,
            })
          }
          //handleSearch({ isGetNewest: true, page: 1 })
          Api.h5.sdUploadPicture({ uid: res.data.sdId }).then((res) => {
            if (res.code === 200) {
              antdMessage.success('上传图片到CDN成功')

              let temp = {
                uid: res.data.uid,
                message: tempMessage,
                pictureList: res.data.cdnPictureList
                  ? res.data.cdnPictureList
                  : [],
                info: {
                  ...info,
                  response,
                },
                user: {
                  uid,
                  avatarCdn,
                  nickname,
                },
                isAudioLoading: false,
                isShowToAudioBtn: false,
                isOpenPopover: false,
                createTime: now,
              }
              let mergeList = [...state.dataSource].filter(
                (item) => item.isTest !== '1'
              )
              mergeList = [temp, ...mergeList]
              mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
              setState({
                dataSource: mergeList,
                pageSize: state.pageSize,
              })
            }
          })
        }
      } else {
        callback && callback({ isNeedClear: false })
      }
      setIsSending(false)
    })
  }

  const handleGetImgList = () => {
    Api.h5
      .sdGetImgListByModelId({
        modelId: routerSearchObj.modelId,
      })
      .then((res) => {
        if (res.code === 200) {
          setModelImgList(res.data.result.images)
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

  const handleSetSlidesPerView = () => {
    //window.innerWidth
    if (window.innerWidth > 768) {
      setSlidesPerView(3.1)
    } else {
      setSlidesPerView(1.1)
    }
  }

  const handleClick = (item) => {
    console.log(item)
  }

  const handleImgClick = ({ pictureList, picItem }) => {
    let resultIndex = pictureList.findIndex(
      (item) => item.imgUrlCdn === picItem.imgUrlCdn
    )
    if (resultIndex >= 0) {
      setPreviewCurrent(resultIndex)
    } else {
      setPreviewCurrent(0)
    }
  }

  const handlePreviewChange = (current, prevCurrent) => {
    setPreviewCurrent(current)
  }

  const handleUpscale = ({
    item,
    pictureListItemIndex,
    index,
    resultIndex,
    originalUrl,
  }) => {
    setIsUpscaleLoading(true)
    Api.h5
      .sdUpscale({
        uid: item.uid,
        imgUrl: item?.info?.response?.output[pictureListItemIndex],
      })
      .then((res) => {
        if (res.code === 200) {
          antdMessage.success('成功')
          handleSearch({
            page: 1,
            callback: ({ mergeList }) => {
              handleUpscaleImgVisible({
                index: upscaleDataSourceIndex,
                resultIndex: upscaleResultImgIndex,
                event: { target: { checked: true } },
                originalUrl: upscaleOriginalUrl,
                mergeList,
              })
              setIsUpscaleLoading(false)
            },
          })
          upscaleDataSourceIndex = index
          upscaleResultImgIndex = resultIndex
          upscaleOriginalUrl = originalUrl
        } else {
          setIsUpscaleLoading(false)
        }
      })
  }

  const handleUpscaleImgVisible = ({
    index,
    resultIndex,
    event,
    originalUrl,
    mergeList,
  }) => {
    let dataSource = mergeList ? mergeList : state.dataSource
    let upscaleImgList = Array.isArray(dataSource[index].info?.upscaleImgList)
      ? dataSource[index].info?.upscaleImgList
      : []
    if (originalUrl) {
      resultIndex = upscaleImgList.findIndex(
        (item) => item.originalUrl === originalUrl
      )
    }
    upscaleImgList[resultIndex].checked = event.target.checked
    dataSource[index].info = { ...dataSource[index].info, upscaleImgList }
    setState({
      dataSource,
      pageSize: state.pageSize,
    })
  }

  const handleIsOnlySeeMeCheck = (event) => {
    setIsOnlySeeMe(event.target.checked)
    localStorage.setItem('isOnlySeeMe', event.target.checked ? '1' : '0')
    setCurrent(1)
    setState({
      dataSource: [],
      pageSize: state.pageSize,
    })
    handleSearch({
      page: 1,
      isOnlySeeMeParam: event.target.checked,
    })
  }

  useEffect(() => {
    handleGetImgList()
    getUserInfo()
    handleSetSlidesPerView()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (Array.isArray(modelImgList) && modelImgList.length > 1) {
      if (swiperEl.current) {
        console.log(typeof swiperEl.current.swiper.slideTo)
        if (typeof swiperEl.current.swiper.slideTo === 'function') {
          if (window.innerWidth > 768 && !routerSearchObj.imgUid) {
            swiperEl.current.swiper.slideTo(1)
          } else {
            let resultIndex = modelImgList.findIndex((item) =>
              item.imgUrlCdn.includes(routerSearchObj.imgUid)
            )
            if (resultIndex >= 0) {
              swiperEl.current.swiper.slideTo(resultIndex)
            }
          }
        }
      }
    }
  }, [modelImgList, routerSearchObj.imgUid])

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        handleSearch()
      }
    } else {
      handleSearch()
    }

    // eslint-disable-next-line
  }, [props.isRNGotToken])

  // useEffect(() => {
  //   if (
  //     typeof upscaleDataSourceIndex === 'number' &&
  //     typeof upscaleResultImgIndex === 'number'
  //   ) {
  //     handleUpscaleImgVisible({
  //       index: upscaleDataSourceIndex,
  //       resultIndex: upscaleResultImgIndex,
  //       event: { target: { checked: true } },
  //       originalUrl: upscaleOriginalUrl
  //     })
  //   }
  // }, [state])

  return {
    userInfo,
    routerSearchObj,
    modelImgList,
    slidesPerView,
    swiperEl,
    previewCurrent,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    isHasMore,
    isLoading,
    isSending,
    isUpscaleLoading,
    isOnlySeeMe,
    handleJumpPage,
    handleTagClick,
    handleClick,
    handleImgClick,
    handlePreviewChange,
    handleSearch,
    handleSend,
    handleUpscale,
    handleUpscaleImgVisible,
    handleIsOnlySeeMeCheck,
  }
}
