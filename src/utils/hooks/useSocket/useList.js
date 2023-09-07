import { io } from 'socket.io-client'
const socket = io('http://localhost:84')

export default function useList(props) {
  const handleLogin = () => {

    let config = {}
    if (config.isNotNeedToken !== true) {
      config.headers.authorization = localStorage.getItem('token')
    }
    if (window.platform === 'rn') {
      config.headers.platformos = localStorage.getItem('platformos') ? localStorage.getItem('platformos') : 'rn'
      config.headers.version = localStorage.getItem('appVersion') ? localStorage.getItem('appVersion') : ''
    } else {
      config.headers.platformos = 'h5'
      config.headers.version = window.version
    }
    config.headers.href = `${document.location.href}?platformos=${config.headers.platformos}&version=${config.headers.version}`

    socket.emit('/socket/login', {
      ...config,
      code: 200,
      data: {
      },
      message: '成功',
      time: Date.now(),
    })
  }

  const showModel = () => {}

  useEffect(() => {
    function onConnect() {
      console.log('登录，已连接', socket.id)
      handleLogin()
    }
    socket.on('connect', onConnect)

    socket.on('/socket/login', (res) => {
      console.log(res)
    })

    return () => {
      socket.off('connect', onConnect)
      socket.off('/socket/login', (res) => {
        console.log(res)
      })
    }
  }, [])

  return {
    showModel,
  }
}
