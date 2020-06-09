import styled from 'styled-components'

export const Container = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 250px;
  margin-bottom: 20px;
`
export const CardContainer = styled.div`
  background-color: #000;
  width: 250px;
  height: 250px;
  border-radius: 20px;
`

export const Caption = styled.p`
  font-size: 40px;
  text-align: center;
  color: #fff;
  font-weight: 600;
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
`
