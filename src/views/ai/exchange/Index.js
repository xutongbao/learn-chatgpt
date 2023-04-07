import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader } from '../../../components/light'
import Exchange from '../single/me/exchange/Index'

import './index.css'

function Index(props) {

  return (
    <>
      <SinglePageHeader goBackPath="/ai/chat"></SinglePageHeader>
      <Exchange></Exchange>
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
