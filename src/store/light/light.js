import { fromJS } from 'immutable'
import { extraRouter, h5Router } from './router'

const defaultState = fromJS({
  userInfo: {},
  isLoading: false,
  router: [],
  extraRouter,
  h5Router,
  isSidebarVisible: true,
  collapsed: false,
  theme: 'dark',
  selectedKeys: '',
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_LIGHT_STATE':
      return state.setIn(action.key, fromJS(action.value))
    default:
      return state
  }
}

export default reducer