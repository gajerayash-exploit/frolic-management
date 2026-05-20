import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { initApiClient } from './config/api.js'
import { initAppearance } from './utils/initAppearance.js'
import './index.css'

// Apply saved appearance preferences (theme, font size) before first paint
initAppearance()
initApiClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
