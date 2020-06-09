import React from 'react'
import logo from './logo.svg'
import './App.css'
import Home from './components/Views/Home/Home.react'
import TopBar from 'components/Views/TopBar/TopBar.react'
import AuthRouter from 'components/Routing'

function App() {
  return (
    <div className="App">
      <AuthRouter />
    </div>
  )
}

export default App
