import { useState, useEffect } from 'react'
import Api from '../../../../../api'

export default function useList(props) {
  // eslint-disable-next-line
  const [username, setUsername] = useState(localStorage.getItem('username'))

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
    // eslint-disable-next-line
  }, [])

  return {
    username,
    handleQuit,
    handleJumpPage,
  }
}
