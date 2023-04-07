import { useState, useEffect } from 'react'
import Player from 'xgplayer'
import Api from '../../../../../api'
let playerListHistory
export default function useList(props) {
  const [total, setTotal] = useState(10)
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [playerList, setPlayerList] = useState([])
  const [playedIndexArr, setPlayedIndexArr] = useState([])
  const [isHasMore, setIsHasMore] = useState(true)

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 10,
      })
      setPlayerList([])
      page = 1
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.lessonSearchForVideoQuestion(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data
        if (isRefresh) {
          setState({
            dataSource: [...res.data.list],
            pageSize: res.data.pageSize,
          })
        } else {
          setState({
            dataSource: [...state.dataSource, ...res.data.list],
            pageSize: res.data.pageSize,
          })
        }
        setTotal(res.data.total)
        const currentTemp = res.data.pageNum + 1
        setCurrent(currentTemp)
        setIsHasMore(pageNum < Math.ceil(total / pageSize))
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

  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let playListTemp = []
    state.dataSource.forEach((item, index) => {
      const resultIndex = playerList.findIndex((item) => item.index === index)
      if (resultIndex < 0) {
        //const playerDom = document.getElementById(`player-${index}`)
        const player = new Player({
          id: `player-${index}`,
          url: item.urlCnd,
          poster: item.coverImageCnd,
          //cssFullscreen: true,
          playsinline: true,
          // lastPlayTime: item.lesson.lastPlayTime
        })
        playListTemp.push({
          index,
          player,
        })

        player.on(
          'play',
          ((index, player, lessonId) => () => {
            console.log('播放', index, player, playerListHistory)
            if (playedIndexArr.findIndex((item) => item === index) < 0) {
              playedIndexArr.push(index)
              setPlayedIndexArr([...playedIndexArr])
              document.getElementById(`player-item-${index}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
              })
            }

            playerListHistory
              .filter((item) => item.index !== index)
              .forEach((item) => {
                item.player.pause()
              })
            Api.h5.behaviorLessonHistoryAction({ lessonId }).then((res) => {
              if (res.code) {
              }
            })
          })(index, player, item.uid)
        )
      }
    })
    setPlayerList([...playerList, ...playListTemp])
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    playerListHistory = playerList
  }, [playerList])

  return {
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    playedIndexArr,
    isHasMore,
    handleSearch,
    handleDetail,
    formatLessonTime,
  }
}
