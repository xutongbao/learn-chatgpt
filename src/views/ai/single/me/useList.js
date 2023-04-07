import { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Api from '../../../../api'
import { getRouteArr } from './config'

export default function useList(props) {
  // eslint-disable-next-line
  const [groupButton1, setGroupButton1] = useState([])
  const [routeDom, setRouteDom] = useState()
  const [filterRouteArr, setFilterRouteArr] = useState([])
  const [tabsValue, setTabsValue] = useState()
  const {
    location: { pathname },
  } = props

  const handleTabsChange = (event, newValue) => {
    setTabsValue(newValue)
  }

  const handleJumpPage = (item) => {
    props.history.push(item.path)
  }

  useEffect(() => {
    setTimeout(() => {
      if (tabsValue) {
        document
          .getElementById(`m-tab-${tabsValue}`)
          ?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }, 1000)
    // eslint-disable-next-line
  }, [tabsValue])

  useEffect(() => {
    const routeArr = getRouteArr()
    const filterRouteArr = routeArr.filter(
      (item) =>
        groupButton1.findIndex(
          (groupButton1Item) => groupButton1Item.path === item.path
        ) >= 0
    )

    const routeDom = filterRouteArr.map((item) => (
      <Route
        key={item.path}
        path={item.path}
        component={item.component}
      ></Route>
    ))
    if (routeDom.length > 0) {
      routeDom.push(
        <Redirect key={'redirect'} from="*" to="/404" exact></Redirect>
      )
    }
    setRouteDom(routeDom)
    setFilterRouteArr(filterRouteArr)
  }, [groupButton1])

  useEffect(() => {
    const routeArr = getRouteArr()
    const routeIndex = routeArr.findIndex((item) => item.path === pathname)
    setTabsValue(routeIndex)
    // eslint-disable-next-line
  }, [pathname])

  useEffect(() => {
    Api.h5.configGetMeData().then((res) => {
      if (res.code === 200) {
        setGroupButton1(res.data.me.groupButton2)
      }
    })
    // eslint-disable-next-line
  }, [])

  return {
    routeDom,
    filterRouteArr,
    tabsValue,
    handleTabsChange,
    handleJumpPage,
  }
}
