import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'

createRoot(document.getElementById('app') as HTMLElement).render(
  <div className="bg-[#f5f5f5] py-0 px-[10%]">
    <App />
  </div>
)
