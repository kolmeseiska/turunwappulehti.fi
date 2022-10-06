import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AppRouter from './Router'
import { Box, Heading, Text } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppRouter>
        <Heading as='h2' size='2xl' mb={3}>
          Pönkeli Games 2022
        </Heading>
        <Heading as='h3' size='xl' mb={10} >
          Tulospalvelu
        </Heading>
      </AppRouter>
    </ChakraProvider >
  )
}

export default App
