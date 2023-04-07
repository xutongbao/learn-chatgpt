import React from 'react'
import Icon from './Icon'
import { withRouter } from 'react-router-dom'

function Index(props) {
  const { title = '', isBackTextVisible = false } = props
  const handleBack = () => {
    if (props.goBackPath) {
      props.history.push(props.goBackPath)
    } else {
      props.history.goBack()
    }
  }
  return (
    <div className="m-single-page-header-wrap">
      <Icon
        name="arrow"
        className="m-single-page-header-back"
        onClick={handleBack}
      ></Icon>
      {isBackTextVisible ? (
        <span className="m-single-page-header-back-text" onClick={handleBack}>
          返回
        </span>
      ) : null}

      <div className="m-single-page-header-title">{title}</div>
    </div>
  )
}

export default withRouter(Index)
