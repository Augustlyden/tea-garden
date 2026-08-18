import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/admin/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ProductPage } from './pages/admin/ProductPage';
import { ProductDetailPage } from './pages/admin/ProductDetailPage';
import { CreateProductPage } from './pages/admin/CreateProductPage';
import { OrderPage } from './pages/admin/OrderPage';
import { OrderDetailPage } from './pages/admin/OrderDetailPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/admin/login' element={<LoginPage />} />
            <Route path='/admin/products' element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }/>
            <Route path='/admin/products/:id' element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }/>
            <Route path='/admin/products/create' element={
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            }/>
            <Route path='/admin/orders' element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }/>
            <Route path='/admin/orders/:id' element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
