import { Divider, Skeleton, Empty } from 'antd'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import './index.css'

function Index(props) {
  const { dataSource, isHasMore, handleSearch, handleFollow } = useList(props)
  return (
    <div id="scrollableDiv" className="m-single-list">
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
        endMessage={ dataSource.length === 0 ? null : <Divider plain>已经到底啦~</Divider> }
        scrollableTarget="scrollableDiv"
      >
        {dataSource.map((item, index) => (
          <div key={index} id={`player-item-${index}`}>
            <div className="m-single-user-list-wrap-wrap">
              <div className="m-single-user-list-wrap">
                <img
                  className="m-single-user-list-avatar"
                  src={item.userAvatarCdn}
                  alt="头像"
                ></img>
                <div className="m-single-user-list-user-wrap">
                  <div className="m-single-user-list-user-name m-ellipsis">
                    {item.nickname}
                  </div>
                  <div className="m-single-user-list-user-fans-count">
                    {item.followCount}粉丝
                  </div>
                </div>
                <div className="m-single-user-list-btn-wrap">
                  <span
                    className={`m-single-user-list-btn ${
                      item.isFollow ? 'followed' : 'unfollow'
                    } `}
                    onClick={() => handleFollow(item)}
                  >
                    {item.isFollow ? '已关注' : '关注'}
                  </span>
                </div>
              </div>
              {index !== dataSource.length - 1 ? (
                <div className="m-single-user-list-divider"></div>
              ) : null}
            </div>
          </div>
        ))}
        {
          dataSource.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />) : null
        }
      </InfiniteScroll>
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
