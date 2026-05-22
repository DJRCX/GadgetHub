import { Order } from '../types';
import { IOrderRepository } from './IOrderRepository';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

export class LocalStorageOrderRepository 
  extends BaseLocalStorageRepository<Order> 
  implements IOrderRepository {
  constructor() {
    super('gadgethub_orders');
  }
}
