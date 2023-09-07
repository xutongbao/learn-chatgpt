import React, { Component } from 'react'
// eslint-disable-next-line
import { addLog } from '../../utils/tools'

//let timer

//错误边界
//https://zh-hans.reactjs.org/docs/error-boundaries.html#gatsby-focus-wrapper
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, isLoadingError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    //console.log('666', error)
    //return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // console.log(error.toString())
    // console.log(errorInfo.componentStack)
    if (!(process.env.REACT_APP_MODE === 'dev')) {
      const errorTitle = error.toString()
      //css块加载失败： Loading CSS chunk
      if (errorTitle.includes('Loading CSS')) {
        this.setState({
          isLoadingError: true
        })
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        // timer = setTimeout(() => {
        //   addLog({ errorTitle, detail: errorInfo.componentStack })
        //   clearTimeout(timer)
        // }, 3000)
        this.setState({
          isLoadingError: false
        })
      }
    }

    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="m-error-wrap">
          <div className="m-error-img-wrap">
            <div className="m-error-img"></div>
          </div>
          <div className="m-error-text">网页出错了，请尝试刷新一下~</div>
          {
            this.state.isLoadingError && (
              <div className="m-error-text">3秒后自动刷新~</div>
            )
          }
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}
