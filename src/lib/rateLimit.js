/** route: src/lib/rateLimit.js */

// Simple in-memory rate limiter (for production, use Redis)
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // 5 attempts per window

export function rateLimit(identifier, maxAttempts = MAX_ATTEMPTS, windowMs = WINDOW_MS) {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
  // Clean up old entries
  for (const [k, v] of attempts.entries()) {
    if (now - v.firstAttempt > windowMs) {
      attempts.delete(k);
    }
  }
  
  const current = attempts.get(key);
  
  if (!current) {
    attempts.set(key, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Reset if window expired
  if (now - current.firstAttempt > windowMs) {
    attempts.set(key, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Check if exceeded limit
  if (current.count >= maxAttempts) {
    const resetTime = current.firstAttempt + windowMs;
    return { 
      allowed: false, 
      remaining: 0,
      resetTime,
      retryAfter: Math.ceil((resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  current.count++;
  current.lastAttempt = now;
  attempts.set(key, current);
  
  return { 
    allowed: true, 
    remaining: maxAttempts - current.count 
  };
}

// Get client IP for rate limiting
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return 'unknown';
}



