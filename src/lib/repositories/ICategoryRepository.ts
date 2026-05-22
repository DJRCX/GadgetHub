import { Category } from '../types';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(id: string, category: Partial<Category>): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}
