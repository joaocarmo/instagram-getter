import React, { useState, useEffect } from 'react'
import DownloadButton from './download-button'
import { parseData, throttle, uniqueBy } from '../utils'

const findInterval = 0.5 // second(s)
const throttleInterval = 0.2 // second(s)
const imgSelectors = [
  '[role*=dialog] img[alt*="Photo by"]',
  '[role*=dialog] img[alt*="Photo shared by"]',
  '[role*=dialog] img[alt*="Image may contain"]',
  'img[alt*="Photo by"]',
  'img[alt*="Photo shared by"]',
  'img[alt*="Image may contain"]',
]

const Worker = () => {
  const [data, setData] = useState([])
  let findTimer = null

  const crawler = () => {
    let parsedData = []
    for (const selector of imgSelectors) {
      const elements = document.querySelectorAll(selector)
      if (elements && elements.length) {
        parsedData = [...parsedData, ...parseData(elements)]
      }
    }
    const newData = [...data, ...parsedData].filter(uniqueBy('uuid'))
    setData(newData)
    if (findTimer) {
      clearInterval(findTimer)
      findTimer = null
    }
  }

  useEffect(() => {
    findTimer = setInterval(crawler, findInterval * 1000)
    const throttledCrawler = throttle(throttleInterval * 1000, crawler)
    window.addEventListener('scroll', throttledCrawler)

    return () => {
      clearInterval(findTimer)
      window.removeEventListener('scroll', throttledCrawler)
    }
  }, [])

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
