import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/admin/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ProductPage } from './pages/admin/ProductPage';
import { ProductDetailPage } from './pages/admin/ProductDetailPage';
import { CreateProductPage } from './pages/admin/CreateProductPage';
import { OrderPage } from './pages/admin/OrderPage';
import { OrderDetailPage } from './pages/admin/OrderDetailPage';
import { UserProductPage } from './pages/user/UserProductPage';
import { UserProductDetailPage } from './pages/user/UserProductDetailPage';
import { CartProvider } from './context/CartContext';
import { CheckoutPage } from './pages/user/CheckoutPage';
import { OrderConfirmationPage } from './pages/user/OrderConfirmationPage';
import { HomePage } from './pages/user/Homepage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthProvider><Outlet /></AuthProvider>}>
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
          </Route>
          
          <Route element={<CartProvider><Outlet /></CartProvider>}>
            <Route path='/shop/products' element={
              <UserProductPage />
            }/>
            <Route path='/shop/products/:id' element={
              <UserProductDetailPage />
            }/>
            <Route path='/shop/checkout' element={
              <CheckoutPage />
            }/>
            <Route path='/shop/order-confirmation' element={
              <OrderConfirmationPage />
            }/>
            <Route path='/' element={
              <HomePage />
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App
