import React from 'react'
//import Icon from './Icon'
import { withRouter } from 'react-router-dom'

function Toolbar(props) {
  // const handleGoBack = () => {
  //   props.history.go(-1)
  // }
  return (
    <div className="m-toolbar">
      {/* <Icon name="goback" className="m-go-back-icon m-space" onClick={handleGoBack}></Icon> */}
      <span>{props.title}</span>
    </div>
  )
}

export default withRouter(Toolbar)
