import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import { SinglePageHeader } from '../../../../../components/light'
import LazyLoad from 'react-lazy-load'

import 'swiper/css'
import 'swiper/css/pagination'
import './index.css'

function Index(props) {
  const { models, handleModelClick } = useList(props)
  return (
    <div className="m-welcome-model-list-wrap-box">
      <div className={`m-welcome-model-list-wrap-box-inner`}>
        <div className="m-welcome-model-list-wrap">
          <SinglePageHeader
            // goBackPath="/ai/index/home/chatList"
            title={'绘图大模型'}
          ></SinglePageHeader>
          <div className="m-welcome-model-list-card-wrap">
            {Array.isArray(models) && models.length > 0
              ? models.map((item) => (
                  <div
                    key={item.id}
                    className={`m-welcome-model-list-card-item`}
                  >
                    <div className={`m-welcome-model-list-card-item-row`}>
                      <LazyLoad className="m-welcome-model-list-card-item-img-wrap">
                        <img
                          src={item.avatar}
                          className="m-welcome-model-list-card-item-img"
                          alt="头像"
                        ></img>
                      </LazyLoad>
                      <div className="m-welcome-model-list-card-item-info-wrap withBorder">
                        <div className="m-welcome-model-list-card-item-info">
                          <div
                            className="m-welcome-model-list-card-item-title m-ellipsis"
                            title={item.name}
                          >
                            {item.name}
                          </div>
                          <div className="m-welcome-model-list-card-item-sub-title">
                            {item.id}
                          </div>
                        </div>
                        <div
                          className="m-welcome-model-list-card-item-btn"
                          onClick={() => handleModelClick(item)}
                        >
                          画同款
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
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
