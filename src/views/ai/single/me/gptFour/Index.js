import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Collapse, Image } from 'antd'
import useList from './useList'
import './index.css'

const { Panel } = Collapse

function Index(props) {
  // eslint-disable-next-line
  const { handleReload } = useList(props)
  return (
    <>
      <div className="m-single-page-space">
        <Collapse>
          <Panel header="对比GPT-4与gpt-3.5-turbo对同一个问题的的回答" key="0">
            <div>
              <div>我的蓝牙耳机坏了，我是去挂号看牙科呢还是耳鼻咽喉科？</div>
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-gpt-4-1.jpg?time=20230404"
                />
              </div>
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-gpt-4-2.jpg?time=20230404"
                />
              </div>
            </div>
          </Panel>
        </Collapse>
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
