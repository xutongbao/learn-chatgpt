import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Image } from 'antd'
import useList from './useList'
import { getAdminInfo } from '../../../../../utils/tools'

import './index.css'

function Index(props) {
  const { handleCopy } = useList(props)

  const { wechatCode, wechatQRCode } = getAdminInfo()

  return (
    <>
      <div className="m-single-page-space m-form-bottom">
        <div className="m-single-exchange-intro">
          <div>
            关闭聊天记录自动同步到群聊，在群聊中隐身，请联系管理员，微信：
            <span
              className="m-weixin-code"
              onClick={() => handleCopy(wechatCode)}
            >
              {wechatCode}
            </span>
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
