import { Request, Response } from "express";
import { verifyWebhook } from "../integrations/paymentAdapter";
import Order from "../models/Order";
import Product from "../models/UserProduct";
import { AlgoliaProduct, indexProducts } from "../integrations/searchAdapter";

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') {
    res.status(400).send('Missing Stripe-Signature');
    return;
  }

  let event;

  try {
    event = verifyWebhook(req.body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    res.status(400).send('Invalid signature');
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        if (session.payment_status !== 'paid') break;
  
        const orderId = Number(session.client_reference_id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
          console.warn('Order ID not valid', orderId);
          break;
        }
  
        const response = await Order.markPaid(orderId);
  
        if (!response) {
          console.warn('Order already handled or not found:', orderId);
          break;
        }
  
        try {
          const order = await Order.findById(orderId);

          if (!order) {
            console.warn('Order not found', orderId);
            break;
          }
  
          const algoliaProducts: AlgoliaProduct[] = [];
          for (const product of order.products) {
            const productData = await Product.findByIdUser(product.productId);
            if (!productData) continue;
  
            algoliaProducts.push({
              productId: productData.productId,
              productName: productData.productName,
              categoryName: productData.categoryName,
              price: productData.price,
              inStock: productData.inStock,
              imgUrl: productData.imgUrl,
              desc: productData.desc,
              attributes: productData.attributes
            });
          }
          if (algoliaProducts.length > 0) {
            await indexProducts(algoliaProducts);
          }
        } catch (error) {
          console.warn('Error while updating quantity in Algolia:', error);
        }
        break;
      }
  
      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = Number(session.client_reference_id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
          console.warn('Order ID not valid', orderId);
          break;
        }
  
        await Order.markCancelled(orderId);
        break;
      }
  
      default:
        break;
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Error while handling order', error);
    res.status(500).json({ received: false });
  }
};