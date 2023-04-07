import React from 'react'
import { FloatButton } from 'antd'

export default function MyBackTop({ className = '' }) {
  return (
    <>
      <FloatButton.BackTop
        className={`m-back-top ${className}`}
        target={() => {
          const dom = document.getElementById('m-content-wrap')
          return dom ? dom : window
        }}
      />
    </>
  )
}
