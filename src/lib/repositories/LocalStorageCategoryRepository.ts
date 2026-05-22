import { Category } from '../types';
import { ICategoryRepository } from './ICategoryRepository';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

export class LocalStorageCategoryRepository 
  extends BaseLocalStorageRepository<Category> 
  implements ICategoryRepository {
  constructor() {
    super('gadgethub_categories');
  }
}
