import React, { useState, useEffect, useRef } from 'react'
import DownloadButton from './download-button'
import { parseData, throttle, uniqueBy } from '../utils'

const findInterval = 0.3 // second(s)
const throttleInterval = 0.2 // second(s)
const imgSelectors = [
  '[role*=dialog] img',
  'section main article img',
]
const chevronSelectors = [
  '[role*=dialog] .coreSpriteRightChevron',
  '[role*=dialog] .coreSpriteLeftChevron',
  'main .coreSpriteRightChevron',
  'main .coreSpriteLeftChevron',
]

const Worker = () => {
  const [data, setData] = useState([])
  const [chevronHasEL, setChevronHasEL] = useState({})
  const refFindTimer = useRef(null)

  const crawler = () => {
    let parsedData = []
    for (const selector of imgSelectors) {
      const elements = document.querySelectorAll(selector)
      if (elements && elements.length) {
        parsedData = [...parsedData, ...parseData(elements)]
      }
    }
    setData((oldData) => [...oldData, ...parsedData].filter(uniqueBy('uuid')))
    if (refFindTimer.current) {
      clearInterval(refFindTimer.current)
      refFindTimer.current = null
    }
  }

  const throttledCrawler = throttle(throttleInterval * 1000, crawler)

  const addMultiImgEventListeners = () => {
    for (const selector of chevronSelectors) {
      const element = document.querySelector(selector)
      if (element && !chevronHasEL[selector]) {
        element.addEventListener('click', throttledCrawler)
        setChevronHasEL({ ...chevronHasEL, [selector]: true })
      }
    }
  }

  const removeMultiImgEventListeners = () => {
    for (const selector of chevronSelectors) {
      const element = document.querySelector(selector)
      if (element && chevronHasEL[selector]) {
        element.removeEventListener('click', throttledCrawler)
        setChevronHasEL({ ...chevronHasEL, [selector]: false })
      }
    }
  }

  useEffect(() => {
    refFindTimer.current = setInterval(crawler, findInterval * 1000)
    window.addEventListener('scroll', throttledCrawler)

    return () => {
      clearInterval(refFindTimer.current)
      window.removeEventListener('scroll', throttledCrawler)
      removeMultiImgEventListeners()
    }
  }, [])

  useEffect(() => {
    addMultiImgEventListeners()
  })

  return (
    <>
      {data && data.length > 0 && (
        data.map((imageData) => (
          <DownloadButton key={imageData.uuid} imageData={imageData} />
        ))
      )}
    </>
  )
}

export default Worker
