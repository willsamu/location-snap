import styled from 'styled-components'

import COLORS from '../colors'

export const Container = styled.div`
  background-color: ${COLORS.ps};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 300px;
  margin-bottom: 20px;
`
export const CardContainer = styled.div`
  background-color: ${COLORS.primary};
  width: 300px;
  height: 300px;
  border-radius: 20px;
`

export const CaptionCotainer = styled.div`
  margin-top: 48px;
`

export const Caption = styled.p`
  font-size: 40px;
  text-align: center;
  color: ${COLORS.light};
  font-weight: 600;
  margin: 10px;
`
export const Distance = styled.p`
  color: ${COLORS.contrast};
`

export const Button = styled.button`
  flex-grow: 1;
  align-self: center;
  width: 160px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  height: 40px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 50px;
  background-position: 100% 0;
  margin-top: 30px;
`
