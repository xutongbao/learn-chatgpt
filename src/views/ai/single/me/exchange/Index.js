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
    handleSendMessage,
  } = useList(props)

  const { wechatCode, wechatQRCode } = getAdminInfo()

  return (
    <>
      <div className="m-single-page-space">
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
            <div id="m-modal-form-info" className="m-modal-form-info-exchange">
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
              <Button onClick={handleSendMessage}>
                人工客服
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="m-single-exchange-intro">
          <div>
            加微信：
            <span
              className="m-weixin-code"
              onClick={() => handleCopy(wechatCode)}
            >
              {wechatCode}
            </span>
            ，免费获得兑换码，成为会员，尽情使用ChatGPT和AI绘画（Stable Diffusion）！
          </div>
        </div>
        <div className="m-single-exchange-img-wrap">
          <Image
            src={wechatQRCode}
            className="m-single-exchange-img"
            alt={'图片'}
          ></Image>
        </div>
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
