import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Input, Image } from 'antd'
import { getAdminInfo } from '../../../../../utils/tools'
import useList from './useList'
import './index.css'

function Index(props) {
  const {
    form,
    initValues,
    handleFinish,
    handleFinishFailed,
    handleCopy,
    handleJumpPage,
  } = useList(props)

  const { wechatCode, wechatQRCode, xingqiu1 } = getAdminInfo()

  return (
    <>
      <div className="m-single-page-space m-form-bottom">
        <div className="m-single-exchange-form-wrap">
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="vertical"
            initialValues={{ ...initValues }}
            scrollToFirstError={true}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <div id="m-modal-form-info" className="m-modal-form-info">
              <Form.Item
                label=""
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入兑换码！',
                  },
                ]}
              >
                <Input addonBefore="兑换码" placeholder="请输入兑换码" />
              </Form.Item>
            </div>
            <Form.Item
              wrapperCol={{ offset: 0, span: 24 }}
              className="m-modal-footer"
            >
              <Button
                type="primary"
                htmlType="submit"
                className="m-space m-single-exchange-btn"
              >
                立即兑换
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="m-single-exchange-intro">
          <div>1. VIP过期，提示“提问数受限”，升级到GPT-4等都需要兑换码。</div>
          <div>
            2. 请加微信：
            <span
              className="m-weixin-code"
              onClick={() => handleCopy(wechatCode)}
            >
              {wechatCode}
            </span>
            ，获得兑换码。也可以扫描二维码添加微信。
          </div>
          <div>3. 会员每天可以提问100条</div>
          <div>
            4. 您可以
            <span
              onClick={() => handleJumpPage('/ai/single/me/share')}
              className="m-weixin-code"
            >
              邀请
            </span>
            其他人注册并购买兑换码，自己得到提成
          </div>
          <div>
            5. 通过
            <span
              onClick={() => handleJumpPage('/ai/single/me/share')}
              className="m-weixin-code"
            >
              分享
            </span>
            把二维码或链接分享给你的朋友，邀请他们注册，你和你的朋友都会自动获得更多的提问次数。每邀请一个用户注册你可以连续7天每天多提问10次。你的朋友可以一直每天多提问10次。
          </div>
          {wechatCode === 'xu1183391880' ? (
            <div>6. 另一种获得兑换码的方法：加入知识星球私信我获得兑换码</div>
          ) : null}
        </div>

        <div className="m-single-exchange-img-wrap">
          <Image
            src={wechatQRCode}
            className="m-single-exchange-img"
            alt={'图片'}
          ></Image>
        </div>
        {wechatCode === 'xu1183391880' ? (
          <div className="m-single-exchange-img-wrap">
            <Image
              src={xingqiu1}
              className="m-single-exchange-img"
              alt={'图片'}
            ></Image>
          </div>
        ) : null}
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetState(key, value) {
      dispatch({ type: 'SET_LIGHT_STATE', key, value })
    },
    onDispatch(action) {
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index))
