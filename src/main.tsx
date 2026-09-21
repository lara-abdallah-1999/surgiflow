import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/Toast'
import { Toaster } from "sonner";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
      <Toaster position="bottom-right" style={{ zIndex: 1000, width: "410px", maxWidth: "calc(100vw - 40px)" }} />
    </ToastProvider>
  </StrictMode>,
)
