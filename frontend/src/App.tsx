import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/admin/LoginPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ProductPage } from './pages/admin/ProductPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/admin/login' element={<LoginPage />} />
          </Routes>
          <Routes>
            <Route path='/admin/products' element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }>
          </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
