import { Order } from '../types';

export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(id: string, order: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}
