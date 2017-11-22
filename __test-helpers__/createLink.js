import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { createRouter } from '../src/index'

import Link from '../src/components/Link'
import NavLink from '../src/components/NavLink'

const createLink = async (props, initialPath, options, isNavLink) => {
  const link = isNavLink ? <NavLink {...props} /> : <Link {...props} />

  const routes = {
    FIRST: '/first',
    SECOND: '/second/:param'
  }

  const { middleware, reducer, firstRoute } = createRouter(routes, {
    initialEntries: initialPath || '/',
    ...options
  })

  const enhancer = applyMiddleware(middleware)
  const rootReducer = (state = {}, action = {}) => ({
    location: reducer(state.location, action)
  })

  const store = createStore(rootReducer, enhancer)
  await store.dispatch(firstRoute())

  const component = renderer.create(
    <Provider store={store}>
      {link}
    </Provider>
  )

  return {
    component,
    tree: component.toJSON(),
    store
  }
}

export default createLink
export const createNavLink = (path, props, options) => createLink(props, path, options, true)

export const event = { preventDefault: () => undefined, button: 0 }
