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
  const [avatarList, setAvatarList] = useState([])

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    let newValues = { ...values }
    if (!newValues.avatar) {
      newValues.avatarCdn = 'http://static.xutongbao.top/img/logo.png'
      newValues.avatar = 'http://static.xutongbao.top/img/logo.png'
    }
    Api.h5.userAppEdit(newValues).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('nickname', values.nickname)
        message.success('成功')
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

  const handleChangeAvatarSelect = (value) => {
    console.log(value)
    const values = form.getFieldsValue()
    console.log(values)
    setInitValues({
      ...values,
      avatarCdn: value,
      avatar: value,
    })
  }

  const handleSelectAvatar = ({ avatar }) => {
    console.log(avatar)
    const values = form.getFieldsValue()
    console.log(values)
    setInitValues({
      ...values,
      avatarCdn: avatar,
      avatar: avatar,
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
        let { uid, avatar, avatarCdn, nickname } = res.data
        if (avatarCdn === 'http://static.xutongbao.top/img/logo.png') {
          avatar = undefined
          avatarCdn = undefined
        }
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

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line
  }, [initValues])

  useEffect(() => {
    let avatarList = [
      {
        id: '001',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/001-avatar.jpg',
      },
      {
        id: '002',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/002-avatar.jpg',
      },
      {
        id: '003',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/003-avatar.jpg',
      },
      {
        id: '004',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/004-avatar.jpg',
      },
      {
        id: '005',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/005-avatar.jpg',
      },
      {
        id: '006',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/006-avatar.jpg',
      },
      {
        id: '007',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/007-avatar.jpg',
      },
      {
        id: '008',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/008-avatar.jpg',
      },
      {
        id: '009',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/009-avatar.jpg',
      },
      {
        id: '010',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/010-avatar.jpg',
      },
      {
        id: '011',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/011-avatar.jpg',
      },
      {
        id: '012',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/012-avatar.jpg',
      },
      {
        id: '013',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/013-avatar.jpg',
      },
      {
        id: '014',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/014-avatar.jpg',
      },
    ]
    avatarList = avatarList.sort((a, b) => {
      return Math.random() > 0.5 ? 1 : -1
    })
    setAvatarList(avatarList)
  }, [])

  return {
    username,
    form,
    initValues,
    isLoading,
    avatarList,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleChangeAvatarSelect,
    handleSelectAvatar,
  }
}
