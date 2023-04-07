import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch } from 'react-router-dom'
import { Tabs, Tab, Box } from '@mui/material'
import useList from './useList'
import { Loading } from '../../../../components/light'
import { SinglePageHeader } from '../../../../components/light'

import './index.css'

function Index(props) {
  // eslint-disable-next-line
  const { routeDom, filterRouteArr, tabsValue, handleTabsChange, handleJumpPage } = useList(props)


  return (
    <div>
      <div className="m-single-wrap">
        <div className="m-single-inner">
          <SinglePageHeader goBackPath="/ai/index/me" isBackTextVisible={true}></SinglePageHeader>
          <Box sx={{ bgcolor: 'background.paper' }} className="m-single-tab-box">
            <Tabs
              value={tabsValue}
              onChange={(event, value) => handleTabsChange(event, value)}
              variant="scrollable"
              // scrollButtons={false}
              // allowScrollButtonsMobile={true}
              // centered={true}
              className="m-mui-tabs"
            >
              {filterRouteArr.map((item, index) => (<Tab key={index} id={`m-tab-${index}`} label={item.title} onClick={() => handleJumpPage(item)} />))}
            </Tabs>
          </Box>
          <Suspense fallback={<Loading isLazyLoading={true}></Loading>}>
            <Switch>{routeDom}</Switch>
          </Suspense>
        </div>
      </div>
    </div>
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
