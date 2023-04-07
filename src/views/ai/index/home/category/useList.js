import { useEffect } from 'react'
import Api from '../../../../../api'

export default function useList() {

  useEffect(() => {
    Api.h5.categoryGetData().then(res => {
      if (res.code === 200) {
        //setTabsArr(res.data.homeTabs)
      }
    })
    // eslint-disable-next-line
  }, [])

  return {
  }
}
