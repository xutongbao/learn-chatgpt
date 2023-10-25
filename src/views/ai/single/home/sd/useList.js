import { useState, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import Api from '../../../../../api'
import {
  objArrayUnique,
  uploadGetTokenFromLocalStorageForH5,
  uploadGetTokenForH5,
} from '../../../../../utils/tools'
import * as clipboard from 'clipboard-polyfill/text'
import Clipboard from 'clipboard'
import { Icon } from '../../../../../components/light'
import uaParser from 'ua-parser-js'
import Music from 'xgplayer-music'
import axios from 'axios'
import urls from '../../../../../api/urls'
import { getRouterSearchObj } from '../../../../../utils/tools'

import { v4 as uuidv4 } from 'uuid'

let isLoadingForSearch = false
let timer, timer2, timer3
let toBottom = 0
let myClipboard
let ua = uaParser(navigator.userAgent)
const { device } = ua
let player

let isCurrentPage = '1'

export default function useList(props) {
  const {
    location: { pathname },
  } = props
  let pageType = '1' //1单聊，2群聊
  let initTitle = 'ChatGPT'
  if (pathname === '/ai/groupChat') {
    pageType = '2'
    initTitle = '群聊'
  } else if (pathname === '/ai/chat-gpt-4') {
    pageType = '3'
    initTitle = 'GPT-4'
  }

  // eslint-disable-next-line
  const [title, setTitle] = useState(initTitle)
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [total, setTotal] = useState()
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  let tempMessage = ''
  if (process.env.REACT_APP_MODE === 'dev') {
    tempMessage =
      '1 chinese gril with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded'

    tempMessage = '1 chinese gril with headphones'
    tempMessage = '1girl,face,white background'
  }
  const [message, setMessage] = useState(tempMessage)
  // eslint-disable-next-line
  const [isSending, setIsSending] = useState(false)
  const [isGetNewest, setIsGetNewest] = useState(false)
  const [trigger, setTrigger] = useState('click')
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useState({})
  const [inputType, setInputType] = useState('1') //1文字，2录音
  const [isLoading, setIsLoading] = useState(false)
  const [previewCurrent, setPreviewCurrent] = useState(0)

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  const scrollEl = useRef(null)

  //初始值
  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = {
      prompt: '',
      apiType: '1',
      sdType: 'text2img',
      version: 'v3',
      negative_prompt:
        'ng_deepnegative_v1_75t, (badhandv4:1.2), (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, ((monochrome)), ((grayscale)) watermark, moles',
      use_default_neg: 'false',
      model_id: 'yBG2r9O',
      lora_model: '',
      lora_scale: 0.75,
      width: 512,
      height: 768,
      samples: 1,
      num_inference_steps: 30,
      safety_checker: 'no',
      enhance_prompt: 'yes',
      guidance_scale: 5,
      strength: 0.3,
      scheduler: 'K_EULER_ANCESTRAL',
    }
  } else {
    addInitValues = {
      prompt: '',
      apiType: '1',
      sdType: 'text2img',
      version: 'v3',
      negative_prompt:
        'ng_deepnegative_v1_75t, (badhandv4:1.2), (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, ((monochrome)), ((grayscale)) watermark, moles',
      use_default_neg: 'false',
      model_id: 'yBG2r9O',
      lora_model: '',
      lora_scale: 0.75,
      width: 512,
      height: 768,
      samples: 1,
      num_inference_steps: 30,
      safety_checker: 'no',
      enhance_prompt: 'yes',
      guidance_scale: 5,
      strength: 0.3,
      scheduler: 'K_EULER_ANCESTRAL',
    }
  }

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isGetNewest = false,
  } = {}) => {
    let searchData = {
      pageNum: page,
      pageSize,
      isGetNewest,
      isGroup: routerSearchObj.type === '2' ? true : false,
    }
    setIsGetNewest(isGetNewest)
    setIsLoading(true)
    Api.h5.sdAppSearch(searchData).then((res) => {
      setIsLoading(false)
      if (res.code === 200) {
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
            isAudioLoading: false,
            isShowToAudioBtn: false,
            isOpenPopover: false,
          }
        })
        if (isGetNewest === true) {
          if (Array.isArray(list) && list.length > 0) {
            let mergeList = [...list]
            mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
            setState({
              dataSource: mergeList,
              pageSize: res.data.pageSize,
            })
          }
        } else {
          let mergeList = [...list, ...state.dataSource]
          mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
          if (Array.isArray(mergeList) && mergeList.length > 0) {
            setState({
              dataSource: mergeList,
              pageSize: res.data.pageSize,
            })
          }
        }
        setTotal(res.data.total)
        const currentTemp = res.data.pageNum - 1
        setCurrent(currentTemp)
      }
    })
  }

  //发送
  const handleSend = async ({ messageByRecorder = '' } = {}) => {
    if (inputType === '2') {
      if (messageByRecorder === '' || messageByRecorder.trim() === '') {
        antdMessage.warning('请录音')
        return
      }
    } else {
      if (message === '' || message.trim() === '') {
        antdMessage.warning('请输入提示词！')
        return
      }
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
    let info = { ...addInitValues, ...sdHistoryParamsObj, prompt: message }

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
    let mergeList = [...state.dataSource, temp]
    mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
    if (Array.isArray(mergeList) && mergeList.length > 0) {
      setState({
        dataSource: mergeList,
        pageSize: state.pageSize,
      })
    }

    Api.h5.sdAdd({ info, groupCode, isNeedTranslate }).then((res) => {
      if (res.code === 200) {
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

          let temp = {
            uid: res.data.sdId,
            isTest: '1',
            message: tempMessage,
            pictureList,
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
          let mergeList = [...state.dataSource].filter(
            (item) => item.isTest !== '1'
          )
          mergeList = [...mergeList, temp]
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
              let mergeList = [...state.dataSource].filter(
                (item) => item.isTest !== '1'
              )
              mergeList = [...mergeList, temp]
              mergeList = objArrayUnique({ arr: mergeList, field: 'uid' })
              setState({
                dataSource: mergeList,
                pageSize: state.pageSize,
              })
            }
          })
        }
        if (process.env.REACT_APP_MODE !== 'dev') {
          setMessage('')
        }
      }
      setIsSending(false)
    })
  }

  //#region 录音
  const handleUploadAudio = async (blob) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    const uid = uuidv4()
    let formData = new FormData()
    formData.append('file', blob, `${uid}.webm`)
    formData.append('token', uploadGetTokenFromLocalStorageForH5())
    formData.append('key', `ai/audio/real01/${Date.now()}-${uid}.webm`)
    formData.append('fname', `${uid}.webm`)

    let uploadRes = await axios({
      url: urls.light.uploadToCDN,
      method: 'post',
      data: formData,
    })
    let fileWisperForH5Res
    if (uploadRes?.data?.code === 200) {
      fileWisperForH5Res = await Api.h5.fileWisperForH5({
        url: uploadRes.data.data.key,
      })
    }
    if (fileWisperForH5Res?.code === 200) {
      handleSend({
        messageByRecorder: fileWisperForH5Res.data.info.data.respData.text,
        audioUrlCdnForRecorder: fileWisperForH5Res.data.urlCdn,
        audioUrlForRecorder: uploadRes.data.data.key,
      })
    }
  }
  const handleNotAllowedOrFound = () => {
    console.log('todo')
  }
  //#endregion

  const handleToolbarOpenChange = ({ open, item }) => {
    const { uid } = item
    let { dataSource, pageSize } = state
    const resultIndex = dataSource.findIndex((item) => item.uid === uid)
    if (resultIndex >= 0) {
      dataSource[resultIndex].isOpenPopover = open
      setState({
        dataSource,
        pageSize,
      })
    }
  }

  // eslint-disable-next-line
  const handleToolbarVisible = () => {
    let { dataSource, pageSize } = state
    dataSource = dataSource.map((item) => {
      return {
        ...item,
        isOpenPopover: false,
      }
    })
    setState({
      dataSource,
      pageSize,
    })
  }

  //转音频
  const handleToAudio = (item, robotMessage = '') => {
    const { uid } = item
    let { dataSource, pageSize } = state
    if (item.isAudioLoading) {
      antdMessage.success('转音频中，请耐心等待')
    } else {
      const resultIndex = dataSource.findIndex((item) => item.uid === uid)
      if (resultIndex >= 0) {
        dataSource[resultIndex].isAudioLoading = true
        let newDataSource = [...dataSource]
        newDataSource = newDataSource.filter(
          (item) => (item.uid + '').indexOf('robot-loading') < 0
        )

        setState({
          dataSource: newDataSource,
          pageSize,
        })
        let talkId = localStorage.getItem('talkId')
        //handleToolbarVisible()
        antdMessage.success('转音频中，请耐心等待')
        Api.h5.chatAddAudio({ uid, robotMessage, talkId }).then((res) => {
          if (res.code === 200) {
            const { audioUrlCdn, isCutMessage } = res.data
            dataSource[resultIndex] = {
              ...dataSource[resultIndex],
              audioUrlCdn,
              isAudioLoading: false,
              //isShowToAudioBtn: false,
            }

            if (isCutMessage) {
              antdMessage.warning('成功-超出部分已自动截断')
            } else {
              antdMessage.success('成功')
            }
            let newDataSource = [...dataSource]
            newDataSource = newDataSource.filter(
              (item) => (item.uid + '').indexOf('robot-loading') < 0
            )

            setState({
              dataSource: newDataSource,
              pageSize,
            })
          }
        })
      }
    }
  }

  //播放音频
  const handleAudioPlayerBtnClick = (item) => {
    setTimeout(() => {
      let { dataSource } = state
      let url = []

      dataSource.forEach((item) => {
        if (item.audioUrlCdn) {
          url.push({
            src: item.audioUrlCdn,
            name: item.nickname,
            vid: item.uid,
            poster: 'http://static.xutongbao.top/img/logo.png',
            //poster: item.userAvatarCdn
            //poster: null
          })
        }
      })
      let resultIndex = url.findIndex((urlItem) => urlItem.vid === item.uid)
      if (player) {
        player.destroy()
        //player.pause()
      }
      let clientWidth = document.body.clientWidth
      let width = 500
      let height = 50
      if (clientWidth < 768) {
        width = 260
        height = 120
      }
      player = new Music({
        id: `m-chat-audio-player-${item.uid}`,
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
      player.setIndex(resultIndex)
      // player.on('change', (res) => {
      //   console.log(res);
      // });
    }, 100)
  }

  const handleCtrlEnter = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      handleSend()
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  const handleInputChangeByInfoDialog = (message) => {
    setMessage(message)
  }

  const changeMessageByUpload = ({ data }) => {
    setMessage(`${message}${data.urlCdn}`)
  }

  //跳转
  const handleJumpPage = (path) => {
    isCurrentPage = '2'
    props.history.push(path)
  }

  const handleUpdateToGPT4 = (path) => {
    props.dialogShow({ type: 'exchange' })
  }

  const handleScroll = (scrollValues) => {
    // eslint-disable-next-line
    let { scrollTop, clientHeight, scrollHeight } = scrollValues
    if (scrollTop < 200) {
      if (isLoadingForSearch === false && current > 0) {
        isLoadingForSearch = true
        handleSearch()
      }
    }
  }

  const handleCopy = (text) => {
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
    clipboard.writeText(text).then(() => {
      antdMessage.success('复制成功')
    })
    // handleToolbarVisible()
  }

  const getMessageToolbar = (item) => {
    return (
      <div className="m-sd-chat-message-toolbar">
        {item.audioUrlCdn ? (
          // eslint-disable-next-line
          <a
            href={item.audioUrlCdn}
            target="_blank"
            className="m-sd-chat-toolbar-link"
          >
            <Icon
              name="download"
              title="复制"
              className="m-sd-chat-toolbar-icon"
            ></Icon>
            <div>下载音频</div>
          </a>
        ) : null}

        {item.isShowToAudioBtn ? (
          <div
            className="m-sd-chat-toolbar-item"
            onClick={() => handleToAudio(item)}
            title={item.isAudioLoading ? '转音频中' : '转音频'}
          >
            <Icon name="music" className="m-sd-chat-toolbar-icon"></Icon>
            <div>{item.isAudioLoading ? '转音频中' : '转音频'}</div>
          </div>
        ) : null}
        <div
          className="m-sd-chat-toolbar-item"
          onClick={() => handleCopy(item.message)}
        >
          <Icon
            name="copy"
            title="复制"
            className="m-sd-chat-toolbar-icon"
          ></Icon>
          <div>复制</div>
        </div>
      </div>
    )
  }

  const handleImgClick = ({ pictureList, picItem }) => {
    let resultIndex = pictureList.findIndex((item) => item === picItem)
    if (resultIndex >= 0) {
      setPreviewCurrent(resultIndex)
    } else {
      setPreviewCurrent(0)
    }
  }

  const handlePreviewChange = (current, prevCurrent) => {
    setPreviewCurrent(current)
  }

  const handleSelectPrompt = (promptArr) => {
    let tempMessage = []
    if (message.trim() !== '') {
      let messageTemp = message.replace(/，/g, ',')
      tempMessage = [...messageTemp.split(','), ...promptArr]
    } else {
      tempMessage = [...promptArr]
    }

    tempMessage = new Set(tempMessage)
    tempMessage = Array.from(tempMessage).join(',')
    setMessage(tempMessage)
  }

  const handleTry = () => {
    let hooks = [
      {
        id: '1',
        prompt: '1girl,sweater,white background,',
      },
      {
        id: '2',
        prompt: '1girl,hair with bangs,black long dress,(yellow background),',
      },
      {
        id: '3',
        prompt: '1girl,face,white background,',
      },
      {
        id: '4',
        prompt: '1girl,face,Undercut Fade,red hair,white background,',
      },
      {
        id: '5',
        prompt: '1girl,face,curly hair,red hair,white background,',
      },
      {
        id: '6',
        prompt: '1boy,handsome male,face,beard,white background,',
      },
      {
        id: '7',
        prompt:
          '1 chinese gril with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded',
      },
      {
        id: '8',
        prompt: '1 chinese gril with headphones',
      },
      {
        id: '9',
        prompt:
          '1girl, Chinese Style,animal ears, bangs, black choker, black hair, black eyes, blurry, cat ears, choker, closed mouth, collarbone, eyelashes, lips, long hair, looking at viewer, portrait, solo,(shiny skin),realistic,fashi-girl,mature female',
      },
    ]
    let hooksTemp = hooks.filter(
      (item) => message.includes(item.prompt) === false
    )
    hooksTemp.sort(() => {
      return Math.random() > 0.5 ? -1 : 1
    })
    console.log(hooksTemp)
    if (hooksTemp.length > 0) {
      setMessage(hooksTemp[0].prompt)
    }
  }

  //操作
  const handleAction = ({ type, record }) => {
    if (type === 'refresh') {
      handleSearch({ isGetNewest: true })
    }
  }

  useEffect(() => {
    uploadGetTokenForH5()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        Api.h5.userGetInfo({ isLoading: false }).then((res) => {
          if (res.code === 200) {
            setUserInfo(res.data)
          }
        })
      }
    } else {
      Api.h5.userGetInfo({ isLoading: false }).then((res) => {
        if (res.code === 200) {
          setUserInfo(res.data)
        }
      })
    }
  }, [props.isRNGotToken])

  useEffect(() => {
    let dataSource = state.dataSource

    if (isGetNewest) {
      if (Array.isArray(dataSource) && dataSource.length > 0) {
        setTimeout(() => {
          if (isCurrentPage === '1') {
            const current = scrollEl.current
            current.scrollToBottom()
          }
        }, 100)
        setTimeout(() => {
          if (isCurrentPage === '1') {
            const current = scrollEl.current
            current.scrollToBottom()
          }
        }, 500)
      }
    } else {
      if (scrollEl.current) {
        const current = scrollEl.current
        // eslint-disable-next-line
        let { scrollTop, clientHeight, scrollHeight } = current.scrollValues
        toBottom = scrollHeight - scrollTop
      }

      clearTimeout(timer)
      timer = setTimeout(() => {
        if (isCurrentPage === '1') {
          isLoadingForSearch = false
          if (scrollEl.current) {
            const current = scrollEl.current

            let { scrollHeight } = current.scrollValues
            let toTop = scrollHeight - toBottom
            current.scrollTo(undefined, toTop)
            clearTimeout(timer2)

            timer2 = setTimeout(() => {
              if (isCurrentPage === '1') {
                current.scrollTo(undefined, toTop)
              }
            }, 200)
          }
        }
      }, 100)
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  useEffect(() => {
    if (window.platform === 'rn') {
      if (props.isRNGotToken === true) {
        handleSearch({ isGetNewest: true })
      }
    } else {
      handleSearch({ isGetNewest: true })
    }

    // eslint-disable-next-line
  }, [props.isRNGotToken])

  useEffect(() => {
    const codeDoms = document.querySelectorAll('pre')

    let i = document.createElement('span')
    i.setAttribute(
      'class',
      'icon iconfont icon-copy m-group-chat-code-copy-icon hljs-copy'
    )
    i.setAttribute('data-clipboard-action', 'copy')
    Array.from(codeDoms).forEach((item, index) => {
      let dom = i.cloneNode(false)
      let i_text = document.createTextNode('复制')
      dom.appendChild(i_text)
      dom.setAttribute('data-clipboard-target', '#copy' + index)
      item.appendChild(dom)
      let child = item.children[0]
      child.setAttribute('id', 'copy' + index)
    })

    myClipboard = new Clipboard('.hljs-copy')
    myClipboard.on('success', (e) => {
      antdMessage.success('复制代码块成功')
      e.clearSelection() // 清除文本的选中状态
    })
    myClipboard.on('error', (e) => {
      antdMessage.warning('复制失败')
      e.clearSelection() // 清除文本的选中状态
    })
    let domList = document.getElementsByClassName('m-group-chat-code-copy-icon')
    if (domList.length > 0) {
      for (let i = 0; i < domList.length; i++) {
        // eslint-disable-next-line
        domList[i].onclick = function (e) {
          setTrigger('')
          clearTimeout(timer3)

          timer3 = setTimeout(() => {
            setTrigger('click')
          }, 200)
        }
      }
    }
    return () => {
      myClipboard?.destroy()
    }
    // eslint-disable-next-line
  }, [state.dataSource])

  return {
    username,
    dataSource: state.dataSource,
    total,
    current,
    pageSize: state.pageSize,
    message,
    isSending,
    scrollEl,
    trigger,
    device,
    pageType,
    title,
    inputType,
    routerSearchObj,
    isLoading,
    previewCurrent,
    handleSearch,
    handleSend,
    handleCtrlEnter,
    handleJumpPage,
    handleInputChange,
    handleInputChangeByInfoDialog,
    handleScroll,
    handleUpdateToGPT4,
    handleAction,
    getMessageToolbar,
    handleToAudio,
    handleAudioPlayerBtnClick,
    handleToolbarOpenChange,
    changeMessageByUpload,
    setInputType,
    handleUploadAudio,
    handleNotAllowedOrFound,
    handleImgClick,
    handlePreviewChange,
    handleSelectPrompt,
    handleTry,
  }
}
