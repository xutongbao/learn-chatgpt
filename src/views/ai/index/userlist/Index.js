import { Divider, Skeleton } from 'antd'
import { ImageViewer } from 'antd-mobile'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LazyLoad from 'react-lazy-load'
import useList from './useList'
import './index.css'

function Index(props) {
  const { dataSource, isHasMore, currentImage, visible, setVisible, handleSearch, handleAvatarClick, handleImageClick } =
    useList(props)
  return (
    <>
      <div className="m-h5-home-header">通讯录</div>
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
          endMessage={
            dataSource.length === 0 ? null : (
              <Divider plain>已经到底啦~</Divider>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          {dataSource.map((item, index) => (
            <div key={index} id={`player-item-${index}`}>
              <div className="m-single-ai-user-list-middle-wrap-wrap">
                <LazyLoad>
                  <div className="m-single-user-list-wrap">
                    <div onClick={handleAvatarClick} className='m-single-ai-play-list-item-img-wrap'>
                      <img
                        className="m-single-ai-user-list-middle-avatar"
                        src={item.avatarCdn}
                        alt="头像"
                        onClick={(e) => handleImageClick(e, item)}
                      ></img>
                    </div>
                    <div className="m-single-user-list-user-wrap">
                      <div className="m-single-user-list-user-name m-ellipsis">
                        {item.nickname}
                      </div>
                    </div>
                  </div>
                </LazyLoad>
                {index !== dataSource.length - 1 ? (
                  <div className="m-single-ai-user-list-middle-divider"></div>
                ) : null}
              </div>
            </div>
          ))}
          {dataSource.length === 0 ? (
            // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        <ImageViewer
        image={currentImage}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      />
      </div>
    </>
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
