import { productRepository } from './repositories';
import { Product } from '../types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const products = await productRepository.getAll();
    return products.map(productService.computeFields);
  },
  
  getById: async (id: string): Promise<Product | null> => {
    const product = await productRepository.getById(id);
    return product ? productService.computeFields(product) : null;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = { ...product, id: `prod-${Date.now()}` } as Product;
    const created = await productRepository.create(newProduct);
    return productService.computeFields(created);
  },

  update: async (id: string, product: Partial<Product>): Promise<Product | null> => {
    const updated = await productRepository.update(id, product);
    return updated ? productService.computeFields(updated) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    return productRepository.delete(id);
  },

  computeFields: (product: Product): Product => {
    let discountPercent = undefined;
    if (product.salePrice && product.salePrice < product.price) {
      discountPercent = Math.round((1 - product.salePrice / product.price) * 100);
    }
    return { ...product, discountPercent };
  }
};
