import React, { useState } from 'react'
import { Image, Input, message, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { getAdminInfo } from '../../../../../utils/tools'
import Api from '../../../../../api'
import './index.css'

function Index(props) {
  let groupCodeHistory = localStorage.getItem('groupCode')
  const [groupCode, setGroupCode] = useState(groupCodeHistory)

  const { wechatQRCode, wechatGroupQRCode, isHasBigWechatGroup } =
    getAdminInfo()

  const handleGroupCode = (e) => {
    setGroupCode(e.target.value)
    localStorage.setItem('groupCode', e.target.value)
  }

  const handleCheckGroupCode = () => {
    let groupCode = localStorage.getItem('groupCode')
    if (groupCode.trim() === '') {
      message.warning('群公告验证码不能为空')
    } else if (groupCode === '672913') {
      message.success('成功')
      props.handleDialogHide && props.handleDialogHide()
    } else {
      message.warning('群公告验证码错误')
    }
  }

  const handleSendMessage = () => {
    let friendUserId = '41f2e0a3-d136-41fd-ba95-918ee510b8e6'
    Api.h5.realTalkAdd({ userIds: [friendUserId] }).then((res) => {
      if (res.code === 200) {
        let realTalkId = res.data.realTalkId
        window.reactRouter.push(
          `/single/home/realChat?realTalkId=${realTalkId}&name=徐同保&friendUserId=${friendUserId}`
        )
      }
    })
  }

  return (
    <div className="m-single-page-space">
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
          className="m-space m-single-join-group-btn"
          onClick={handleCheckGroupCode}
        >
          提交
        </Button>
        <Button onClick={handleSendMessage}>人工客服</Button>
      </div>
      <div className="m-single-join-group-intro">
        <div>
          1.【扫码入群】-【查看群公告】-【找到验证码】-【填写验证码】-【获得更多提问次数】
        </div>
        <div>
          2.【扫码入群】-【添加群主好友】-【免费获得兑换码】-【在兑换页输入兑换码】-【成为会员】-【尽情使用ChatGPT和AI绘画（Stable Diffusion）】
        </div>
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
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Index)
