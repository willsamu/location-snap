import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import Auth from '../Auth/Auth.component'
// import { HashRouter as Router, Route, useLocation } from 'react-router-dom'
import { Router, Route } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Callback from './Views/Callback/Callback.react'
import createHistory from 'history/createBrowserHistory'
// import { createBrowserHistory } from 'history'
import TopBar from './Views/TopBar/TopBar.react'
import Home from './Views/Home/Home.react'
// const history = createBrowserHistory()
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  console.log('L O C: ', location)
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

const AuthRouter: any = () => {
  const [cookies, setCookie] = useCookies(['unlocked'])
  const [isUnlocked, setIsUnlocked] = useState(cookies.unlocked)
  const [appPassword, setAppPassword] = useState('')

  const handleUnlock = () => {
    if (appPassword === 'password') {
      setCookie('unlocked', 'true', { path: '/' })
      setIsUnlocked(true)
    }
  }
  const onTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAppPassword(event.target.value.trim())
  return (
    // @ts-ignore
    // <Router basename="/" history={history}>
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
