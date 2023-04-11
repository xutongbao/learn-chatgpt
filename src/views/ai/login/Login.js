import React, { useState, useEffect } from 'react'
import { Button, Input, message, Switch } from 'antd'
import Api from '../../../api'
import { connect } from 'react-redux'
import { showLoading, hideLoading } from '../../../utils/tools'
import useBrowserCheck from '../../../utils/hooks/useBrowserCheck'
import './index.css'

function Login(props) {
  const [count, setCount] = useState(0)
  const { browserCheckHandleModalVisible, browserCheckGetDom } =
    useBrowserCheck({
      ...props,
    })

  const [isDebuger, setIsDebuger] = useState(
    localStorage.getItem('isDebuger') === '1'
  )
  const [username, setUsername] = useState(
    process.env.REACT_APP_MODE === 'dev' ? '' : ''
  )
  const [password, setPassword] = useState(
    process.env.REACT_APP_MODE === 'dev' ? '' : ''
  )
  const [debugerPassword, setDebugerPassword] = useState(
    process.env.REACT_APP_MODE === 'dev' ? '' : ''
  )
  const [code, setCode] = useState(
    process.env.REACT_APP_MODE === 'dev' ? '' : ''
  )
  const [captchaId, setCaptchaId] = useState('')
  const [captcha, setCaptcha] = useState('')

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleLogin()
    }
  }

  const handleDebugerStatus = () => {
    setCount(count + 1)
    if (count >= 5) {
      setIsDebuger(true)
      localStorage.setItem('isDebuger', '1')
    }
  }

  const handleIsDebuger = (checked) => {
    setIsDebuger(checked)
    if (checked === false) {
      setCount(0)
      localStorage.setItem('isDebuger', '2')
    }
  }

  const handleJump = (path) => {
    props.history.push(path)
  }

  const handleLogin = () => {
    if (username.trim() === '') {
      message.info('用户名不能为空')
      return
    } else if (password.trim() === '') {
      message.info('密码不能为空')
      return
    } else if (code.trim() === '') {
      message.info('验证码不能为空')
      return
    }
    Api.h5
      .userAiLogin({
        username,
        password,
        code,
        captchaId,
        isDebuger,
        debugerPassword,
      })
      .then((res) => {
        if (res.code === 200) {
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('nickname', res.data.nickname)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('talkId', res.data.talkId)
          localStorage.setItem('uid', res.data.uid)
          props.history.push('/ai/index/home/chatList')
        }
      })
  }

  // eslint-disable-next-line
  const handleGuest = () => {
    showLoading()
    Api.h5.userAiGuestAdd({}, false).then((res) => {
      if (res.code === 200) {
        const { username, password } = res.data
        Api.h5
          .userAiLogin(
            { username, password, isGuest: true, isDebuger, debugerPassword },
            false
          )
          .then((res) => {
            if (res.code === 200) {
              localStorage.setItem('username', res.data.username)
              localStorage.setItem('nickname', res.data.nickname)
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('talkId', res.data.talkId)

              localStorage.setItem('uid', res.data.uid)
              props.history.push('/ai/index/home/chatList')
              hideLoading()
            }
          })
      }
    })
  }

  const handleForgetPassword = () => {
    props.history.push('/ai/forgetPassword')
  }

  const getCaptcha = () => {
    Api.h5.userCaptcha({}).then((res) => {
      if (res.code === 200) {
        const { captchaId, captcha } = res.data
        setCaptcha(captcha)
        setCaptchaId(captchaId)
      }
    })
  }

  useEffect(() => {
    browserCheckHandleModalVisible()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    getCaptcha()
    document.title = '学习'
  }, [])

  return (
    <div className="m-login-wrap m-ai-login">
      <div className="m-login-header">
        <span className="m-login-logo"></span>
        <span className="m-login-divider"></span>
        <span className="m-login-header-text" onClick={handleDebugerStatus}>
          登录
        </span>
      </div>
      <div className="m-login h5">
        <div className="m-login-row">
          <Input
            addonBefore="邮箱/账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="邮箱/账号"
            className="m-login-input"
            autoFocus
          />
        </div>
        <div className="m-login-row">
          <Input.Password
            addonBefore="密码"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => handleEnter(e)}
            placeholder="密码"
            className="m-login-input"
          />
        </div>
        <div className="m-login-row">
          <Input
            addonBefore="验证码"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
            onKeyUp={(e) => handleEnter(e)}
            placeholder="验证码"
            className="m-login-input"
          />
        </div>
        <div className="m-login-row">
          <div
            className="m-ai-login-code"
            onClick={getCaptcha}
            dangerouslySetInnerHTML={{ __html: captcha }}
          ></div>
        </div>
        {isDebuger ? (
          <>
            <div className="m-login-row">
              <span className="m-login-label">调试密码</span>
              <Input.Password
                value={debugerPassword}
                type="password"
                onChange={(e) => setDebugerPassword(e.target.value)}
                onKeyUp={(e) => handleEnter(e)}
                placeholder="调试密码"
                className="m-login-input"
              />
            </div>
            <div className="m-login-row">
              <Switch
                className="m-login-input"
                checked={isDebuger}
                onChange={handleIsDebuger}
                checkedChildren="开启调试"
                unCheckedChildren="关闭调试"
              ></Switch>
            </div>
          </>
        ) : null}

        <div className="m-login-btn-wrap">
          <Button
            type="primary"
            className="m-login-btn"
            onClick={() => handleLogin()}
          >
            登录
          </Button>
        </div>
        <div className="m-login-btn-wrap">
          <Button
            type="link"
            className="m-login-btn-text"
            onClick={() => handleJump('/ai/register')}
          >
            注册
          </Button>
          <Button
            type="link"
            className="m-login-btn-text"
            onClick={handleGuest}
          >
            游客
          </Button>
          <Button
            type="link"
            className="m-login-btn-text"
            onClick={handleForgetPassword}
          >
            忘记密码
          </Button>
        </div>
      </div>
      {browserCheckGetDom()}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetState(key, value) {
      dispatch({ type: 'SET_LIGHT_STATE', key, value })
    },
    onDispatch(action) {
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
