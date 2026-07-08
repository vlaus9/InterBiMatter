import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from './app/store.ts'
import { BrowserRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <BrowserRouter>
          <App />   
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  // </StrictMode>,
)
