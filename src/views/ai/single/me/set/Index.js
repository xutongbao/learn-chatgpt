import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Switch } from 'antd'
import useList from './useList'
import './index.css'

function Index(props) {
  const {
    codeHighLight,
    wideScreen,
    subscribe,
    handleCodeHighLight,
    handleWideScreen,
    handleSubscribe,
  } = useList(props)
  return (
    <>
      <div className="m-single-page-set">
        <div className="m-single-set-group">
          <div className="m-single-set-row">
            <div className="m-single-set-label">代码高亮</div>
            <div className="m-single-set-switch">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={codeHighLight}
                onChange={handleCodeHighLight}
              />
            </div>
          </div>
          <div className="m-single-set-divider"></div>
          <div className="m-single-set-row">
            <div className="m-single-set-label">宽屏模式</div>
            <div className="m-single-set-switch">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={wideScreen}
                onChange={handleWideScreen}
              />
            </div>
          </div>
          <div className="m-single-set-divider"></div>
          <div className="m-single-set-row">
            <div className="m-single-set-label">邮件订阅</div>
            <div className="m-single-set-switch">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={subscribe}
                onChange={handleSubscribe}
              />
            </div>
          </div>
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
