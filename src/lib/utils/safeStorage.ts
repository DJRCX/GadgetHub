const isClient = typeof window !== 'undefined';

export const safeStorage = {
  getItem: <T>(key: string): T | null => {
    if (!isClient) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return null;
    }
  },
  setItem: <T>(key: string, value: T): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage`, error);
    }
  },
  removeItem: (key: string): void => {
    if (!isClient) return;
    localStorage.removeItem(key);
  },
};
