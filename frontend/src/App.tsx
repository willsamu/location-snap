import React, { useState } from 'react'
import { CookiesProvider } from 'react-cookie'
import './App.css'
import styled from 'styled-components'
import AuthRouter from 'components/Routing'

const App = () => {
  return (
    <div className="App">
      <CookiesProvider>
        <AuthRouter />
      </CookiesProvider>
    </div>
  )
}

export default App
