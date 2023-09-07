import { Divider, Skeleton, Input, AutoComplete, Empty, Tag } from 'antd'
import { ImageViewer } from 'antd-mobile'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LazyLoad from 'react-lazy-load'
import useList from './useList'
import useUserInfo from '../../../../utils/hooks/useUserInfo/Index'
import './index.css'

const { Search } = Input

function Index(props) {
  const {
    dataSource,
    isHasMore,
    currentImage,
    visible,
    searchNickname,
    searchHistory,
    isLoading,
    setVisible,
    handleSearch,
    handleSearchNicknameChange,
  } = useList(props)

  const { userInfoShowModel, userInfoGetDom } = useUserInfo()
  return (
    <>
      <div className="m-h5-home-header">通讯录</div>
      <div className="m-userlist-list-wrap">
        <div className="m-userlist-search">
          <AutoComplete
            style={{ width: 300 }}
            options={searchHistory}
            onSelect={(value, e) =>
              handleSearch({
                page: 1,
                isRefresh: true,
                searchNicknameCurrent: value,
              })
            }
          >
            <Search
              placeholder="请输入"
              value={searchNickname}
              onChange={handleSearchNicknameChange}
              onSearch={(value, e) =>
                handleSearch({
                  page: 1,
                  isRefresh: true,
                  searchNicknameCurrent: value,
                })
              }
              allowClear
              loading={false}
              enterButton="搜索"
            />
          </AutoComplete>
        </div>
        <div id="scrollableDiv" className="m-userlist-list">
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
                <div className="m-userlist-ai-user-list-middle-wrap-wrap">
                  <LazyLoad>
                    <div
                      className="m-userlist-user-list-wrap"
                      onClick={() => userInfoShowModel(item)}
                    >
                      <div className="m-userlist-ai-play-list-item-img-wrap">
                        <img
                          className="m-userlist-ai-user-list-middle-avatar"
                          src={item.avatarCdn}
                          alt="头像"
                        ></img>
                      </div>
                      <div className="m-userlist-user-list-user-wrap">
                        <div className="m-userlist-user-list-user-name m-ellipsis">
                          {item.nickname}
                        </div>
                        {item.isOnline === '1' ? (
                          <Tag color="#87d068">在线</Tag>
                        ) : (
                          <Tag color="blue">离线</Tag>
                        )}
                        {item.isLastest === '1' ? (
                          <Tag color="green">新上线</Tag>
                        ) : null}
                      </div>
                    </div>
                  </LazyLoad>
                  {index !== dataSource.length - 1 ? (
                    <div className="m-userlist-ai-user-list-middle-divider"></div>
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading ? (
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
            {isLoading === false && dataSource.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        {userInfoGetDom()}
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
