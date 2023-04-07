import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Form, Input, Skeleton, Select, Space, Tooltip } from 'antd'
import { UploadImgToCNDMobile, Icon } from '../../../../../components/light'
import useList from './useList'
import useSelectAvatar from './useSelectAvatar'
import './index.css'

const { Option } = Select

function Index(props) {
  // eslint-disable-next-line
  const {
    form,
    initValues,
    isLoading,
    avatarList,
    handleFinish,
    handleFinishFailed,
    handleChangeAvatarSelect,
    handleSelectAvatar,
  } = useList(props)

  const { selectAvatarHandleModalVisible, selectAvatarGetDom } =
    useSelectAvatar({
      ...props,
      handleSelectAvatar,
    })

  return (
    <>
      <div className="m-single-page-space m-form-bottom m-ai-edit-userinfo-wrap">
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 17 }}
          initialValues={{ ...initValues }}
          scrollToFirstError={true}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          {isLoading ? (
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
              className="m-h5-lesson-play-skeleton"
            />
          ) : (
            <>
              <div id="m-modal-form-info" className="m-modal-form-info ">
                <Form.Item label="头像">
                  <Space>
                    <Form.Item noStyle name="avatar">
                      <UploadImgToCNDMobile
                        type={'edit'}
                        imgDir={`img/userAvatar`}
                        filePrefix={initValues.uid}
                        imgUrlCnd={initValues.avatarCdn}
                        uploadType={2}
                      ></UploadImgToCNDMobile>
                    </Form.Item>
                    <Tooltip title="可以选择你喜欢的头像，但是免费提问的次数会少些">
                      <Button type="link">无法上传头像?</Button>
                    </Tooltip>
                    <Button onClick={selectAvatarHandleModalVisible}>
                      选择头像
                    </Button>
                  </Space>
                </Form.Item>
                <Form.Item label="选择头像" name="avatarSelect" className='m-hide'>
                  <Select
                    placeholder="不推荐选择，请上传头像"
                    allowClear
                    getPopupContainer={() =>
                      document.getElementById('m-modal-form-info')
                    }
                    onChange={handleChangeAvatarSelect}
                  >
                    {avatarList.map((item) => (
                      <Option value={item.avatar} key={item.id}>
                        <img
                          src={item.avatar}
                          className="m-ai-edit-userinfo-select-avatar-img"
                          alt="头像"
                        ></img>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="昵称"
                  name="nickname"
                  rules={[
                    {
                      required: true,
                      message: '请输入昵称！',
                    },
                  ]}
                >
                  <Input maxLength={20} />
                </Form.Item>
              </div>
              <Form.Item
                wrapperCol={{ offset: 4, span: 17 }}
                className="m-modal-footer"
              >
                <>
                  <Button type="primary" htmlType="submit" className="m-space">
                    <Icon name="submit" className="m-tool-btn-icon"></Icon>
                    提交
                  </Button>
                  <Button
                    className="m-space"
                    onClick={() => {
                      form.resetFields()
                    }}
                  >
                    <Icon name="reset" className="m-tool-btn-icon"></Icon>
                    重置
                  </Button>
                </>
              </Form.Item>
            </>
          )}
        </Form>
        {selectAvatarGetDom()}
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
