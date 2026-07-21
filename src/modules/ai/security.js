class AISecurity {
  constructor() {
    this.suspiciousPatterns = [
      /ignore previous instructions/i,
      /forget everything/i,
      /system prompt/i,
      /bypass rules/i,
      /act as an unrestricted/i,
      /database password/i,
      /api key/i,
      /drop table/i,
      /select \* from/i
    ];
    
    // Simple in-memory rate limiter
    this.requests = new Map();
    this.LIMIT = 20; // max requests
    this.WINDOW_MS = 60 * 1000; // 1 minute
  }

  checkPromptInjection(query) {
    if (!query) return false;
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(query)) {
        console.warn(`[AI SECURITY] Suspicious prompt detected: ${query}`);
        return true; // injection detected
      }
    }
    return false;
  }

  checkRateLimit(userId) {
    if (!userId) return false; // Default to allow if no user, but should not happen
    const now = Date.now();
    if (!this.requests.has(userId)) {
      this.requests.set(userId, [{ timestamp: now }]);
      return false;
    }

    const history = this.requests.get(userId);
    const validHistory = history.filter(req => now - req.timestamp < this.WINDOW_MS);
    
    if (validHistory.length >= this.LIMIT) {
      console.warn(`[AI SECURITY] Rate limit exceeded for user ${userId}`);
      return true; // Limit exceeded
    }

    validHistory.push({ timestamp: now });
    this.requests.set(userId, validHistory);
    return false; // Allowed
  }
}

module.exports = new AISecurity();
