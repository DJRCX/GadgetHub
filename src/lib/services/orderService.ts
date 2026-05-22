import { orderRepository } from './repositories';
import { Order } from '../types';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    return orderRepository.getAll();
  },
  
  getById: async (id: string): Promise<Order | null> => {
    return orderRepository.getById(id);
  },

  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const now = new Date().toISOString();
    const newOrder = { 
      ...order, 
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: now,
      updatedAt: now
    } as Order;
    return orderRepository.create(newOrder);
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order | null> => {
    return orderRepository.update(id, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return orderRepository.delete(id);
  },
};
