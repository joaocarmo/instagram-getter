import React, {
  useCallback, useEffect, useRef, useState,
} from 'react'
import DownloadButton from './download-button'
import {
  parseData, throttle, uniqueBy, addLocationChangeCallback, debugPrint,
} from '../utils'

const findInterval = 0.3 // second(s)
const throttleInterval = 0.2 // second(s)
const dialogInterval = 0.5 // second(s)
const dialogSelector = '[role*=dialog]'
const imgSelectors = [
  `${dialogSelector} img`,
  'section main article img',
]
const chevronSelectors = [
  `${dialogSelector} .coreSpriteRightChevron`,
  `${dialogSelector} .coreSpriteLeftChevron`,
  // `${dialogSelector} .coreSpriteRightPaginationArrow`, Possibly not needed
  'main .coreSpriteRightChevron',
  'main .coreSpriteLeftChevron',
]

const Worker = () => {
  const [data, setData] = useState([])
  const [chevronHasEL, setChevronHasEL] = useState({})
  const refFindTimer = useRef(null)

  const crawler = useCallback(() => {
    let parsedData = []
    for (const selector of imgSelectors) {
      const elements = document.querySelectorAll(selector)
      if (elements && elements.length) {
        parsedData = [...parsedData, ...parseData(elements)]
      }
    }
    setData((oldData) => [...oldData, ...parsedData].filter(uniqueBy('uuid')))
    debugPrint(`Crawler - ${parsedData.length} parsed elements`)
  }, [])

  const throttledCrawler = useCallback(() => throttle(throttleInterval * 1000, crawler), [crawler])

  const addMultiImgEventListeners = useCallback(() => {
    for (const selector of chevronSelectors) {
      const element = document.querySelector(selector)
      if (element && !chevronHasEL[selector]) {
        element.addEventListener('click', throttledCrawler)
        setChevronHasEL({ ...chevronHasEL, [selector]: true })
        debugPrint(`AddEventListener - ${selector}`)
      }
    }
  }, [chevronHasEL, throttledCrawler])

  const removeMultiImgEventListeners = useCallback(() => {
    for (const selector of chevronSelectors) {
      const element = document.querySelector(selector)
      if (element && chevronHasEL[selector]) {
        element.removeEventListener('click', throttledCrawler)
        setChevronHasEL({ ...chevronHasEL, [selector]: false })
        debugPrint(`RemoveEventListener - ${selector}`)
      }
    }
  }, [chevronHasEL, throttledCrawler])

  const findCB = useCallback(() => {
    crawler()
    if (refFindTimer.current) {
      clearInterval(refFindTimer.current)
      refFindTimer.current = null
      debugPrint('FindTimer - Cleared')
    }
  }, [crawler])

  const dialogCB = useCallback(() => {
    const dialogExists = document.querySelector(dialogSelector)
    if (dialogExists) {
      let counter = 0
      const cbTimer = setInterval(() => {
        counter += 1
        throttledCrawler()
        debugPrint(`DialogInterval - Run #${counter}`)
        if (counter > 1) {
          clearInterval(cbTimer)
          debugPrint('DialogInterval - Cleared')
        }
      }, dialogInterval * 1000)
    }
  }, [throttledCrawler])

  useEffect(() => {
    refFindTimer.current = setInterval(findCB, findInterval * 1000)
    window.addEventListener('scroll', throttledCrawler)
    if (!window.refDialogObserver) {
      const opts = { runAtInit: false }
      window.refDialogObserver = addLocationChangeCallback(dialogCB, opts)
    }

    debugPrint('Worker mounted')

    return () => {
      clearInterval(refFindTimer.current)
      window.removeEventListener('scroll', throttledCrawler)
      removeMultiImgEventListeners()
      debugPrint('Worker unmounted')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    addMultiImgEventListeners()
    debugPrint('Worker refreshed')
  }, [addMultiImgEventListeners])

  if (!data || !data.length) {
    return null
  }

  return data.map((imageData) => (
    <DownloadButton key={imageData.uuid} imageData={imageData} />
  ))
}

export default Worker
