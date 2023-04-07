import { useState, useEffect } from 'react'
import { Form } from 'antd'
import Api from '../../../../../api'
import { message } from 'antd'
import * as clipboard from 'clipboard-polyfill/text'
import QrCodeWithLogo from 'qr-code-with-logo'
import logo from '../../../../../static/images/logo.png'
import { getAdminInfo } from '../../../../../utils/tools'
const { url } = getAdminInfo()


export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))
  // eslint-disable-next-line
  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState()
  const [qrCodeImageUrlShowName, setQrCodeImageUrlShowName] = useState()


  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    Api.h5.exchangeCodeAppUse(values).then((res) => {
      if (res.code === 200) {
        message.success('恭喜您，兑换成功')
        //props.history.push('/h5/index/me')
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

  useEffect(() => {
    const image = new Image()
    let text = `${url}/#/ai/register?uid=${uid}`

    QrCodeWithLogo.toImage({
      width: 1000,
      image,
      content: text,
      logo: {
        src: logo,
      },
    })
    image.id = 'm-img'
    image.style = 'display:none;'
    document.body.appendChild(image)
    const imageDom = document.getElementById('m-img')
    setTimeout(() => {
      setQrCodeImageUrl(imageDom.src)
    }, 100)
    setTimeout(() => {
      setQrCodeImageUrl(imageDom.src)
    }, 2000)

    const image2 = new Image()
    let text2 = `${url}/#/ai/register?uid=${uid}&showName=1`
    QrCodeWithLogo.toImage({
      width: 1000,
      image: image2,
      content: text2,
      logo: {
        src: logo,
      },
    })
    image2.id = 'm-img2'
    image2.style = 'display:none;'
    document.body.appendChild(image2)
    const imageDom2 = document.getElementById('m-img2')
    setTimeout(() => {
      setQrCodeImageUrlShowName(imageDom2.src)
    }, 100)
    setTimeout(() => {
      setQrCodeImageUrlShowName(imageDom2.src)
    }, 2000)

    // eslint-disable-next-line
  }, [])

  return {
    username,
    form,
    initValues,
    uid,
    qrCodeImageUrl,
    qrCodeImageUrlShowName,
    handleFinish,
    handleFinishFailed,
    handleQuit,
    handleJumpPage,
    handleCopy,
  }
}
