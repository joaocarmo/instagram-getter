import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Worker from './worker'
import Logo from '../img/plus-getter.svg'
import { debugPrint } from '../utils'

const AppContainer = styled.div`
  z-index: 1000;

  @media (max-width: 768px) {
    display: none;
  }
`

const AppLogoContainer = styled.div`
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  position: fixed;
  top: ${({ isHidden }) => (isHidden ? '15px' : '20px')};
  left: calc(50vw - 975px / 2 + 175px);
  transition: all 0.2s ease-in 0.05s;

  @media (max-width: 1000px) {
    left: 175px;
  }
`

const InstagramGetter = () => {
  const [isHidden, setIsHidden] = useState(false)

  const checkIfScrolled = () => {
    const topOffset = document.querySelector('body').getBoundingClientRect().top
    const hidden = topOffset < -52
    setIsHidden(hidden)
    debugPrint(`Logo - ${hidden ? 'hidden' : 'visible'}`)
  }

  useEffect(() => {
    window.addEventListener('scroll', checkIfScrolled)

    return () => {
      window.removeEventListener('scroll', checkIfScrolled)
    }
  }, [])

  return (
    <AppContainer>
      <AppLogoContainer isHidden={isHidden}>
        <Logo height={20} width={60} />
      </AppLogoContainer>
      <Worker />
    </AppContainer>
  )
}

export default InstagramGetter
