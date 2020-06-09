import React, { FunctionComponent, useState, useEffect } from 'react'

import { Container } from './home.styled'
import Card from '../Card/Card.recact'
import { useLocation } from 'react-router-dom'
import { GetSnapsReqest } from '../../../types/Requests'
import { SnapResult } from '../../../types/Snap'

type HomeProps = {
  auth?: any
  snaps: SnapResult[]
  handleClick: any
}

const Home: FunctionComponent<HomeProps> = ({ auth, snaps, handleClick }) => {
  return (
    <Container>
      <button onClick={handleClick}>Press me</button>
      {snaps.map((item) => (
        <Card key={item.id} id={item.id} distance={item.distance} />
      ))}
    </Container>
  )
}

export default Home
