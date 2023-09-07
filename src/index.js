import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import store from './store'
import Router from './router/Router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs'
import uaParser from 'ua-parser-js'
// import "./static/font/iconfont.css"
// import 'antd/dist/reset.css';
import './static/css/light.css'
import './static/css/light2.css'
import reportWebVitals from './reportWebVitals'
//解决低版本浏览器Promise.finally is not function问题
import './utils/promise.finally.polyfill'

const getHashPriorty = () => {
  let ua = uaParser(navigator.userAgent)

  const { browser } = ua
  let major = browser.version.split('.')[0] - 0
  if (browser.name === 'Chrome' && major > 88) {
    return 'low'
  } else if (browser.name === 'Firefox' && major > 78) {
    return 'low'
  } else if (browser.name === 'Safari' && major > 14) {
    return 'low'
  } else if (browser.name === 'Mobile Safari' && major > 10) {
    return 'low'
  } else {
    return 'high'
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <StyleProvider
          hashPriority={getHashPriorty()}
          transformers={[legacyLogicalPropertiesTransformer]}
        >
          <Router></Router>
        </StyleProvider>
      </ConfigProvider>
    </HashRouter>
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
