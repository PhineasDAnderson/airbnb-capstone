import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
/**
                  * main.jsx:
 *  Purpose: It's the entry point that mounts the root React element into the DOM 
 * and wraps the app with BrowserRouter to enable HTML5 history API client-side routing.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)