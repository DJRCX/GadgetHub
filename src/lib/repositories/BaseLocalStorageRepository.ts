import { safeStorage } from '../utils/safeStorage';

export class BaseLocalStorageRepository<T extends { id: string }> {
  constructor(protected storageKey: string) {}

  async getAll(): Promise<T[]> {
    return safeStorage.getItem<T[]>(this.storageKey) || [];
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(item: T): Promise<T> {
    const items = await this.getAll();
    items.push(item);
    safeStorage.setItem(this.storageKey, items);
    return item;
  }

  async createMany(newItems: T[]): Promise<T[]> {
    const items = await this.getAll();
    const updatedItems = [...items, ...newItems];
    safeStorage.setItem(this.storageKey, updatedItems);
    return newItems;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    safeStorage.setItem(this.storageKey, items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    
    safeStorage.setItem(this.storageKey, filtered);
    return true;
  }
}
