import React from 'react'
import useList from './useList'

import './index.css'

export default function Index(props) {
  const {
    showModel,
  } = useList(props)



  const getDom = () => {
    return (
      <>
      </>
    )
  }

  return {
    userInfoShowModel: showModel,
    userInfoGetDom: getDom,
  }
}
