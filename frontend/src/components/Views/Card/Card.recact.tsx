import React, { FunctionComponent, useState, useEffect } from 'react'

import { CardContainer, Container } from './card.styled'

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
        <p>NEW PICTURE</p>
      </CardContainer>{' '}
      <p>{distance} KM AWAY</p>
    </Container>
  )
}

export default Card
