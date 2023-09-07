import { Skeleton, Badge } from 'antd'
import { ImageViewer } from 'antd-mobile'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import moment from 'moment'
import './index.css'

function Index(props) {
  const {
    dataSource,
    currentImage,
    visible,
    isHasMore,
    handleSearch,
    handleAction,
    handleImageClick,
    setVisible,
  } = useList(props)
  return (
    <div id="scrollableDiv" className="m-h5-home-main-list">
      <InfiniteScroll
        dataLength={dataSource.length}
        next={handleSearch}
        refreshFunction={() => handleSearch({ page: 1, isRefresh: true })}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; 下拉刷新</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; 释放刷新</h3>
        }
        hasMore={isHasMore}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 3,
            }}
            active
            className="m-h5-lesson-play-skeleton"
          />
        }
        // endMessage={<Divider plain>已经到底啦~</Divider>}
        scrollableTarget="scrollableDiv"
      >
        {dataSource.map((item, index) => (
          <div key={index}>
            <div
              className="m-single-ai-user-list-wrap-wrap"
              onClick={() => handleAction(item)}
            >
              <div className="m-single-ai-user-list-wrap">
                <Badge count={item.unReadCount}>
                  <img
                    className="m-single-ai-user-list-avatar"
                    src={item.avatar}
                    alt="头像"
                    onClick={(e) => handleImageClick(e, item)}
                  ></img>
                </Badge>
                <div className="m-single-ai-user-list-user-wrap">
                  <div className="m-single-ai-user-list-user-name-wrap">
                    <div className="m-single-ai-user-list-user-name m-ellipsis">
                      {item.name}
                    </div>
                    <div className="m-single-ai-user-list-btn-wrap">
                      {item.createTime
                        ? moment(item.createTime - 0).format('MM-DD HH:mm:ss')
                        : ''}
                    </div>
                  </div>
                  <div className="m-single-ai-user-list-user-fans-count m-ellipsis">
                    {item.intro}
                  </div>
                </div>
              </div>
              {index !== dataSource.length - 1 ? (
                <div className="m-single-ai-user-list-divider"></div>
              ) : null}
            </div>
          </div>
        ))}
      </InfiniteScroll>
      <ImageViewer
        image={currentImage}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      ></ImageViewer>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
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
