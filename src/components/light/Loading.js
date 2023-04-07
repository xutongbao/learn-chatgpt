import React from 'react'
import ReactDOM from 'react-dom'
import { Spin } from 'antd'
import { connect } from 'react-redux'

function Loading(props) {
  const { isLoading, isLazyLoading } = props
  return ReactDOM.createPortal(
    <div
      className={'m-loading ' + (isLoading || isLazyLoading ? 'active' : '')}
    >
      <Spin className="m-spin" />
    </div>,
    document.body
  )
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.getIn(['light', 'isLoading']),
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

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
