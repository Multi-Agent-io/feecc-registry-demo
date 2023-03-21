import { push } from 'connected-react-router'
import store from './main'

export const setQueryValues = (dispatch, queryUpdates, url) => {
  const state = store.getState()
  
  dispatch(push({
    pathname: url ? url : state.router.location.pathname,
    search: '?' + new URLSearchParams({
      ...state.router.location.query,
      ...queryUpdates,
    }),
  }))
}
