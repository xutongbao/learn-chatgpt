import React, { Suspense, lazy, useEffect } from 'react'
import { connect } from 'react-redux'
import { initAudio } from '../api/socket'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  withRouter,
} from 'react-router-dom'
import VConsole from 'vconsole'
//自己开发的公共组件会再此处全部引入
import { ErrorBoundary, Loading } from '../components/light'
const NotFound = lazy(() => import('../views/ai/notFound/NotFound'))

function Router({ extraRouter, h5Router }) {
  window.reactRouter = useHistory()
  if (
    localStorage.getItem('isDebuger') === '1' ||
    (window.platform === 'rn' && window.reactNative.RN_REACT_APP_MODE === 'dev')
  ) {
    // eslint-disable-next-line
    const vConsole = new VConsole()
  }
  let redirectPath = '/ai/login'
  let href = document.location.href
  if (href.includes('chat.') || href.includes('localhost')) {
    redirectPath = '/ai/index/home/chatList'
  }
  useEffect(() => {
    initAudio()
  }, [])
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loading isLazyLoading={true}></Loading>}>
          <Switch>
            <Redirect from="/" to={redirectPath} exact></Redirect>
            <Redirect
              from="/ai/index/home"
              to="/ai/index/home/chatList"
              exact
            ></Redirect>
            {extraRouter.toJS().map((item) => (
              <Route
                key={item.path}
                path={item.path}
                component={item.component}
              ></Route>
            ))}
            {h5Router.toJS().map((item) => (
              <Route
                key={item.path}
                path={item.path}
                exact={item.exact === true ? true : false}
                component={item.component}
              ></Route>
            ))}
            <Route path="/404" component={NotFound}></Route>
            <Redirect from="*" to="/404" exact></Redirect>
          </Switch>
        </Suspense>
      </ErrorBoundary>
      <Loading></Loading>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    extraRouter: state.getIn(['light', 'extraRouter']),
    h5Router: state.getIn(['light', 'h5Router']),
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Router))
