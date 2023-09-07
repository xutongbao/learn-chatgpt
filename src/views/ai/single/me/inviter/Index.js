import { Divider, Skeleton, Empty } from 'antd'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import moment from 'moment'
import './index.css'

function Index(props) {
  const { dataSource, isHasMore, totalMoney, handleSearch } =
    useList(props)
  let hook = {
    1: {
      title: '首月卡',
      className: 'orange',
    },
    2: {
      title: '月卡',
      className: 'green',
    },
    3: {
      title: '季卡',
      className: 'blue',
    },
    4: {
      title: '日卡',
      className: 'red',
    },
    5: {
      title: '次卡',
      className: 'pink',
    },  
    6: {
      title: '升级V4',
      className: 'v4',
    }, 
    7: {
      title: '月卡V4',
      className: 'mv4',
    },  
    8: {
      title: '升级V4',
      className: 'v4',
    }, 
    9: {
      title: '月卡V4',
      className: 'mv4',
    },       
  }
  return (
    <>
      <div className="m-ai-single-list-inviter-total-money-wrap">
        <span>总金额：</span>
        <span className='m-ai-single-list-inviter-total-money'>{totalMoney}</span>
      </div>
      <div id="scrollableDiv" className="m-ai-single-list">
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
              <div className="m-ai-single-user-list-wrap-wrap">
                <div className="m-ai-single-user-list-wrap">
                  <img
                    className="m-ai-single-user-list-avatar"
                    src={item.userAvatarCdn}
                    alt="头像"
                  ></img>
                  <div className="m-ai-single-user-list-user-wrap">
                    <div className="m-ai-single-user-list-user-name m-ellipsis">
                      {item.nickname}
                    </div>
                    <div className="m-ai-single-user-list-user-fans-count">
                      注册时间：
                      {moment(item.createTime - 0).format('MM-DD HH:mm:ss')}
                    </div>
                    {Array.isArray(item.exchangeHistoryList) &&
                    item.exchangeHistoryList.length > 0 ? (
                      <div className="m-ai-single-user-list-detail-wrap">
                        {item.exchangeHistoryList.map((item) => (
                          <div
                            key={item.useTime}
                            className="m-ai-single-user-list-detail-item"
                          >
                            <span
                              className={`m-tag-status ${
                                hook[item.codeType] &&
                                hook[item.codeType].className
                              }`}
                            >
                              {hook[item.codeType] && hook[item.codeType].title}
                            </span>
                            <span className="m-ai-single-user-list-use-time">
                              {moment(item.useTime - 0).format(
                                'MM-DD HH:mm:ss'
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {index !== dataSource.length - 1 ? (
                  <div className="m-ai-single-user-list-divider"></div>
                ) : null}
              </div>
            </div>
          ))}
          {dataSource.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
        </InfiniteScroll>
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
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
