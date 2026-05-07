import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { orders } from '../data/store';
import { NewOrder, OrderStatus, ApiError } from '../types';

const router = Router();

const VALID_STATUSES: OrderStatus[] = ['OPEN', 'PAID', 'SHIPPED', 'RECEIVED'];
const REQUIRED_FIELDS: (keyof NewOrder)[] = ['status', 'date', 'productIds', 'cost', 'tax', 'taxRate', 'total'];

function validateNewOrder(body: unknown): body is NewOrder {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!REQUIRED_FIELDS.every((f) => f in b)) return false;
  if (!VALID_STATUSES.includes(b['status'] as OrderStatus)) return false;
  return true;
}

// GET /api/orders — list all orders
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(Array.from(orders.values()));
});

// POST /api/orders — create order
router.post('/', (req: Request, res: Response) => {
  if (!validateNewOrder(req.body)) {
    const err: ApiError = {
      status: '400',
      message: `Missing or invalid fields. Required: ${REQUIRED_FIELDS.join(', ')}. Status must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
    res.status(400).json(err);
    return;
  }

  const order = { id: randomUUID(), ...req.body };
  orders.set(order.id, order);

  res.setHeader('Location', `/api/orders/${order.id}`);
  res.status(201).json(order);
});

// GET /api/orders/:orderId
router.get('/:orderId', (req: Request, res: Response) => {
  const order = orders.get(req.params.orderId);
  if (!order) {
    const err: ApiError = { status: '404', message: 'Order not found.' };
    res.status(404).json(err);
    return;
  }
  res.status(200).json(order);
});

// PUT /api/orders/:orderId — update order
router.put('/:orderId', (req: Request, res: Response) => {
  const existing = orders.get(req.params.orderId);
  if (!existing) {
    const err: ApiError = { status: '404', message: 'Order not found.' };
    res.status(404).json(err);
    return;
  }

  if (!validateNewOrder(req.body)) {
    const err: ApiError = {
      status: '400',
      message: `Missing or invalid fields. Required: ${REQUIRED_FIELDS.join(', ')}. Status must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
    res.status(400).json(err);
    return;
  }

  const updated = { id: existing.id, ...req.body };
  orders.set(existing.id, updated);

  res.setHeader('Location', `/api/orders/${updated.id}`);
  res.status(200).json(updated);
});

// DELETE /api/orders/:orderId
router.delete('/:orderId', (req: Request, res: Response) => {
  if (!orders.has(req.params.orderId)) {
    const err: ApiError = { status: '404', message: 'Order not found.' };
    res.status(404).json(err);
    return;
  }
  orders.delete(req.params.orderId);
  res.status(204).send();
});

export default router;
