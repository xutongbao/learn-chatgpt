import { Divider, Skeleton } from 'antd'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'

function Index(props) {
  const {
    dataSource,
    playedIndexArr,
    isHasMore,
    handleSearch,
    formatLessonTime,
  } = useList(props)
  return (
    <div id="scrollableDiv" className="m-h5-home-main-list">
      <InfiniteScroll
        dataLength={dataSource.length}
        next={handleSearch}
        refreshFunction={() => handleSearch({ isRefresh: true })}
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
        endMessage={<Divider plain>已经到底啦~</Divider>}
        scrollableTarget="scrollableDiv"
      >
        {dataSource.map((item, index) => (
          <div key={index} id={`player-item-${index}`}>
            <div className="m-h5-lesson-play-info">
              <div className="m-h5-lesson-play-info-course-wrap">
                <img
                  className="m-h5-lesson-play-info-avatar"
                  src={`http://static.xutongbao.top/img/logo.png`}
                  alt="头像"
                ></img>
                <div className="m-h5-lesson-play-info-course-name">
                  {item.courseName}
                </div>
              </div>
              <div className="m-h5-lesson-play-info-lesson-wrap">
                <div className="m-h5-lesson-play-info-lesson-name">
                  {item.name}
                </div>
              </div>
            </div>
            <div className="m-h5-lesson-play-player-wrap">
              <div
                id={`player-${index}`}
                className="m-h5-lesson-play-player"
              ></div>
              {playedIndexArr.includes(index) ? null : (
                <div>
                  <div className="m-h5-lesson-play-player-lesson-time">
                    {formatLessonTime(item.lessonTime)}
                  </div>
                </div>
              )}
            </div>
            {index < dataSource.length - 1 ? (
              <div className="m-h5-lesson-play-divider"></div>
            ) : null}
          </div>
        ))}
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
