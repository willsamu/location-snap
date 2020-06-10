import React, { FunctionComponent, useState } from 'react'

import { Button, Caption, CardContainer, Container, Distance, CaptionCotainer } from './card.styled'
import { ModalState } from '../Home/Home.connector'

type CardProps = {
  id: string
  distance: number
  setModalState: Function
}

const Card: FunctionComponent<CardProps> = ({ id, distance, setModalState }) => {
  const [didOpen, setDidOpen] = useState(false)

  const handleClick = () => {
    setModalState(
      (oldState: ModalState) =>
        ({
          id,
          open: true,
          counter: oldState.counter,
          url: '',
        } as ModalState),
    )
    setDidOpen(true)
  }

  return (
    <Container>
      <CardContainer>
        <CaptionCotainer>
          <Caption>NEW</Caption>
          <Caption> PICTURE</Caption>
        </CaptionCotainer>
        <Button disabled={didOpen} onClick={handleClick}>
          {!didOpen ? 'OPEN' : '...'}
        </Button>
      </CardContainer>
      <Distance>{distance} KM AWAY</Distance>
    </Container>
  )
}

export default Card
