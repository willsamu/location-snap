import React from 'react'
import Auth from '../Auth/Auth.component'
import { Router, Route } from 'react-router-dom'
import Callback from './Views/Callback/Callback.react'
import createHistory from 'history/createBrowserHistory'
import App from '../App'
import TopBar from './Views/TopBar/TopBar.react'
import Home from './Views/Home/Home.react'
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

const AuthRouter: any = () => {
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
                <TopBar />
                <Home auth={auth} {...props} />
              </div>
            )
          }}
        />
      </div>
    </Router>
  )
}

export default AuthRouter
