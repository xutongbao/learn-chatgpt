import React from 'react'
import { SinglePageHeader } from '../../../components/light'
import JoinGroup from '../single/me/joinGroup/Index'
import './index.css'

export default function Index() {
  return (
    <div>
      <SinglePageHeader></SinglePageHeader>
      <JoinGroup></JoinGroup>
    </div>
  )
}
