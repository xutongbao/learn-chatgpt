import Api from '../../api'
import { formatAuthData } from '../../utils/tools'

const getList = () => (dispatch) => {
  Api.list().then((res) => {
    if (res.code === 200) {
      dispatch({ type: 'SET_STATE', key: ['list'], value: res.data })
    }
  })
}

const getUserInfo =
  () =>
  (dispatch) => {
    let userInfo = {}
    dispatch({
      type: 'SET_LIGHT_STATE',
      key: ['userInfo'],
      value: { ...userInfo },
    })
  }

const setAuth = () => (dispatch, getState) => {
  const router = getState().getIn(['light', 'router']).toJS()
  dispatch({
    type: 'SET_LIGHT_STATE',
    key: ['router'],
    value: router,
  })
}

export { getList, getUserInfo, setAuth }
