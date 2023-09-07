import React from 'react'
import { Image, Empty, QRCode } from 'antd'
import useList from './useList'
import { getAdminInfo } from '../../../../../utils/tools'

import './index.css'

export default function Index(props) {
  const {
    uid,
    qrCodeImageUrlShowName,
    handleCopy,
  } = useList(props)
  const { url } = getAdminInfo()

  let textShowName = `${url}/#/ai/register?uid=${uid}&showName=1`

  return (
    <>
      {uid ? (
        <div className="m-single-page-space m-form-bottom">
          <div className="m-single-share-intro">
            <div>
              邀请好友注册，获得更多提问次数
            </div>
          </div>
          <div className="m-single-share-info">
            <div>邀请链接：</div>
            <div
              className="m-single-share-url"
              onClick={() => handleCopy(textShowName)}
            >
              {textShowName}
            </div>
            <div>邀请二维码：</div>
            <div className="m-single-share-img-wrap">
              <Image
                className="m-single-share-img"
                src={qrCodeImageUrlShowName}
              />
              <QRCode
                className="m-single-share-img"
                errorLevel="H"
                value={`${url}/#/ai/register?uid=${uid}&showName=1`}
                icon="http://static.xutongbao.top/img/logo.png"
              />
            </div>
          </div>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请重新登录" />
      )}
    </>
  )
}
