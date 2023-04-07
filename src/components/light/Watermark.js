import React from 'react'
import { Space } from 'antd'

export default function Watermark({ username }) {
  let domArr = []
  for (let i = 0; i < 200; i++) {
    domArr.push(
      <div key={i} className="m-watermark-item">
        <div>学习</div>
        <div>{username}</div>
      </div>
    )
  }
  return (
    <div className="m-watermark">
      <Space size={[100, 100]} wrap>
        {domArr}
      </Space>
    </div>
  )
}
