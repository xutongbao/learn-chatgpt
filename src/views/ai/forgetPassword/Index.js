import React from 'react'
import { Button, Input, Dropdown, Form } from 'antd'
import { connect } from 'react-redux'
import { Icon } from '../../../components/light'
import useList from './useList'
import './index.css'

function Index(props) {
  const {
    form,
    initValues,
    captcha,
    count,
    isSendEmail,
    handleFinish,
    handleFinishFailed,
    handleAction,
    getCaptcha,
    checkEmail,
    handleSendEmail,
  } = useList(props)

  const handleJump = (path) => {
    props.history.push(path)
  }

  const getItems = () => {
    const items = [
      {
        key: '1',
        label: '微信群',
        onClick: () => handleAction({ type: 'joinGroup' }),
      },
      {
        key: '2',
        label: '联系我们',
        onClick: () => handleAction({ type: 'contactUs' }),
      },
    ]
    return items
  }

  return (
    <div className="m-login-wrap">
      <div className="m-login-header">
        <span className="m-login-logo"></span>
        <span className="m-login-divider"></span>
        <span className="m-login-header-text">忘记密码</span>
        <Dropdown
          menu={{ items: getItems() }}
          className="m-ai-dropdown"
          trigger={['click', 'hover']}
        >
          <Icon name="menu" className="m-ai-menu-btn"></Icon>
        </Dropdown>
      </div>
      <div className="m-login m-ai-register h5">
        <Form
          form={form}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          initialValues={{ ...initValues }}
          scrollToFirstError={true}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <div id="m-modal-form-info" className="m-modal-form-info">
            <Form.Item
              label=""
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱！',
                },
                {
                  validator: (e, value) => checkEmail(e, value),
                },
              ]}
            >
              <Input
                addonBefore="邮箱"
                onPressEnter={(e) => e.preventDefault()}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="emailCode"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱验证码！',
                },
                {
                  len: 6,
                  message: '邮箱验证码为6位',
                },
              ]}
            >
              <Input
                addonBefore="邮箱验证码"
                addonAfter={
                  <div>
                    <Button
                      type="link"
                      size="small"
                      disabled={isSendEmail}
                      className="m-ai-register-send-email-btn"
                      onClick={handleSendEmail}
                    >
                      {isSendEmail ? (
                        <span>{count}秒后重新发送</span>
                      ) : (
                        <span>发送</span>
                      )}
                    </Button>
                  </div>
                }
                onPressEnter={(e) => e.preventDefault()}
              />
            </Form.Item>

            <Form.Item
              label=""
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  min: 6,
                  message: '密码不能小于6位',
                },
                {
                  max: 20,
                  message: '密码不能大于10位',
                },
              ]}
            >
              <Input.Password
                addonBefore="密码"
                onPressEnter={(e) => e.preventDefault()}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入图形验证码！',
                },
                {
                  min: 4,
                  message: '图形验证码不能小于4位',
                },
              ]}
            >
              <Input maxLength={6} addonBefore="图形验证码" />
            </Form.Item>
            <div className="m-login-row">
              <div
                className="m-ai-login-code"
                onClick={getCaptcha}
                dangerouslySetInnerHTML={{ __html: captcha }}
              ></div>
            </div>
            <Form.Item
              wrapperCol={{ offset: 0, span: 24 }}
              className="m-modal-footer"
            >
              <Button
                type="primary"
                htmlType="submit"
                className="m-space m-single-exchange-btn"
                style={{ width: '100%' }}
              >
                修改密码
              </Button>
            </Form.Item>
          </div>
        </Form>
        <div className="m-ai-register-btn-wrap">
          <Button
            type="link"
            className="m-ai-register-btn-text"
            onClick={() => handleJump('/ai/login')}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Index)
