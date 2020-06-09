import React, { FunctionComponent, useState, useEffect } from 'react'

import { Button, Caption, CardContainer, Container } from './card.styled'

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
        <Caption>NEW PICTURE</Caption>
        <Button>OPEN</Button>
      </CardContainer>
      <p>{distance} KM AWAY</p>
    </Container>
  )
}

export default Card
