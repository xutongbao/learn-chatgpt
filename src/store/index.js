import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { combineReducers } from 'redux-immutable'
import light from './light/light'

const reducers = combineReducers({
  light,
})

//chrome插件：Redux DevTools 配置，参考链接： https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
)

const store = createStore(reducers, enhancer)

// store.subscribe(() => {
//   let state = store.getState().toJS()
//   console.log(state)
// })

export default store
