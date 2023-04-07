import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Skeleton, Select } from 'antd'
import useList from './useList'
import './index.css'

const { Option } = Select

function Index(props) {
  // eslint-disable-next-line
  const { isLoading, handleFinish, handleFinishFailed } =
    useList(props)
  let modelTypeHistory = localStorage.getItem('modelType')
    ? localStorage.getItem('modelType')
    : '1'
  const [modelType, setModelType] = useState(modelTypeHistory)
  let promptTypeHistory = localStorage.getItem('promptType')
    ? localStorage.getItem('promptType')
    : '1'
  const [promptType, setPromptType] = useState(promptTypeHistory)

  const handleChangeModel = (value) => {
    setModelType(value)
    localStorage.setItem('modelType', value)
  }

  const handleChangePromptType = (value) => {
    setPromptType(value)
    localStorage.setItem('promptType', value)
  }

  return (
    <>
      <div className="m-single-page-space m-form-bottom">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 17 }}
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
              <div id="m-modal-form-info" className="m-modal-form-info">
                <div>选择Model</div>
                <Select
                  placeholder="请选择Model"
                  style={{ width: 240 }}
                  value={modelType}
                  onChange={handleChangeModel}
                  className="m-space"
                  getPopupContainer={() => document.getElementById('m-modal-form-info')}
                >
                  <Option value="1">text-davinci-003</Option>
                  <Option value="2">code-davinci-002</Option>
                </Select>
                <div>选择语言</div>
                <Select
                  placeholder="请选择语言"
                  style={{ width: 240 }}
                  value={promptType}
                  onChange={handleChangePromptType}
                  className="m-space"
                  getPopupContainer={() => document.getElementById('m-modal-form-info')}
                >
                  <Option value="1">自然语言</Option>
                  <Option value="2">Javascript</Option>
                </Select>
              </div>
            </>
          )}
        </Form>
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
