import React from 'react'
import styled from 'styled-components'
import Logo from './img/plus-getter.svg'

const AppContainer = styled.div`
  z-index: 1000;

  @media (max-width: 768px) {
    display: none;
  }
`

const AppLogoContainer = styled.div`
  position: fixed;
  top: 20px;
  left: calc(50vw - 975px / 2 + 175px);

  @media (max-width: 1000px) {
    left: 175px;
  }
`

const InstagramGetter = () => (
  <AppContainer>
    <AppLogoContainer>
      <Logo height={20} width={60} />
    </AppLogoContainer>

  </AppContainer>
)

export default InstagramGetter
