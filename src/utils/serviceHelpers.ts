import { withErrorHandling } from './errorHandler';

// Rate limiting utility
class RateLimiter {
  private limits = new Map<string, number>();
  private readonly cooldown: number;

  constructor(cooldown = 1000) {
    this.cooldown = cooldown;
  }

  checkLimit(key: string): boolean {
    const now = Date.now();
    const lastUsed = this.limits.get(key) || 0;

    if (now - lastUsed < this.cooldown) {
      return false;
    }

    this.limits.set(key, now);
    return true;
  }

  reset(key?: string): void {
    if (key) {
      this.limits.delete(key);
    } else {
      this.limits.clear();
    }
  }
}

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  maxDelay = 10000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calculate exponential backoff delay
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      
      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000;

      console.warn(`Attempt ${attempt} failed, retrying in ${Math.round(jitteredDelay)}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
    }
  }

  throw lastError!;
};

// Error classification utility
export const isRetryableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;

  const retryablePatterns = [
    /network/i,
    /timeout/i,
    /rate limit/i,
    /temporarily unavailable/i,
    /service unavailable/i,
    /internal server error/i,
    /502/,
    /503/,
    /504/,
  ];

  return retryablePatterns.some(pattern => 
    pattern.test(error.message) || 
    (error as any).code && pattern.test(String((error as any).code))
  );
};

// User-friendly error message utility
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('connection')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  if (message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  if (message.includes('unauthorized') || message.includes('authentication')) {
    return 'Authentication failed. Please check your credentials.';
  }

  if (message.includes('forbidden') || message.includes('permission')) {
    return 'Permission denied. You may not have access to perform this action.';
  }

  if (message.includes('not found')) {
    return 'The requested resource was not found.';
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return 'Invalid input. Please check your data and try again.';
  }

  // Return original message for development, generic message for production
  return import.meta.env.DEV ? error.message : 'An error occurred. Please try again.';
};

// Multi-language response utility
export class ResponseLocalizer {
  private static responses = {
    my: {
      help: `🤖 *STRATEGIC HQ WhatsApp Bot*

📋 *Arahan yang tersedia:*
• status jualan - Status jualan terkini
• check stok - Semak status stok
• stok rendah - Lihat stok yang rendah
• revenue harini - Jumlah revenue hari ini  
• order stok [nama] - Tempah stok baru
• help - Papar mesej ini

💡 *Tip:* Semua arahan dalam Bahasa Melayu
🔗 *Powered by CORNMAN Strategic HQ*`,

      stockLow: '⚠️ Stok rendah untuk',
      orderSuccess: '✅ Order berjaya dicatat',
      orderFailed: '❌ Gagal memproses order',
      noStock: '❌ Item tidak dijumpai dalam inventori',
      salesStatus: '📊 *Status Jualan*',
      revenue: 'Jumlah revenue',
      unknownCommand: '❓ Arahan tidak dikenali. Taip "help" untuk senarai arahan.',
      error: '❌ Ralat berlaku. Sila cuba lagi.',
      rateLimit: '⏳ Sila tunggu sebentar sebelum menghantar mesej lain.',
    },
    en: {
      help: `🤖 *STRATEGIC HQ WhatsApp Bot*

📋 *Available commands:*
• sales status - Current sales status
• check stock - Check stock levels
• low stock - View low stock items
• today revenue - Today's revenue total
• order stock [name] - Order new stock
• help - Show this message

💡 *Tip:* All commands available in English
🔗 *Powered by CORNMAN Strategic HQ*`,

      stockLow: '⚠️ Low stock for',
      orderSuccess: '✅ Order successfully recorded',
      orderFailed: '❌ Failed to process order',
      noStock: '❌ Item not found in inventory',
      salesStatus: '📊 *Sales Status*',
      revenue: 'Total revenue',
      unknownCommand: '❓ Unknown command. Type "help" for list of commands.',
      error: '❌ An error occurred. Please try again.',
      rateLimit: '⏳ Please wait a moment before sending another message.',
    }
  };

  static getMessage(key: string, lang: 'my' | 'en' = 'my'): string {
    return this.responses[lang]?.[key as keyof typeof this.responses.my] || 
           this.responses.my[key as keyof typeof this.responses.my] || 
           key;
  }

  static detectLanguage(message: string): 'my' | 'en' {
    const malayWords = ['status', 'stok', 'jualan', 'revenue', 'harini', 'rendah', 'order', 'help'];
    const englishWords = ['sales', 'stock', 'revenue', 'today', 'order', 'help', 'check', 'low'];

    const malayCount = malayWords.filter(word => message.toLowerCase().includes(word)).length;
    const englishCount = englishWords.filter(word => message.toLowerCase().includes(word)).length;

    return malayCount >= englishCount ? 'my' : 'en';
  }
}

// Service wrapper with enhanced error handling
export const createEnhancedService = <T extends object>(
  service: T,
  serviceName: string
): T => {
  const rateLimiter = new RateLimiter();

  return new Proxy(service, {
    get(target, prop) {
      const value = target[prop as keyof T];

      if (typeof value === 'function') {
        return async (...args: any[]) => {
          // Check rate limiting for certain operations
          const methodName = String(prop);
          if (['send', 'create', 'update', 'delete'].some(op => methodName.toLowerCase().includes(op))) {
            const rateLimitKey = `${serviceName}-${methodName}`;
            if (!rateLimiter.checkLimit(rateLimitKey)) {
              throw new Error('Rate limit exceeded');
            }
          }

          // Wrap with error handling and retry logic
          return withErrorHandling(
            () => retryWithBackoff(() => value.apply(target, args)),
            { type: 'api', operation: `${serviceName}.${methodName}` }
          )();
        };
      }

      return value;
    }
  });
};

export { RateLimiter };