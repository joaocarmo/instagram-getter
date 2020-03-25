import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { downloadImage } from '../utils'

const StyledButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 36px;
  padding: 8px 16px;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
  background-color: #e6e6e6;
  opacity: 0.7;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  z-index: 3;

  &:hover {
    opacity: 1;
    background-image: linear-gradient(
      transparent,
      rgba(0,0,0,.05) 40%,
      rgba(0,0,0,.1)
    );
  }

  &:active {
    box-shadow: 0 0 0 1px rgba(0,0,0,.15) inset, 0 0 6px rgba(0,0,0,.2) inset;
  }
`

const DownloadButton = ({ imageData: { uuid, imageEl, bestSrc } }) => (
  imageEl && ReactDOM.createPortal(
    <StyledButton
      id={`${uuid}-button`}
      onClick={() => downloadImage(bestSrc)}
    >
      Get
    </StyledButton>,
    imageEl.parentElement,
  )
)

DownloadButton.propTypes = {
  imageData: PropTypes.shape({
    imageEl: PropTypes.instanceOf(Element),
    bestSrc: PropTypes.string,
  }).isRequired,
}

export default DownloadButton
