import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './providers/AuthProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import InfoProvider from './providers/InfoProvider.tsx'
import ChatProvider from './providers/ChatProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InfoProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </InfoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
