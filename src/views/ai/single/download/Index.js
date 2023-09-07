import React, { useState, useEffect } from 'react'
import './index.css'
import Api from '../../../../api'

export default function Index() {
  const [downloadUrl, setDownloadUrl] = useState()

  const handleConfigBase = () => {
    Api.h5.configBase().then((res) => {
      if (res.code === 200) {
        setDownloadUrl(res.data.downloadUrl)
      }
    })
  }

  useEffect(() => {
    handleConfigBase()
  }, [])
  return (
    <div className="m-download-wrap">
      <div className="m-download-logo-wrap">
        <div>
          <div className="m-download-logo"></div>
          <div className="m-download-logo-text">学习</div>
        </div>
      </div>
      <div className="m-download-footer">
        <div className="m-download-btn-wrap">
          {/* eslint-disable-next-line */}
          <a href={`${downloadUrl}`} className="m-download-btn">
            立即下载安卓客户端
          </a>
        </div>
        <div className="m-download-text-wrap">
          {/* eslint-disable-next-line */}
          <a href={`https://chat.xutongbao.top/`} className="m-download-text">
            进入网页 &gt;
          </a>
        </div>
      </div>
    </div>
  )
}
