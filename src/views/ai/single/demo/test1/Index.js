import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import uaParser from 'ua-parser-js'
import Store from '../../../../../store'
import './index.css'

export default function Index() {
  const [testData, setTestData] = useState()
  const [token, setToken] = useState()

  const handleGetDataFromInjected = () => {
    if (window.reactNative?.testData) {
      setTestData(window.reactNative?.testData)
      setToken(window.reactNative?.token)
    }
  }

  const handleClick = () => {
    console.log(Store)
    Store.dispatch({
      type: 'SET_LIGHT_STATE',
      key: ['isRNGotToken'],
      value: true
    })
    console.log(Store.getState())
    // let ua = uaParser(navigator.userAgent)
    // console.log(ua.os.name)
    // if (window.ReactNativeWebView) {
    //   window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'getToken' }))
    // }
  }

  const handleGetToken = () => {
    //setToken(localStorage.getItem('token'))
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'getToken' })
      )
    }
  }

  const handleMessage = () => {
    window.document.addEventListener('message', function (e) {
      let payload = e.data ? JSON.parse(e.data) : {}
      let type = payload.type

      if (type === 'getToken') {
        setToken(payload.token)
      } else if (type === 'getBrowserInfo') {
        let ua = uaParser(navigator.userAgent)
        console.log(ua)
        const { browser } = ua
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, browser }))
      }
    })
  }

  useEffect(() => {
    handleGetDataFromInjected()
  }, [])

  useEffect(() => {
    handleGetToken()
  }, [])

  useEffect(() => {
    handleMessage()
  }, [])

  return (
    <div className="m-test1">
      <Button onClick={handleClick}>获取Token</Button>
      <div>{testData}</div>
      <div>token:{token}</div>
    </div>
  )
}
