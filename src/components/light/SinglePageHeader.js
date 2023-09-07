import React from 'react'
import Icon from './Icon'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'antd'

function Index(props) {
  const { title = '', isBackTextVisible = false, onClick } = props
  const handleBack = () => {
    if (onClick) {
      onClick()
    } else {
      if (props.goBackPath) {
        props.history.push(props.goBackPath)
      } else {
        props.history.goBack()
      }
    }
  }
  return (
    <>
      {window.platform === 'rn' ? null : (
        <div className="m-single-page-header-wrap">
          <Icon
            name="arrow"
            className="m-single-page-header-back"
            onClick={handleBack}
          ></Icon>
          <div className="m-single-page-header-absolute-box">
            {props.homeMsgCount !== '' && props.homeMsgCount > 0 ? (
              <Badge
                count={props.homeMsgCount}
                style={{ backgroundColor: '#999' }}
                className={`m-single-page-header-badge`}
                onClick={handleBack}
              >
                <div
                  className={`m-single-page-header-badge-empty-dom ${
                    isBackTextVisible ? '' : 'withoutBackText'
                  }`}
                ></div>
              </Badge>
            ) : null}
            {isBackTextVisible ? (
              <span
                className="m-single-page-header-back-text"
                onClick={handleBack}
              >
                返回
              </span>
            ) : null}
          </div>
          <div className="m-single-page-header-title">{title}</div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    homeMsgCount: state.getIn(['light', 'homeMsgCount']),
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
