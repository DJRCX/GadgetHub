import { User } from '../types';
import { IUserRepository } from './IUserRepository';
import { BaseLocalStorageRepository } from './BaseLocalStorageRepository';

export class LocalStorageUserRepository 
  extends BaseLocalStorageRepository<User> 
  implements IUserRepository {
  constructor() {
    super('gadgethub_users');
  }
}
