import React from 'react'
import { Image, Empty, QRCode } from 'antd'
import useList from './useList'
import { getAdminInfo } from '../../../../../utils/tools'

import './index.css'

export default function Index(props) {
  const {
    uid,
    qrCodeImageUrl,
    qrCodeImageUrlShowName,
    handleCopy,
    handleJumpPage,
  } = useList(props)
  const { url } = getAdminInfo()

  let text = `${url}/#/ai/register?uid=${uid}`
  let textShowName = `${url}/#/ai/register?uid=${uid}&showName=1`

  return (
    <>
      {uid ? (
        <div className="m-single-page-space m-form-bottom">
          <div className="m-single-share-intro">
            <div>
              1.
              把二维码或链接分享给你的朋友，邀请他们注册，你和你的朋友都会自动获得更多的提问次数。每邀请一个用户注册你可以连续7天每天多提问10次。你的朋友可以一直每天多提问10次。
            </div>
            <div>
              2. 你可以在
              <span
                onClick={() => handleJumpPage('/ai/single/me/inviter')}
                className="m-single-share-link"
              >
                受邀用户
              </span>
              页面查看通过你的分享注册的用户
            </div>
            <div>
              3.
              受邀用户购买日卡你可以提成1元，购买GPT-3.5月卡你可以提成5元，购买GPT-4月卡你可以提成10元，
            </div>
          </div>
          <div className="m-single-share-info">
            <div>邀请链接：</div>
            <div
              className="m-single-share-url"
              onClick={() => handleCopy(text)}
            >
              {text}
            </div>
            <div>邀请链接(显示邀请人)：</div>
            <div
              className="m-single-share-url"
              onClick={() => handleCopy(textShowName)}
            >
              {textShowName}
            </div>
            <div>邀请二维码：</div>
            <div className="m-single-share-img-wrap">
              <Image className="m-single-share-img" src={qrCodeImageUrl} />
              <QRCode
                className="m-single-share-img"
                errorLevel="H"
                value={`${url}/#/ai/register?uid=${uid}`}
                icon="http://static.xutongbao.top/img/logo.png"
              />
            </div>
            <div>邀请二维码(显示邀请人)：</div>
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
