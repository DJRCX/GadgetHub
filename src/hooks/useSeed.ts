import { useEffect } from 'react';
import seedData from '../data/seed.json';
import { productRepository, categoryRepository, bannerRepository, userRepository, orderRepository } from '../lib/services/repositories';
import { safeStorage } from '../lib/utils/safeStorage';

const SEED_VERSION = 'v1.4';

export function useSeed(onSeeded?: () => void) {
  useEffect(() => {
    const seed = async () => {
      const currentVersion = safeStorage.getItem<string>('seed_version');
      
      if (currentVersion !== SEED_VERSION) {
        console.log(`Seeding database (Version ${SEED_VERSION})...`);
        
        // Clear all current data to ensure clean seed
        safeStorage.removeItem('elecshop_products');
        safeStorage.removeItem('elecshop_categories');
        safeStorage.removeItem('elecshop_banners');
        safeStorage.removeItem('elecshop_users');
        safeStorage.removeItem('elecshop_orders');
        safeStorage.removeItem('gadgethub_products');
        safeStorage.removeItem('gadgethub_categories');
        safeStorage.removeItem('gadgethub_banners');
        safeStorage.removeItem('gadgethub_users');
        safeStorage.removeItem('gadgethub_orders');

        // Seed new data
        await categoryRepository.createMany(seedData.categories as any[]);
        await productRepository.createMany(seedData.products as any[]);
        await bannerRepository.createMany(seedData.banners as any[]);
        await userRepository.createMany(seedData.users as any[]);
        await orderRepository.createMany(seedData.orders as any[]);
        
        safeStorage.setItem('seed_version', SEED_VERSION);
        console.log('Seeding complete.');
        onSeeded?.();
      }
    };
    
    seed();
  }, [onSeeded]);
}
