import React from 'react'
import { Image } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import { Icon, SinglePageHeader } from '../../../../../components/light'
import moment from 'moment'
import './index.css'

function Index(props) {
  const { userInfo, handleAvatarClick, handleSendMessage } = useList(props)

  return (
    <>
      <div className="m-userlist-userinfo-wrap-box">
        <div className="m-userlist-userinfo-wrap">
          <div className="m-userlist-userinfo-main">
            <SinglePageHeader
              goBackPath="/ai/index/userlist"
              isBackTextVisible={false}
              title="用户信息"
            ></SinglePageHeader>
            <div className="m-userlist-userinfo-wrap">
              <div className="m-userlist-userinfo-header-wrap">
                <div className="m-userlist-userinfo-header">
                  {userInfo.avatarCdn ? (
                    <div onClick={handleAvatarClick}>
                      <Image
                        src={userInfo.avatarCdn}
                        className="m-userlist-userinfo-header-img"
                        alt={'图片'}
                      ></Image>
                    </div>
                  ) : (
                    <span className="m-userlist-userinfo-header-img"></span>
                  )}

                  <div className="m-userlist-userinfo-header-info">
                    <div className="m-userlist-userinfo-header-info-row1">
                      <span className="m-userlist-userinfo-header-username m-ellipsis">
                        {userInfo.nickname}
                      </span>
                      {userInfo.isVipStatus ? (
                        <Icon
                          name="vip"
                          className="m-userlist-userinfo-header-vip"
                          title="会员"
                        ></Icon>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="m-userlist-userinfo-header-due-date">
                  {userInfo.isVipStatus === true ? (
                    <div>
                      有效期至
                      {moment(userInfo.dueDate - 0).format('YYYY-MM-DD')}
                    </div>
                  ) : userInfo.isVipStatus === false ? (
                    <div>VIP已经过期</div>
                  ) : null}
                </div>
              </div>

              <div
                className="m-userlist-userinfo-btn-wrap"
                onClick={() => handleSendMessage()}
              >
                <Icon
                  name="chat"
                  className="m-userlist-userinfo-btn-icon"
                ></Icon>
                发消息
              </div>
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
