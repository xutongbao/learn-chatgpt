import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader, Icon } from '../../../components/light'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Dropdown, Divider, Skeleton } from 'antd'
import useList from './useList'
import './index.css'

function Index(props) {
  const { dataSource, isHasMore, handleSearch, handleJumpPage } =
    useList(props)
  const getItems = () => {
    const items = [
      {
        key: '1',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129851721?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              我的GPT-4 API 接入之旅
            </a>
          </>
        ),
        icon: <Icon name="course" className="m-words-menu-icon"></Icon>,
      },
      {
        key: '2',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129007691?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              ChatGPT学习心得
            </a>
          </>
        ),
        icon: <Icon name="course" className="m-words-menu-icon"></Icon>,
      },
      {
        key: 'chrome',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a href={`https://llq.ywswge.cn`} target="_blank">
              下载chrome浏览器（推荐）
            </a>
          </>
        ),
        icon: <Icon name="chrome" className="m-words-menu-icon"></Icon>,
      },
    ]
    return items
  }
  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-words-wrap-box">
      <div className={`m-words-wrap-chat ${wideScreenHistory ? '' : ''}`}>
        <SinglePageHeader
          goBackPath="/ai/index/home/chatList"
          title="识字"
        ></SinglePageHeader>
        <div className="m-words-list" id="scrollableDiv">
          <Dropdown
            menu={{ items: getItems() }}
            className="m-words-dropdown"
            trigger={['click', 'hover']}
          >
            <Icon name="more" className="m-words-menu-btn"></Icon>
          </Dropdown>
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
            <div className="m-words-word-wrap">
              {dataSource.map((item, index) => (
                <div
                  className="m-words-word-item"
                  key={item.uid}
                  onClick={() =>
                    handleJumpPage(
                      `/ai/wordsDetail?uid=${item.uid}&pageNum=${item.pageNum}`
                    )
                  }
                >
                  {item.word}
                </div>
              ))}
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
        {/* <div className="m-words-footer"></div> */}
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
