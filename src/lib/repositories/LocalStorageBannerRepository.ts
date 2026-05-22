import { Banner } from '../types';
import { IBannerRepository } from './IBannerRepository';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

export class LocalStorageBannerRepository 
  extends BaseLocalStorageRepository<Banner> 
  implements IBannerRepository {
  constructor() {
    super('gadgethub_banners');
  }
}
