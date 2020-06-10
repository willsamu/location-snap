import React, { FunctionComponent, useState, useEffect } from 'react'

import { Button, Caption, CardContainer, Container, Distance, CaptionCotainer } from './card.styled'
import { ModalState } from '../Home/Home.react'

type CardProps = {
  id: string
  distance: number
  setModalState: Function
}
const Card: FunctionComponent<CardProps> = ({ id, distance, setModalState }) => {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    //TODO: Call APi with id
    // !position && getPosition(setPosition)
  }, [position])
  console.log('Position: ', position)

  const handleClick = () => {
    setModalState(
      (oldState: ModalState) => ({ id, open: true, counter: oldState.counter } as ModalState),
    )
  }

  return (
    <Container>
      <CardContainer>
        <CaptionCotainer>
          <Caption>NEW</Caption>
          <Caption> PICTURE</Caption>
        </CaptionCotainer>
        <Button onClick={handleClick}>OPEN</Button>
      </CardContainer>
      <Distance>{distance} KM AWAY</Distance>
    </Container>
  )
}

export default Card
