import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from './theme.ts'
import { BrowserRouter as Router } from 'react-router-dom'
import { IconContext } from 'react-icons'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <IconContext.Provider value={{ color: "white" }}>
    <ChakraProvider theme={theme}>
    <Router>
        <App />
    </Router>
    </ChakraProvider>
    </IconContext.Provider>
    </StrictMode>
)