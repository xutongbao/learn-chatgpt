import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, List, Breadcrumb } from 'antd'
import { SinglePageHeader } from '../../../../../components/light'

import useList from './useList'
import './index.css'

const { Search } = Input

function Index(props) {
  const {
    message,
    list,
    searchInformation,
    total,
    current,
    handleChange,
    handleSearch,
    handlePageChange,
  } = useList(props)

  return (
    <>
      <div className="m-single-google-wrap-box">
        <div className="m-single-google-wrap-outer active">
          <div className="m-single-google-wrap">
            <SinglePageHeader
              goBackPath="/ai/index/home/chatList"
              title={'Google'}
            ></SinglePageHeader>
            <div className="m-single-google-search">
              <Search
                placeholder="请输入"
                value={message}
                onChange={handleChange}
                onSearch={(value, e) => handleSearch(value, e)}
                allowClear
                loading={false}
                enterButton="Google搜索"
              />
            </div>
            <div>
              {searchInformation.totalResults ? (
                <div className="m-single-google-search-info">
                  找到约 {searchInformation.totalResults} 条结果（用时
                  {searchInformation.formattedSearchTime}秒）
                </div>
              ) : null}
            </div>
            <div className="m-single-google-list">
              <List
                itemLayout="vertical"
                size="large"
                pagination={
                  total > 0
                    ? {
                        onChange: (page) => {
                          console.log(page)
                          handlePageChange({ pageNum: page })
                        },
                        current,
                        pageSize: 10,
                        total: total,
                      }
                    : false
                }
                dataSource={list}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    {/* eslint-disable-next-line */}
                    <a href={item.link} target="_blank">
                      <div
                        className="m-single-google-item-title"
                        dangerouslySetInnerHTML={{ __html: item.htmlTitle }}
                      ></div>
                    </a>
                    <div className="m-single-google-item-breadcrumb-wrap">
                      <Breadcrumb separator=">" items={item.breadcrumbList} />
                    </div>

                    <div className="m-single-google-item-info">
                      {item?.pagemap?.cse_image &&
                      item?.pagemap?.cse_image[0].src ? (
                        <>
                          {/* eslint-disable-next-line */}
                          <a href={item.link} target="_blank">
                            <img
                              src={item?.pagemap?.cse_image[0].src}
                              width={60}
                              alt="缩略图图片"
                            />
                          </a>
                        </>
                      ) : null}
                      {/* <img src={item?.richSnippet?.cseThumbnail?.src} width={60} alt='缩略图图片'/> */}
                      <div
                        className="m-single-google-item-content"
                        dangerouslySetInnerHTML={{ __html: item.htmlSnippet }}
                      ></div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
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
