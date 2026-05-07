import express from 'express';
import { apiKeyAuth } from './middleware/auth';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(apiKeyAuth);

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ status: '404', message: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`Products & Orders API server running on port ${PORT}`);
});

export default app;
