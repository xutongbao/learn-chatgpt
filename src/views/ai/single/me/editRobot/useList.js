import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../../../api'
import { message } from 'antd'
import { uploadGetTokenForH5 } from '../../../../../utils/tools'

export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    Api.h5.userAppEdit(values).then((res) => {
      if (res.code === 200) {
        message.success('成功')
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

  useEffect(() => {
    setIsLoading(true)
    Api.h5.userGetInfo({ isLoading: false }).then((res) => {
      if (res.code === 200) {
        setUserInfo(res.data)
        const { uid, avatar, avatarCdn, nickname } = res.data
        setInitValues({
          uid,
          avatar,
          avatarCdn,
          nickname,
        })
        setIsLoading(false)
      }
    })
    uploadGetTokenForH5()
    // eslint-disable-next-line
  }, [])

  return {
    username,
    form,
    initValues,
    isLoading,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
  }
}
