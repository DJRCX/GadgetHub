import { LocalStorageProductRepository } from '../repositories/LocalStorageProductRepository';
import { LocalStorageOrderRepository } from '../repositories/LocalStorageOrderRepository';
import { LocalStorageCategoryRepository } from '../repositories/LocalStorageCategoryRepository';
import { LocalStorageBannerRepository } from '../repositories/LocalStorageBannerRepository';
import { LocalStorageUserRepository } from '../repositories/LocalStorageUserRepository';

export const productRepository = new LocalStorageProductRepository();
export const orderRepository = new LocalStorageOrderRepository();
export const categoryRepository = new LocalStorageCategoryRepository();
export const bannerRepository = new LocalStorageBannerRepository();
export const userRepository = new LocalStorageUserRepository();
