import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader } from '../../../../../components/light'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider, Skeleton } from 'antd'
import useList from './useList'
import LazyLoad from 'react-lazy-load'

import './index.css'

function Index(props) {
  const {
    dataSource,
    isHasMore,
    columnCount,
    handleSearch,
    handleImgDrawSameStyleClick,
  } = useList(props)
  return (
    <div className="m-ai-img-wrap-box">
      <div className={`m-ai-img-wrap-chat`}>
        <SinglePageHeader title="AI绘画作品展示"></SinglePageHeader>
        <div className="m-ai-img-list" id="scrollableDiv">
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
            endMessage={
              dataSource.length === 0 ? null : (
                <Divider plain>已经到底啦~</Divider>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="m-ai-img-list-inner">
              {Array.from({ length: columnCount }, () => '').map(
                (item, index) => (
                  <div className="m-ai-img-list-column" key={index}>
                    {dataSource
                      .filter(
                        (item, dataSourceIndex) =>
                          dataSourceIndex % columnCount === index
                      )
                      .map((item) => (
                        <div key={item.imgUid}>
                          <LazyLoad className="m-ai-img-lazy-load">
                            <img
                              src={item.imgUrlCdn}
                              className="m-ai-img"
                              alt="图片"
                              onClick={() => handleImgDrawSameStyleClick(item)}
                            ></img>
                          </LazyLoad>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>

            {dataSource.length === 0 ? (
              <Skeleton
                avatar
                paragraph={{
                  rows: 3,
                }}
                active
                className="m-h5-lesson-play-skeleton"
              />
            ) : null}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
    isRNGotToken: state.getIn(['light', 'isRNGotToken']),
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
