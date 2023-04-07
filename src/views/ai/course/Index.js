import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader, Icon } from '../../../components/light'
import {
  Dropdown,
} from 'antd'

import Course from './recommend/Index'
import './index.css'

function Index(props) {
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
        icon: <Icon name="course" className="m-ai-menu-icon"></Icon>,
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
        icon: <Icon name="course" className="m-ai-menu-icon"></Icon>,
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
        icon: <Icon name="chrome" className="m-ai-menu-icon"></Icon>,
      },
    ]
    return items
  }
  return (
    <div>
      <div className="m-ai-wrap-box">
        <div className={`m-ai-wrap-chat`}>
          <SinglePageHeader
            goBackPath="/ai/index/home/chatList"
            title={'课程'}
          ></SinglePageHeader>
          <div className="m-ai-main">
            <div className="m-ai-course-list">
              <Dropdown
                menu={{ items: getItems() }}
                className="m-ai-dropdown"
                trigger={['click', 'hover']}
              >
                <Icon name="more" className="m-ai-menu-btn"></Icon>
              </Dropdown>
              <Course></Course>
            </div>
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
