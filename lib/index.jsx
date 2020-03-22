import React from 'react'
import ReactDOM from 'react-dom'
import InstagramGetter from './components/instagram-getter'
import { debugPrint, addLocationChangeCallback, awaitElement } from './utils'

const main = async () => {
  const appEl = await awaitElement(process.env.ROOT_ELEMENT)
  const container = document.createElement('div')
  appEl.appendChild(container)
  ReactDOM.render(<InstagramGetter />, container)
}

addLocationChangeCallback(() => {
  main().catch(debugPrint)
})
