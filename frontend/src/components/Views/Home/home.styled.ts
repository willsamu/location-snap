import styled from 'styled-components'

import COLORS from '../colors'

export const Container = styled.div`
  padding-top: 120px;
  background-color: ${COLORS.ps};
  min-height: 100vh;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`
export const CardContainer = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 20px;
`

export const Image = styled.img`
  width: 80%;
  height: 80%;
  max-width: 1000px;
  max-height: 1000px;
  object-fit: contain;
`

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}
