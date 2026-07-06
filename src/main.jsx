import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16231F',
              color: '#F5F6F1',
              fontSize: '14px',
              borderRadius: '6px',
            },
            success: { iconTheme: { primary: '#2F8266', secondary: '#F5F6F1' } },
            error: { iconTheme: { primary: '#C6604A', secondary: '#F5F6F1' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
