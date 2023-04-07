import React, { Suspense } from 'react'
import { Loading } from '../../../../components/light'
import { Switch } from 'react-router-dom'
import useList from './useList'

export default function Index(props) {
  const { getRoute } =
    useList(props)
  const { routeDom } = getRoute()

  return (
    <>
      <div className="m-h5-home-header">
        消息
      </div>
      <div className="m-h5-home-content">
        <div className="m-h5-home-main">
          <Suspense fallback={<Loading isLazyLoading={true}></Loading>}>
            <Switch>{routeDom}</Switch>
          </Suspense>
        </div>
      </div>
    </>
  )
}
