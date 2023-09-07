import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Footer from './Footer'
import Home from './home/Index'
import Userlist from './userlist/Index'
import Me from './me/Index'
import useBrowserCheck from '../../../utils/hooks/useBrowserCheck/useBrowserCheck'
import { handleLogin } from '../../../api/socket'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import './index.css'

function Index(props) {
  const { browserCheckHandleModalVisible, browserCheckGetDom } =
    useBrowserCheck({
      ...props,
    })

  useEffect(() => {
    browserCheckHandleModalVisible()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    handleLogin()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="m-h5-wrap-box">
      <div className="m-h5-wrap">
        <div className="m-h5-main">
          <Switch>
            <Route path="/ai/index/home" component={Home}></Route>
            <Route path="/ai/index/userlist" component={Userlist}></Route>
            <Route path="/ai/index/me" component={Me}></Route>
          </Switch>
        </div>
        <Footer></Footer>
      </div>
      {browserCheckGetDom()}
    </div>
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
