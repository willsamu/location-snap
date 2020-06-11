import React, { FunctionComponent, useState, useEffect } from 'react'

import { Button, Container, Name } from './TopBar.styled'
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
  }, [auth])

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isLoggedIn') == 'true')
  }, [localStorage.getItem('isLoggedIn'), auth])

  return (
    <Container>
      <Name>WELCOME!</Name>
      <Button onClick={handleLoginLogout}>{isAuthenticated ? 'logout' : 'Login'}</Button>
    </Container>
  )
}

export default TopBar
