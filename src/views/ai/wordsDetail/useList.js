import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'
import { getRouterSearchObj } from '../../../utils/tools'
// eslint-disable-next-line
import Player from 'xgplayer'
import Music from 'xgplayer-music'

let player
let url = []
let isDoing = false
let timer
export default function useList(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentWord, setCurrentWord] = useState({})

  const [total, setTotal] = useState(10)
  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)
  let initCurrent = routerSearchObj.pageNum ? routerSearchObj.pageNum - 0 : 1
  const [current, setCurrent] = useState(initCurrent)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 100,
  })
  const [isHasMore, setIsHasMore] = useState(true)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 100,
      })
    }
    let searchData = { pageNum: page, pageSize }
    Api.h5.wordsAppSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data

        let list = res.data.list
        list = list.map((item) => {
          let { avatarCdn } = item
          if (avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
            avatarCdn = 'http://static.xutongbao.top/img/m-default-avatar.jpg'
          }
          return {
            ...item,
            avatarCdn,
          }
        })
        if (isRefresh) {
          setState({
            dataSource: [...list],
            pageSize: res.data.pageSize,
          })
        } else {
          setState({
            dataSource: [...state.dataSource, ...list],
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

  //搜索
  const handleGetById = ({ uid } = { uid: routerSearchObj.uid }) => {
    setIsLoading(true)
    Api.h5.wordsGetById({ uid }).then((res) => {
      if (res.code === 200) {
        setIsLoading(false)
        let currentWord = res.data
        currentWord.ci?.forEach((item) => {
          let tempReg = '/' + currentWord.word + '/ig'
          // eslint-disable-next-line
          let reg = eval(tempReg)
          item.textForHtml = item.text.replace(
            reg,
            `<span class="m-words-detail-word-text active">${currentWord.word}</span>`
          )
        })
        currentWord.sentence?.forEach((item, index) => {
          let currentCi = currentWord.ci[index].text
          let tempReg = '/' + currentCi + '/ig'
          // eslint-disable-next-line
          let reg = eval(tempReg)
          item.textForHtml = item.text.replace(
            reg,
            `<span class="m-words-detail-word-text active">${currentCi}</span>`
          )
        })
        setCurrentWord(currentWord)
      }
    })
  }

  //播放音频
  const handleAudioPlayerBtnClick = ({ playUrl }) => {
    const fun = () => {
      let resultIndex = url.findIndex((urlItem) => urlItem.src === playUrl)
      if (player && url[resultIndex].src) {
        player.pause()
        player.setIndex(resultIndex)
        message.success('成功')
      }
    }
    if (isDoing === false) {
      isDoing = true
      fun()
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        isDoing = false
      }, 1000)
    }
  }

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    Api.h5.exchangeCodeAppUse(values).then((res) => {
      if (res.code === 200) {
        message.success('恭喜您，兑换成功')
        //props.history.push('/h5/index/me')
      }
    })
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  //退出
  const handleQuit = () => {
    Api.light.userLogout().then((res) => {
      if (res.code === 200) {
        props.history.push('/h5/login')
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')
      }
    })
  }

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleCopy = (text) => {
    clipboard.writeText(text).then(() => {
      message.success('复制成功')
    })
  }

  useEffect(() => {
    handleSearch()
    handleGetById()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    url = []
    url.push({
      src: currentWord.wordAudioCdn,
      name: currentWord.word,
      vid: '0',
      poster: 'http://static.xutongbao.top/img/logo.png',
    })
    currentWord?.ci?.forEach((item, index) => {
      url.push({
        src: item.audioCdn,
        name: item.text,
        vid: `ci_${index}`,
        poster: 'http://static.xutongbao.top/img/logo.png',
      })
    })

    currentWord?.sentence?.forEach((item, index) => {
      url.push({
        src: item.audioCdn,
        name: item.text.slice(0, 10) + '...',
        vid: `sentence_${index}`,
        poster: 'http://static.xutongbao.top/img/logo.png',
      })
    })

    let clientWidth = document.body.clientWidth
    let width = 500
    let height = 50
    if (clientWidth < 768) {
      width = 260
      height = 120
    }
    if (player) {
      player.destroy()
    }
    player = new Music({
      id: `m-words-audio-player`,
      url,
      volume: 0.8,
      width,
      height,
      preloadNext: true,
      switchKeepProgress: false,
      abCycle: {
        // start: 3,
        // end: 9,
        loop: false,
      },
      offline: false,
    })
    //没有用的代码，仅仅是为了屏蔽报错
    player.database = {
      myDB: {
        ojstore: {},
      },
      database: { getDataByKey: () => {} },
      getDataByKey: () => {},
    }
    // player.on('change', (res) => {
    //   console.log(res);
    // });
    handleAudioPlayerBtnClick({ playUrl: currentWord.wordAudioCdn })
    document
      .getElementById(`m-word-${currentWord.uid}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    if (!document.getElementById(`m-word-${currentWord.uid}`)) {
      setTimeout(() => {
        document.getElementById(`m-word-${currentWord.uid}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        })
      }, 100)
    }

    // eslint-disable-next-line
  }, [currentWord])

  // useEffect(() => {
  //   setTimeout(() => {
  //     document.getElementById(`m-word-${currentWord.uid}`)?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //       inline: 'start',
  //     })
  //     console.log(7)
  //   }, 100)
  //   // eslint-disable-next-line
  // }, [currentWord])

  return {
    isLoading,
    currentWord,
    username,
    form,
    initValues,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    isHasMore,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleSearch,
    handleGetById,
    handleAudioPlayerBtnClick,
  }
}
