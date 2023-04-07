import { useState, useEffect } from 'react'
import { message } from 'antd'
import Api from '../../../../../api'

export default function useList(props) {
  let codeHighLightHistory =
    localStorage.getItem('codeHighLight') === 'false' ? false : true
  const [codeHighLight, setCodeHighLight] = useState(codeHighLightHistory)
  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  const [wideScreen, setWideScreen] = useState(wideScreenHistory)
  const [subscribe, setSubscribe] = useState(true)

  const handleCodeHighLight = (value) => {
    setCodeHighLight(value)
    localStorage.setItem('codeHighLight', value)
  }

  const handleWideScreen = (value) => {
    setWideScreen(value)
    localStorage.setItem('wideScreen', value)
  }

  const handleSubscribe = (value) => {
    setSubscribe(value)
    Api.h5.userAppEdit({ subscribe: value ? '1' : '2' }).then((res) => {
      if (res.code === 200) {
        message.success('成功')
      }
    })
  }

  useEffect(() => {
    Api.h5.userGetInfo({}).then((res) => {
      if (res.code === 200) {
        let userInfo = res.data
        setSubscribe(userInfo.subscribe === '2' ? false : true)
      }
    })
    // eslint-disable-next-line
  }, [])

  return {
    codeHighLight,
    wideScreen,
    subscribe,
    handleCodeHighLight,
    handleWideScreen,
    handleSubscribe,
  }
}
