import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/admin/LoginPage'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/admin/login' element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
