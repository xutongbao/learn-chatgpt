import React, { useEffect } from 'react'
import { Button, Input, Dropdown, Form, Popover } from 'antd'
import { connect } from 'react-redux'
import { Icon, UploadImgToCNDMobile } from '../../../components/light'
import useList from './useListRegister'
import useBrowserCheck from '../../../utils/hooks/useBrowserCheck/useBrowserCheck'
import './index.css'

function Register(props) {
  const {
    form,
    initValues,
    captcha,
    count,
    isSendEmail,
    routerSearchObj,
    handleFinish,
    handleFinishFailed,
    handleAction,
    getCaptcha,
    checkEmail,
    handleSendEmail,
    handleGuest,
    handleJumpPage,
  } = useList(props)

  const { browserCheckHandleModalVisible, browserCheckGetDom } =
    useBrowserCheck({
      ...props,
    })

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

  useEffect(() => {
    browserCheckHandleModalVisible()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="m-login-wrap">
      <div className="m-login-header">
        <span className="m-login-logo"></span>
        <span className="m-login-divider"></span>
        <span className="m-login-header-text">注册</span>
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
                addonAfter={
                  <Popover
                    placement="left"
                    title={'提示'}
                    content={'某些用户的邮件会发送到垃圾箱'}
                    trigger="click"
                  >
                    <Icon
                      name="help"
                      className="m-ai-register-addon-after"
                    ></Icon>
                  </Popover>
                }
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
              name="nickname"
              rules={[
                {
                  required: true,
                  message: '请输入昵称！',
                },
                {
                  min: 2,
                  message: '昵称不能小于2位',
                },
                {
                  max: 10,
                  message: '昵称不能大于10位',
                },
              ]}
            >
              <Input
                maxLength={10}
                addonBefore="昵称"
                onPressEnter={(e) => e.preventDefault()}
              />
            </Form.Item>
            <Form.Item label="头像" name="avatar">
              <UploadImgToCNDMobile
                type={'edit'}
                imgDir={`img/userAvatar`}
                filePrefix={'m-register'}
                uploadType={2}
              ></UploadImgToCNDMobile>
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
              label=""
              name="inviter"
              className={`${routerSearchObj.showName === '1' ? '' : 'm-hide'}`}
            >
              <Input disabled addonBefore="邀请人" />
            </Form.Item>
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
                注册
              </Button>
            </Form.Item>
          </div>
        </Form>
        <div className="m-ai-register-btn-wrap">
          <Button
            type="link"
            className="m-ai-register-btn-text"
            onClick={() => handleJumpPage('/ai/login')}
          >
            登录
          </Button>
          <Button
            type="link"
            className="m-login-btn-text"
            onClick={handleGuest}
          >
            游客
          </Button>
        </div>
      </div>
      {browserCheckGetDom()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)
