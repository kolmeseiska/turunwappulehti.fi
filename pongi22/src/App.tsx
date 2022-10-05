import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AppRouter from './Router'
import { Text } from '@chakra-ui/react'

function App() {
  return (
    <AppRouter>
      <Text color='#f4f4f4'>Pönkeli Games 2022 - Tulospalvelu</Text>
    </AppRouter>
  )
}

export default App
