import { useState, useEffect } from 'react'
import Api from '../../../../api'
import { getRouterSearchObj } from '../../../../utils/tools'
import Player from 'xgplayer'
import { message } from 'antd'

let player
export default function useList(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCategoryMoreVisible, setIsCategoryMoreVisible] = useState(false)
  const [courseDetail, setCourseDetail] = useState({})
  const [currentLesson, setCurrentLesson] = useState({})
  const [lessonList, setlessonList] = useState([])
  const [userStatus, setUserStatus] = useState({})
  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  //搜索
  const handleSearch = async ({ uid } = { uid: routerSearchObj.lessonUid }) => {
    Api.h5.lessonAppGetById({ uid }).then((res) => {
      if (res.code === 200) {
        setIsLoading(false)
        setCourseDetail(res.data.course)
        setlessonList(res.data.lessonList)
        setCurrentLesson(res.data.lesson)

        const { isHasPlayAuth } = res.data.userStatus
        setUserStatus(res.data.userStatus)
        const {
          lessonType,
          urlCnd,
          coverImageCnd,
          uid: lessonId,
        } = res.data.lesson
        if (isHasPlayAuth === true || lessonType === '1') {
          if (player) {
            try {
              player.destroy()
            } catch (error) {
              console.log(error)
            }
          }
          setIsPlaying(false)
          player = new Player({
            id: 'm-mse',
            url: urlCnd,
            poster: coverImageCnd,
            playsinline: true,
          })
          player.on('play', function () {
            setIsPlaying(true)
            Api.h5.behaviorLessonHistoryAction({ lessonId }).then((res) => {
              if (res.code) {
              }
            })
          })
        } else {
          message.info(res.message)
        }
      }
    })
  }

  //切换课节
  const handleSelectLesson = async (item) => {
    setCurrentLesson(item)
    await Api.h5.lessonAppGetByIdForSelect({ uid: item.uid }).then((res) => {
      if (res.code === 200) {
        setCurrentLesson(res.data.lesson)
        const { isHasPlayAuth } = res.data.userStatus
        setUserStatus(res.data.userStatus)
        const {
          lessonType,
          urlCnd,
          coverImageCnd,
          uid: lessonId,
        } = res.data.lesson
        if (isHasPlayAuth === true || lessonType === '1') {
          if (player) {
            try {
              player.destroy()
            } catch (error) {
              console.log(error)
            }
          }
          setIsPlaying(false)
          player = new Player({
            id: 'm-mse',
            url: urlCnd,
            poster: coverImageCnd,
            playsinline: true,
          })
          player.on('play', function () {
            setIsPlaying(true)
            Api.h5.behaviorLessonHistoryAction({ lessonId }).then((res) => {
              if (res.code) {
              }
            })
          })
        } else {
          message.info(res.message)
          player?.pause()
        }
      }
    })
  }

  //返回
  const handleBack = () => {
    //props.history.goBack()
    props.history.push('/ai/course')
  }

  //控制是否显示课节列表
  const handleCategoryMoreVisible = () => {
    setIsCategoryMoreVisible(!isCategoryMoreVisible)
  }

  //格式化课节时间
  const formatLessonTime = (text) => {
    if (text?.includes(':')) {
      const resultTime = text.split(':')
      if (resultTime[0] === '00') {
        return text.slice(3)
      } else {
        return text
      }
    } else {
      return text
    }
  }

  //点击时课节自动滚动到中间
  useEffect(() => {
    document.getElementById(`${currentLesson.uid}-h`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
    document.getElementById(currentLesson.uid)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
    // eslint-disable-next-line
  }, [currentLesson, isCategoryMoreVisible])

  // 挂载完请求第一页数据，路由里有查询条件会自动带上。再次点击菜单时，查询条件会消失，会再次请求数据
  useEffect(() => {
    //searchForm.resetFields()
    handleSearch()
    // eslint-disable-next-line
  }, [props.location.search])

  return {
    isLoading,
    isPlaying,
    courseDetail,
    lessonList,
    currentLesson,
    userStatus,
    isCategoryMoreVisible,
    handleSelectLesson,
    handleBack,
    formatLessonTime,
    handleCategoryMoreVisible,
  }
}
