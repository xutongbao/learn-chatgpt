import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'
import {
  getRouterSearchObj,
  showLoading,
  hideLoading,
  uploadGetTokenForH5,
} from '../../../utils/tools'

let timer
export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  //初始值
  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = {
      username: '1183391880@qq.com',
      emailCode: '852963',
      nickname: 'xu',
      password: '123456',
      code: '852963',
      inviter: '',
    }
  } else {
    addInitValues = {}
  }
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({ ...addInitValues })
  const [captchaId, setCaptchaId] = useState('')
  const [emailId, setEmailId] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [count, setCount] = useState(0)
  const [isSendEmail, setIsSendEmail] = useState(false)

  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    const invitationCode = localStorage.getItem('invitationCode')
      ? localStorage.getItem('invitationCode')
      : ''

    if (!emailId) {
      message.info('请获取邮箱验证码')
      return
    }
    Api.h5
      .userAiAdd({
        ...values,
        emailId,
        captchaId,
        invitationCode,
      })
      .then((res) => {
        if (res.code === 200) {
          props.history.push('/ai/login')
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

  //操作
  const handleAction = ({ type, record }) => {
    if (type === 'joinGroup') {
      props.history.push(`/ai/joinGroup`)
    } else if (type === 'contactUs') {
      props.history.push(`/ai/contactUs`)
    }
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

  let regExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
  const checkEmail = (e, value) => {
    //let regExp = /\w+[@][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)/
    if (regExp.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('请输入正确的邮箱'))
    }
  }

  const handleSendEmail = () => {
    const username = form.getFieldValue('username')
    if (regExp.test(username)) {
      Api.h5.userSendEmailCode({ username }).then((res) => {
        if (res.code === 200) {
          setEmailId(res.data.emailId)
          message.success(res.message)
          setCount(process.env.REACT_APP_MODE === 'dev' ? 6 : 180)
          setIsSendEmail(true)
        }
      })
    } else {
      message.info('请输入正确的邮箱')
    }
  }

  // eslint-disable-next-line
  const handleGuest = () => {
    showLoading()
    Api.h5.userAiGuestAdd({}, false).then((res) => {
      if (res.code === 200) {
        const { username, password } = res.data
        Api.h5
          .userAiLogin({ username, password, isGuest: true }, false)
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

  useEffect(() => {
    uploadGetTokenForH5()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        setIsSendEmail(false)
      }
    }, 1000)
    // eslint-disable-next-line
  }, [count])

  useEffect(() => {
    getCaptcha()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const { uid } = routerSearchObj
    if (uid) {
      localStorage.setItem('invitationCode', uid)
    }
    const invitationCode = localStorage.getItem('invitationCode')
      ? localStorage.getItem('invitationCode')
      : ''
    if (invitationCode) {
      Api.h5.userGetUserInfoById({ uid: invitationCode }).then((res) => {
        if (res.code === 200) {
          const { nickname } = res.data
          let inviter = nickname
          form.setFieldsValue({
            inviter,
          })
        }
      })
    }

    // eslint-disable-next-line
  }, [])

  return {
    username,
    form,
    initValues,
    captcha,
    count,
    isSendEmail,
    routerSearchObj,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleAction,
    getCaptcha,
    checkEmail,
    handleSendEmail,
    handleGuest,
  }
}
