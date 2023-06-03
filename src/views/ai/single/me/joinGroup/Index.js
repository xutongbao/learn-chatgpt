import React, { useState, useEffect } from 'react'
import { Image, Input, message, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { getAdminInfo } from '../../../../../utils/tools'
import * as clipboard from 'clipboard-polyfill/text'
import './index.css'

function Index(props) {
  let groupCodeHistory = localStorage.getItem('groupCode')
  const [groupCode, setGroupCode] = useState(groupCodeHistory)
  // eslint-disable-next-line
  const [isNight, setIsNight] = useState(false)

  const {
    wechatCode,
    wechatQRCode,
    wechatGroupQRCode,
    isHasBigWechatGroup,
    xingqiu1,
    xingqiu2,
  } = getAdminInfo()

  const handleCopy = (text) => {
    clipboard.writeText(text).then(() => {
      message.success('复制成功')
    })
  }

  const handleGroupCode = (e) => {
    setGroupCode(e.target.value)
    localStorage.setItem('groupCode', e.target.value)
  }

  //跳转
  const handleJumpPage = (path) => {
    // eslint-disable-next-line
    props.history.push(path)
  }

  const handleCheckGroupCode = () => {
    let groupCode = localStorage.getItem('groupCode')
    if (groupCode.trim() === '') {
      message.warning('群公告验证码不能为空')
    } else if (groupCode === '672913') {
      message.success('成功')
    } else {
      message.warning('群公告验证码错误')
    }
  }

  useEffect(() => {
    let isNight = false
    let hour = moment(Date.now()).format('HH') - 0
    if ((hour >= 0 && hour <= 8) || hour === 22 || hour === 23) {
      isNight = true
    } else {
      isNight = false
    }
    //isNight = true
    setIsNight(isNight)
  }, [])

  return (
    <div className="m-single-page-space m-form-bottom">
      <div className="m-login-row">
        <Input
          addonBefore="群公告验证码"
          value={groupCode}
          onChange={handleGroupCode}
          placeholder="请输入"
          className="m-login-input"
        />
      </div>
      <div className="m-login-row">
        <Button
          type="primary"
          className="m-space m-single-exchange-btn"
          onClick={handleCheckGroupCode}
        >
          提交
        </Button>
      </div>
      <div className="m-single-join-group-intro">
        <div>
          1.【扫码入群】-【查看群公告】-【找到验证码】-【填写验证码】-【获得更多提问次数】（群公告验证码定期更新，切勿退群）
        </div>

        <div>
          2. 通过
          <span
            onClick={() => handleJumpPage('/ai/single/me/share')}
            className="m-weixin-code"
          >
            分享
          </span>
          把注册二维码或链接分享给你的朋友，邀请他们注册，你和你的朋友都会自动获得更多的提问次数。每邀请一个用户注册你可以连续7天每天多提问10次。你的朋友可以一直每天多提问10次。
        </div>
        <div>3. 交流学习</div>
        {isHasBigWechatGroup ? (
          <div>
            4.【进大群】-【扫码添加群主微信】（微信群已经超过200人,群主微信号：
            <span
              className="m-weixin-code"
              onClick={() => handleCopy(wechatCode)}
            >
              {wechatCode}
            </span>
            ）-
            【耐心等待群主邀请你进大群】-【查看群公告】-【找到验证码】-【填写验证码】-【获得更多提问次数】（群公告验证码定期更新，切勿退群）
          </div>
        ) : null}
      </div>
      <div>
        <div className="m-single-join-group-img-wrap">
          <Image className="m-single-join-group-img" src={wechatGroupQRCode} />
        </div>
        {isHasBigWechatGroup ? (
          <div>
            <div className="m-single-join-group-img-wrap">
              <Image
                src={wechatQRCode}
                className="m-single-join-group-img"
                alt={'图片'}
              ></Image>
            </div>
            <div className="m-single-join-group-img-wrap">
              <Image
                className="m-single-join-group-img"
                src="http://static.xutongbao.top/img/m-join-group.jpg?time=20230405"
              />
            </div>
          </div>
        ) : null}
        {xingqiu1 ? (
          <div>
            <div className="m-single-join-group-img-wrap">
              <Image
                src={xingqiu1}
                className="m-single-join-group-img"
                alt={'图片'}
              ></Image>
            </div>
            <div className="m-single-join-group-img-wrap">
              <Image className="m-single-join-group-img" src={xingqiu2} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Index)
