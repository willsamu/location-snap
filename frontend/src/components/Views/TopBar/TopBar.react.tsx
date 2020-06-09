import React, { FunctionComponent } from 'react'

import { Container } from './TopBar.styled'

type TopBarType = {
  auth: any
}

const TopBar: FunctionComponent<TopBarType> = ({ auth }) => {
  const handleLogin = () => {
    auth.login()
  }
  return (
    <Container>
      <h1>WELCOME!</h1>
      <button onClick={handleLogin}>Login</button>
    </Container>
  )
}

export default TopBar
