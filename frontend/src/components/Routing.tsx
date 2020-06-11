import React, { useState, ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import Auth from '../Auth/Auth.component'
import { Router, Route } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Callback from './Views/Callback/Callback.react'
import createHistory from 'history/createBrowserHistory'
import TopBar from './Views/TopBar/TopBar.react'
import Home from './Views/Home/Home.connector'
import { wakeUpPostgres } from 'api/location-snap-api'
import { reactPassword } from 'config'
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = async (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

const AuthRouter: any = () => {
  const [cookies, setCookie] = useCookies(['unlocked'])
  const [isUnlocked, setIsUnlocked] = useState(true)
  const [appPassword, setAppPassword] = useState('')

  useEffect(() => {
    if (cookies.unlocked !== isUnlocked) {
      setIsUnlocked(cookies.unlocked == 'true')
    }
  }, [cookies, isUnlocked])

  useEffect(() => {
    cookies.unlocked == 'true' && wakeUpPostgres()
  }, [cookies])

  const handleUnlock = () => {
    if (appPassword.toLowerCase().trim() === reactPassword) {
      setCookie('unlocked', 'true', { path: '/' })
      setIsUnlocked(true)
      wakeUpPostgres()
    }
  }

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAppPassword(event.target.value.trim())

  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={(props) => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route
          render={(props) => {
            return (
              <div>
                {isUnlocked ? (
                  <div>
                    <TopBar auth={auth} />
                    <Home auth={auth} {...props} />
                  </div>
                ) : (
                  <Container>
                    <p>
                      Please enter the <b>password</b> provided to you by the administrator of the
                      page!
                    </p>
                    <input onChange={onTextChange}></input>
                    <Button title="Unlock" onClick={handleUnlock}>
                      Unlock
                    </Button>
                  </Container>
                )}
              </div>
            )
          }}
        />
      </div>
    </Router>
  )
}

export default AuthRouter

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500;
  height: 100%;
  flex-grow: 1;
`

const Button = styled.button`
  flex-grow: 1;
  align-self: center;
  width: 160px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 20px;
  height: 40px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 50px;
  background-position: 100% 0;
`
