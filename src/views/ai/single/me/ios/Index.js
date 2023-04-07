import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Image } from 'antd'
import './index.css'

function Index(props) {
  return (
    <>
      <div className="m-single-page-space">
        <div className="m-single-exchange-intro">
          <div>1.使用Safari浏览器打开本网站</div>
          <div className="m-single-ios-img-wrap">
            <Image
              src={
                'http://static.xutongbao.top/img/m-ios-step1.png?time=20230302'
              }
              className="m-single-ios-img"
              preview={false}
              alt={'图片'}
            ></Image>
            <Image
              src={
                'http://static.xutongbao.top/img/m-ios-step2.png?time=20230302'
              }
              className="m-single-ios-img"
              preview={false}
              alt={'图片'}
            ></Image>
            <Image
              src={
                'http://static.xutongbao.top/img/m-ios-step3.png?time=20230302'
              }
              className="m-single-ios-img"
              preview={false}
              alt={'图片'}
            ></Image>
            <Image
              src={
                'http://static.xutongbao.top/img/m-ios-step4.png?time=20230302'
              }
              className="m-single-ios-img"
              preview={false}
              alt={'图片'}
            ></Image>
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
