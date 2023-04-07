import React from 'react'

export default function BaiduInfo({ value = {} }) {
  return (
    <div>
      <span>百度账户ID：</span>
      <span className="m-space-plus">{value.id}</span>
      <span>百度账户名称：</span>
      <span className="m-space-plus">{value.name}</span>
      {value.onlineTime && (
        <>
          <span>上线时间：</span>
          <span className="m-space">{value.onlineTime}</span>
        </>
      )}
    </div>
  )
}
