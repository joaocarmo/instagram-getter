import React, { useState, useEffect } from 'react'
import DownloadButton from './download-button'
import { parseData } from '../utils'

const findInterval = 0.7 // second(s)
const imgSelectors = [
  '[role*=dialog] img[alt*="Photo by"]',
  '[role*=dialog] img[alt*="Image may contain"]',
  'img[alt*="Photo by"]',
  'img[alt*="Image may contain"]',
]

const Worker = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const findTimer = setInterval(() => {
      if (!data) {
        for (const selector of imgSelectors) {
          const elements = document.querySelectorAll(selector)
          if (elements && elements.length) {
            const parsedData = parseData(elements)
            setData(parsedData)
            clearInterval(findTimer)
            break
          }
        }
      }
    }, findInterval * 1000)

    return () => {
      clearInterval(findTimer)
    }
  }, [])

  return (
    <>
      {data && data.length > 0 && (
        data.map((imageData) => <DownloadButton imageData={imageData} />)
      )}
    </>
  )
}

export default Worker
