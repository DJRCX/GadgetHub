import { safeStorage } from './safeStorage';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
}

export const logger = {
  log: (level: 'info' | 'warn' | 'error', message: string, details?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    };

    if (process.env.NODE_ENV === 'development') {
      if (details) {
        console[level](message, details);
      } else {
        console[level](message);
      }
    }

    const logs = safeStorage.getItem<LogEntry[]>('_app_logs') || [];
    logs.push(entry);
    
    // Keep only last 100 logs
    if (logs.length > 100) logs.shift();
    
    safeStorage.setItem('_app_logs', logs);
  },
  info: (msg: string, details?: any) => logger.log('info', msg, details),
  warn: (msg: string, details?: any) => logger.log('warn', msg, details),
  error: (msg: string, details?: any) => logger.log('error', msg, details),
};
