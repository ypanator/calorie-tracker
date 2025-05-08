import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from './theme.ts'
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            <Router>
                <App />
            </Router>
        </ChakraProvider>
    </StrictMode>
)