import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import store from './store'
import Router from './router/Router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
// import "./static/font/iconfont.css"
// import 'antd/dist/reset.css';
import './static/css/light.css'
import './static/css/light2.css'
import reportWebVitals from './reportWebVitals'
//解决低版本浏览器Promise.finally is not function问题
import "./utils/promise.finally.polyfill"

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <Router></Router>
      </ConfigProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
