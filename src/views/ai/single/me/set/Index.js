import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Switch } from 'antd'
import useList from './useList'
import { Descriptions, Badge } from 'antd'
import './index.css'

function Index(props) {
  const {
    codeHighLight,
    wideScreen,
    subscribe,
    socketLoginAlarm,
    handleCodeHighLight,
    handleWideScreen,
    handleSubscribe,
    handleSocketLoginAlarm,
  } = useList(props)
  const [isShowUpate, setIsShowUpdate] = useState(false)
  let lastestVersion = localStorage.getItem('lastestVersion')
  let appVersion = localStorage.getItem('appVersion')

  const handleVersion = () => {
    if (lastestVersion && appVersion) {
      let lastestVersionNum = lastestVersion.replace(/\./g, '') - 0
      let appVersionNum = appVersion.replace(/\./g, '') - 0
      if (lastestVersionNum > appVersionNum) {
        setIsShowUpdate(true)
      } else {
        setIsShowUpdate(false)
      }
    }
  }

  useEffect(() => {
    if (window.platform === 'rn') {
      handleVersion()
    }
    // eslint-disable-next-line
  }, [])

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
          <div className="m-single-set-divider"></div>
          <div className="m-single-set-row">
            <div className="m-single-set-label">上线提醒</div>
            <div className="m-single-set-switch">
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={socketLoginAlarm}
                onChange={handleSocketLoginAlarm}
              />
            </div>
          </div>
        </div>
        {window.platform === 'rn' ? (
          <div className="m-single-set-update-wrap">
            <Descriptions title="版本信息">
              <Descriptions.Item label="当前版本">
                {appVersion}
              </Descriptions.Item>
              {isShowUpate ? (
                <Descriptions.Item label="最新版本">
                  {lastestVersion}
                </Descriptions.Item>
              ) : null}
              {isShowUpate ? (
                <Descriptions.Item label="最新版本下载链接">
                  {/* eslint-disable-next-line */}
                  <a
                    href={`https://chat.xutongbao.top/#/single/download`}
                    className="m-download-text"
                  >
                    https://chat.xutongbao.top/#/single/download
                  </a>
                  <Badge count={1} />
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </div>
        ) : null}
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
    isRNGotToken: state.getIn(['light', 'isRNGotToken']),
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
