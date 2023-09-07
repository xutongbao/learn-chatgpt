import React, { useEffect } from 'react'
import { Button } from 'antd'
import { socket } from '../../../../../api/socket'
import './index.css'

export default function Index() {
  const handleSend = () => {
    socket.emit('/socket/test', {
      code: 200,
      data: {
        a: 1,
      },
      message: '成功',
      time: Date.now(),
    })
  }

  useEffect(() => {
    function onConnect() {
      console.log('已连接', socket.id)
    }
    socket.on('connect', onConnect)

    socket.on('/socket/test', (res) => {
      console.log(res)
    })

    return () => {
      socket.off('connect', onConnect)
      socket.off('/socket/test', (res) => {
        console.log(res)
      })

    }
  }, [])

  return (
    <div className="m-test1">
      <Button onClick={handleSend}>发送数据</Button>
    </div>
  )
}
