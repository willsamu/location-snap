import styled from 'styled-components'

import COLORS from '../colors'

export const Container = styled.div`
  background-color: ${COLORS.contrast};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  margin-bottom: 50px;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
`
export const Name = styled.p`
  font-size: 30px;
  color: ${COLORS.ps};
  font-weight: 450;
`

export const Button = styled.button`
  flex-grow: 1;
  align-self: center;
  width: 160px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  height: 20px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 50px;
  background-position: 100% 0;
  margin-top: -24px;
`
