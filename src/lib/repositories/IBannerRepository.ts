import { Banner } from '../types';

export interface IBannerRepository {
  getAll(): Promise<Banner[]>;
  getById(id: string): Promise<Banner | null>;
  create(banner: Banner): Promise<Banner>;
  update(id: string, banner: Partial<Banner>): Promise<Banner | null>;
  delete(id: string): Promise<boolean>;
}
