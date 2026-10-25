import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
/* import path from "path"; */
import { initDatabase } from "./config/dbInit";
import adminProductRoutes from './routes/adminProductRoutes';
import userProductRoutes from './routes/userProductRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import adminRoutes from './routes/adminRoutes';
import cookieParser from "cookie-parser";
import categoryRoutes from './routes/categoryRoutes';
import currencyRoutes from './routes/currencyRoutes';
import stripeWebhookRouter from './routes/stripeWebhookRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL
  : 'http://localhost:5173',
  credentials: true 
}));

app.use('/api/stripe/webhook', stripeWebhookRouter);

app.use(express.json());
app.use(cookieParser());

app.use('/api/admin/products', adminProductRoutes);
app.use('/api/user/products', userProductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/currency', currencyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const start = async () => {
  try {
    await initDatabase();

    app.listen(PORT, async () => {
      console.log(`Server is running on PORT:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database error:', error);
    process.exit(1);
  }
}

start();