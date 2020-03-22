import { parse as srcsetParse } from 'srcset'

/**
 * Wrapped `console.log` function.
 *
 * @export
 * @param {*} args
 */
const debugPrint = (...args) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(...args)
    }
  } catch (error) {
    // If we can't write to the console, we do nothing
  }
}

/**
 * Ensure `callback` is called every time window.location changes
 * Code derived from https://stackoverflow.com/a/46428962
 *
 * @export
 * @param {function} callback  - function to be called when URL changes
 * @returns {MutationObserver} - MutationObserver that watches the URL
 */
const addLocationChangeCallback = (callback) => {
  // Run the callback once right at the start
  window.setTimeout(callback, 0)

  // Set up a `MutationObserver` to watch for changes in the URL
  let oldHref = window.location.href
  const body = document.querySelector('body')
  const observer = new MutationObserver((mutations) => {
    if (mutations.some(() => oldHref !== document.location.href)) {
      oldHref = document.location.href
      callback()
    }
  })

  observer.observe(body, { childList: true, subtree: true })
  return observer
}

/**
 * Awaits for an element with the specified `selector` to be found
 * and then returns the selected dom node.
 * This is used to delay rendering a widget until its parent appears.
 *
 * @export
 * @param {string} selector
 * @returns {DOMNode}
 */
const awaitElement = async (selector) => {
  const MAX_TRIES = 60
  let tries = 0
  return new Promise((resolve, reject) => {
    const probe = () => {
      tries += 1
      return document.querySelector(selector)
    }

    const delayedProbe = () => {
      if (tries >= MAX_TRIES) {
        debugPrint('Can not find the element with selector', selector)
        reject()
        return
      }
      const el = probe()
      if (el) {
        resolve(el)
        return
      }

      window.setTimeout(delayedProbe, 250)
    }

    delayedProbe()
  })
}

/**
 * Converts pixels into em units given a certain base
 * which defaults to 16px
 *
 * @export
 * @param {number} size
 * @param {number} base
 * @returns {number}
 */
const pxToEm = (size = 16, base = 16) => parseInt(size, 10) / base

/**
 * Extracts the best src from a srcset
 *
 * @export
 * @param {string} srcset
 * @returns {string}
 */
const parseSrcset = (srcset = '') => {
  let bestSrcset = ''
  if (srcset) {
    const parsedSrcset = srcsetParse(srcset)
    if (parsedSrcset && parsedSrcset.length) {
      const highestSrc = parsedSrcset.reduce(
        ({ width, density }, acc) => (
          (width || density) > acc ? (width || density) : acc
        ),
      )
      if (highestSrc) {
        const { url } = highestSrc
        if (url) {
          bestSrcset = url
        }
      }
    }
  }
  return bestSrcset
}

/**
 * Receives a collection of image elements and extracts the best quality source
 *
 * @export
 * @param {array} data
 * @returns {array}
 */
const parseData = (data = []) => {
  const parsedData = []
  if (data && data.length) {
    for (const imageEl of data) {
      const { src, srcset } = imageEl
      let bestSrc = src
      if (srcset) {
        const bestSrcset = parseSrcset(srcset)
        if (bestSrcset) {
          bestSrc = bestSrcset
        }
      }
      parsedData.push({ imageEl, bestSrc })
    }
  }
  return parsedData
}

/**
 * Forces the download of some asset
 *
 * @export
 * @param {string} url
 */
const downloadImage = (url) => {
  let downloadPrefix = ''
  try {
    downloadPrefix = process.env.DOWNLOAD_PREFIX
  } catch (error) {
    // Nothing to do here
  }
  const fileName = url.split('/').pop().split('?').shift()
  const tmpEl = document.createElement('a')
  tmpEl.href = url
  tmpEl.target = '_blank'
  tmpEl.download = `${downloadPrefix}_${fileName}`
  document.body.appendChild(tmpEl)
  tmpEl.click()
  document.body.removeChild(tmpEl)
}

export {
  debugPrint,
  addLocationChangeCallback,
  awaitElement,
  pxToEm,
  parseData,
  downloadImage,
}
