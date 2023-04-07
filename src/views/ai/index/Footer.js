import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '../../../components/light'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

function Footer(props) {
  const {
    location: { pathname },
  } = props
  let pageType = '1' //1消息，2通讯录,3我的
  if (pathname === '/ai/index/home/chatList') {
    pageType = '1'
  } else if (pathname === '/ai/index/userlist') {
    pageType = '2'
  } else if (pathname === '/ai/index/me') {
    pageType = '3'
  }

  const getIcon = ({ myPageType, iconName }) => {
    if (pageType === myPageType) {
      return `${iconName}-fill`
    } else {
      return iconName
    }
  }

  return (
    <div className="m-h5-footer">
      <NavLink to="/ai/index/home" className="m-h5-footer-item">
        <Icon
          name={getIcon({ myPageType: '1', iconName: 'chat' })}
          className="m-h5-footer-icon"
        ></Icon>
        <div className="m-h5-footer-text">消息</div>
      </NavLink>
      <NavLink to="/ai/index/userlist" className="m-h5-footer-item">
        <Icon
          name={getIcon({ myPageType: '2', iconName: 'userlist' })}
          className="m-h5-footer-icon"
        ></Icon>
        <div className="m-h5-footer-text">通讯录</div>
      </NavLink>
      <NavLink to="/ai/index/me" className="m-h5-footer-item">
        <Icon
          name={getIcon({ myPageType: '3', iconName: 'people' })}
          className="m-h5-footer-icon"
        ></Icon>
        <div className="m-h5-footer-text">我的</div>
      </NavLink>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(['light', 'userInfo']).toJS(),
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Footer))
