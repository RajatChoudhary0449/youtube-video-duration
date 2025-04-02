import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import { DataContextProvider } from './context/DataContext.jsx'
import { TableContextProvider } from './context/TableContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataContextProvider>
      <TableContextProvider>
        <ToastContainer />
        <App />
      </TableContextProvider>
    </DataContextProvider>
  </StrictMode>,
)
