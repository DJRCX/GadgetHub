import { Product } from '../types';
import { IProductRepository } from './IProductRepository';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

export class LocalStorageProductRepository 
  extends BaseLocalStorageRepository<Product> 
  implements IProductRepository {
  constructor() {
    super('gadgethub_products');
  }
}
