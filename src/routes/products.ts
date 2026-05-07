import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { products } from '../data/store';
import { NewProduct, ApiError } from '../types';

const router = Router();

const REQUIRED_FIELDS: (keyof NewProduct)[] = ['name', 'description', 'model', 'sku', 'cost', 'imageUrl'];

function validateNewProduct(body: unknown): body is NewProduct {
  if (typeof body !== 'object' || body === null) return false;
  return REQUIRED_FIELDS.every((f) => f in (body as object));
}

// PUT /api/products — list all products (per spec operationId: getProducts)
router.put('/', (_req: Request, res: Response) => {
  res.status(200).json(Array.from(products.values()));
});

// POST /api/products — create product
router.post('/', (req: Request, res: Response) => {
  if (!validateNewProduct(req.body)) {
    const err: ApiError = { status: '400', message: `Missing required fields: ${REQUIRED_FIELDS.join(', ')}` };
    res.status(400).json(err);
    return;
  }

  const product = { id: randomUUID(), ...req.body };
  products.set(product.id, product);

  res.setHeader('Location', `/api/products/${product.id}`);
  res.status(201).json(product);
});

// GET /api/products/:productId
router.get('/:productId', (req: Request, res: Response) => {
  const product = products.get(req.params.productId);
  if (!product) {
    const err: ApiError = { status: '404', message: 'Product not found.' };
    res.status(404).json(err);
    return;
  }
  res.status(200).json(product);
});

// PUT /api/products/:productId — update product
router.put('/:productId', (req: Request, res: Response) => {
  const existing = products.get(req.params.productId);
  if (!existing) {
    const err: ApiError = { status: '404', message: 'Product not found.' };
    res.status(404).json(err);
    return;
  }

  if (!validateNewProduct(req.body)) {
    const err: ApiError = { status: '400', message: `Missing required fields: ${REQUIRED_FIELDS.join(', ')}` };
    res.status(400).json(err);
    return;
  }

  const updated = { id: existing.id, ...req.body };
  products.set(existing.id, updated);

  res.setHeader('Location', `/api/products/${updated.id}`);
  res.status(200).json(updated);
});

// DELETE /api/products/:productId
router.delete('/:productId', (req: Request, res: Response) => {
  if (!products.has(req.params.productId)) {
    const err: ApiError = { status: '404', message: 'Product not found.' };
    res.status(404).json(err);
    return;
  }
  products.delete(req.params.productId);
  res.status(204).send();
});

export default router;
