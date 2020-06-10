import styled from 'styled-components'

import COLORS from '../colors'

function vhTOpx(value: number, padding: number) {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight

  var result = (y * value) / 100
  // @ts-ignore
  document.getElementById('root').innerHTML = result // affichage du résultat (facultatif)
  return result - padding
}

export const Container = styled.div`
  padding-top: 120px;
  background-color: ${COLORS.ps};
  min-height: ${vhTOpx(100, 120)}px;
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
  display: block;
  margin-left: auto;
  margin-right: auto;
`

export const MessageContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Message = styled.p`
  font-size: 40px;
  color: ${COLORS.light};
  margin: 10px;
  font-weight: 200;
`

export const Name = styled.p`
  font-size: 50px;
  color: ${COLORS.contrast};
  font-weight: 500;
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
