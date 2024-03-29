import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'

export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    Api.h5.exchangeCodeAppUse(values).then((res) => {
      if (res.code === 200) {
        message.success('恭喜您，兑换成功')
        props.history.push('/ai/index/me')
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

  const handleSendMessage = () => {
    let friendUserId = '41f2e0a3-d136-41fd-ba95-918ee510b8e6'
    Api.h5.realTalkAdd({ userIds: [friendUserId] }).then((res) => {
      if (res.code === 200) {
        let realTalkId = res.data.realTalkId
        window.reactRouter.push(
          `/single/home/realChat?realTalkId=${realTalkId}&name=徐同保&friendUserId=${friendUserId}`
        )
      }
    })
  }

  useEffect(() => {
    // eslint-disable-next-line
  }, [])

  return {
    username,
    form,
    initValues,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
    handleSendMessage,
  }
}
