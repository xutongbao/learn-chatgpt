import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import Footer from './Footer'
import Home from './home/Index'
import Userlist from './userlist/Index'
import Me from './me/Index'
import useBrowserCheck from '../../../utils/hooks/useBrowserCheck'
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

export default Index
