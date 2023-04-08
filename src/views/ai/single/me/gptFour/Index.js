import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import './index.css'

function Index(props) {
  // eslint-disable-next-line
  const { handleReload } = useList(props)
  return (
    <>
      <div className="m-single-page-space">
        <div className='m-single-join-group-intro'>
          1. 我的GPT-4接入之旅
          <div>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129851721?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              https://blog.csdn.net/xutongbao/article/details/129851721
            </a>
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
