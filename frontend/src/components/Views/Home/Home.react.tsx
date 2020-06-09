import React, { FunctionComponent, useState, useEffect } from 'react'

import { Container } from './home.styled'
import Card from '../Card/Card.recact'
import { useLocation } from 'react-router-dom'

type HomeProps = {
  auth?: any
}

const getPosition = async (setPosition: Function) => {
  await navigator.geolocation.getCurrentPosition(
    (position) =>
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    (err) => console.log(err),
  )
}

const Home: FunctionComponent<HomeProps> = ({ auth }) => {
  const [position, setPosition] = useState(null)
  const [snaps, setSnaps] = useState([
    { id: '1', distance: 2 },
    { id: '2', distance: 5 },
  ])
  const location = useLocation()

  useEffect(() => {
    console.log('Location: ', location, auth.isAuthenticated())
    if (!position) {
      getPosition(setPosition)
    } else console.log('Position: ', position)
  }, [position])

  return (
    <Container>
      {snaps.map((item) => (
        <Card key={item.id} id={item.id} distance={item.distance} />
      ))}
    </Container>
  )
}

export default Home
