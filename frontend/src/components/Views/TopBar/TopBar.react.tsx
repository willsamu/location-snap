import React, { FunctionComponent, useState, useEffect } from 'react'

import { Container } from './TopBar.styled'
import { useCookies } from 'react-cookie'

type TopBarType = {
  auth: any
}

const TopBar: FunctionComponent<TopBarType> = ({ auth }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') == 'true',
  )
  const [_, setCookie] = useCookies(['unlocked'])

  const handleLoginLogout = async () => {
    if (!isAuthenticated) auth.login()
    else {
      auth.logout()
      localStorage.setItem('isLoggedIn', 'false')
      setCookie('unlocked', false)
    }
  }

  useEffect(() => {
    localStorage.setItem('isLoggedIn', auth.getIdToken() == undefined ? 'false' : 'true')
  })

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isLoggedIn') == 'true')
    console.log(`Session: ${auth.getIdToken()} \n ${localStorage.getItem('isLoggedIn')}`)
  }, [localStorage.getItem('isLoggedIn')])

  return (
    <Container>
      <h1>WELCOME!</h1>
      <button onClick={handleLoginLogout}>{isAuthenticated ? 'logout' : 'Login'}</button>
    </Container>
  )
}

export default TopBar
