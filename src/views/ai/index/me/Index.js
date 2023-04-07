import React from 'react'
import { Image, Skeleton } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import { Icon } from '../../../../components/light'
import moment from 'moment'
import './index.css'

function Index(props) {
  const {
    isLoading,
    userInfo,
    nickname,
    groupButton1,
    handleQuit,
    handleJumpPage,
    handleAvatarClick,
  } = useList(props)

  return (
    <>
      <div className="m-h5-me-wrap">
        <div
          className="m-h5-me-header-wrap"
          onClick={() => handleJumpPage('/ai/single/me/editUserInfo')}
        >
          <div className="m-h5-me-header">
            {userInfo.avatarCdn ? (
              <div onClick={handleAvatarClick}>
                <Image
                  src={userInfo.avatarCdn}
                  className="m-h5-me-header-img"
                  alt={'图片'}
                ></Image>
              </div>
            ) : (
              <span className="m-h5-me-header-img"></span>
            )}

            <div className="m-h5-me-header-info">
              <div className="m-h5-me-header-info-row1">
                <span className="m-h5-me-header-username m-ellipsis">
                  {nickname}
                </span>
                {userInfo.isVipStatus ? (
                  <Icon
                    name="vip"
                    className="m-ai-me-header-vip"
                    title="会员"
                  ></Icon>
                ) : null}
              </div>

              <div className="m-h5-me-header-info-row2">
                <div className="m-h5-me-header-follow m-ellipsis">
                  账号：{localStorage.getItem('username')}
                </div>
              </div>
            </div>
          </div>
          <div className="m-h5-me-header-due-date">
            {userInfo.isVipStatus === true ? (
              <div>
                有效期至{moment(userInfo.dueDate - 0).format('YYYY-MM-DD')}
              </div>
            ) : userInfo.isVipStatus === false ? (
              <div>VIP已经过期</div>
            ) : null}
          </div>
          <Icon name="arrow" className="m-ai-me-user-edit-icon"></Icon>
        </div>

        {Array.isArray(groupButton1) && groupButton1.length > 0 ? (
          <div className="m-h5-me-group-wrap">
            {groupButton1
              .filter((item) => item.isVisible)
              .map((item) => (
                <div
                  className="m-h5-me-group-item"
                  key={item.path}
                  onClick={() => handleJumpPage(item.path)}
                >
                  <Icon
                    name={item.iconName}
                    className="m-h5-me-group-item-icon"
                  ></Icon>
                  <div className="m-h5-me-group-item-title">{item.title}</div>
                </div>
              ))}
          </div>
        ) : null}
        {isLoading ? (
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
            className="m-h5-lesson-play-skeleton"
          />
        ) : null}

        <div className="m-h5-me-btn-wrap" onClick={() => handleQuit()}>
          退出登录
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
