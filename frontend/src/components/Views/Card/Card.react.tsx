import React, { FunctionComponent, useState, useEffect } from 'react'

import { Button, Caption, CardContainer, Container, Distance, CaptionCotainer } from './card.styled'

type CardProps = {
  id: string
  distance: number
}
const Card: FunctionComponent<CardProps> = ({ id, distance }) => {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    //TODO: Call APi with id
    // !position && getPosition(setPosition)
  }, [position])
  console.log('Position: ', position)

  return (
    <Container>
      <CardContainer>
        <CaptionCotainer>
          <Caption>NEW</Caption>
          <Caption> PICTURE</Caption>
        </CaptionCotainer>
        <Button>OPEN</Button>
      </CardContainer>
      <Distance>{distance} KM AWAY</Distance>
    </Container>
  )
}

export default Card
