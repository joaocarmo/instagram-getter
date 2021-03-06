import React from 'react'
import { render } from 'react-dom'
import InstagramGetter from './components/instagram-getter'
import {
  debugPrint, addLocationChangeCallback, awaitElement, shouldDisable,
} from './utils'

if (!shouldDisable()) {
  const main = async () => {
    const appEl = await awaitElement(process.env.ROOT_ELEMENT)
    const container = document.createElement('div')
    appEl.appendChild(container)
    render(<InstagramGetter />, container)
  }

  addLocationChangeCallback(() => {
    main().catch(debugPrint)
  })
} else {
  debugPrint('Getter is disabled for this width')
}
