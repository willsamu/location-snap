import React, { FunctionComponent, useState, useEffect } from 'react'

import { Container } from './home.styled'
import Card from '../Card/Card.react'
import { SnapResult } from '../../../types/Snap'
import Settings from '../Settings/Settings.react'
import { GetSnapsReqest } from 'types/Requests'

type HomeProps = {
  auth?: any
  snaps: SnapResult[]
  handleClick: any
  params: GetSnapsReqest
}

const Home: FunctionComponent<HomeProps> = ({ auth, snaps, handleClick, params }) => {
  const settingsProps = { auth, params }
  return (
    <Container>
      <Settings {...settingsProps} />
      <button onClick={handleClick}>Press me</button>
      {snaps.map((item) => (
        <Card key={item.id} id={item.id} distance={item.distance} />
      ))}
    </Container>
  )
}

export default Home
