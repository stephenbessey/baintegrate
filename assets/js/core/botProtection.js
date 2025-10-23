/**
 * Bot Protection Utilities
 * Comprehensive bot detection and prevention for form submissions
 */

export class BotProtection {
  constructor() {
    this.submissionAttempts = new Map();
    this.blockedIPs = new Set();
    this.rateLimitWindow = 5 * 60 * 1000; // 5 minutes
    this.maxAttempts = 5;
  }

  /**
   * Check if submission is from a bot based on multiple factors
   * @param {Object} formData - Form submission data
   * @param {string} userAgent - User agent string
   * @param {string} ip - IP address
   * @returns {Object} - {isBot: boolean, reason: string}
   */
  detectBot(formData, userAgent = '', ip = '') {
    const checks = {
      honeypot: this.checkHoneypot(formData),
      timing: this.checkTiming(formData),
      userAgent: this.checkUserAgent(userAgent),
      rateLimit: this.checkRateLimit(ip),
      behavior: this.checkBehavior(formData)
    };

    const isBot = Object.values(checks).some(check => check.isBot);
    const reasons = Object.entries(checks)
      .filter(([_, check]) => check.isBot)
      .map(([type, check]) => check.reason);

    return {
      isBot,
      reason: reasons.join(', '),
      details: checks
    };
  }

  /**
   * Check honeypot fields for bot detection
   */
  checkHoneypot(formData) {
    const honeypotFields = ['website_url', 'company_size', 'phone_alt', 'email_alt'];
    const filledHoneypots = honeypotFields.filter(field => 
      formData[field] && formData[field].trim() !== ''
    );

    return {
      isBot: filledHoneypots.length > 0,
      reason: filledHoneypots.length > 0 ? `Honeypot fields filled: ${filledHoneypots.join(', ')}` : null
    };
  }

  /**
   * Check form submission timing (too fast = bot)
   */
  checkTiming(formData) {
    const startTime = formData._startTime || Date.now();
    const submissionTime = Date.now();
    const timeSpent = submissionTime - startTime;
    
    // Less than 10 seconds is suspicious
    const isTooFast = timeSpent < 10000;
    
    return {
      isBot: isTooFast,
      reason: isTooFast ? `Form submitted too quickly (${timeSpent}ms)` : null
    };
  }

  /**
   * Check user agent for bot signatures
   */
  checkUserAgent(userAgent) {
    const botSignatures = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python', 'java', 'php', 'ruby', 'perl', 'go-http'
    ];
    
    const isBotUA = botSignatures.some(signature => 
      userAgent.toLowerCase().includes(signature)
    );
    
    return {
      isBot: isBotUA,
      reason: isBotUA ? `Suspicious user agent: ${userAgent}` : null
    };
  }

  /**
   * Check rate limiting
   */
  checkRateLimit(ip) {
    const now = Date.now();
    const attempts = this.submissionAttempts.get(ip) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.rateLimitWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      this.blockedIPs.add(ip);
      return {
        isBot: true,
        reason: `Rate limit exceeded: ${recentAttempts.length} attempts in ${this.rateLimitWindow / 1000}s`
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.submissionAttempts.set(ip, recentAttempts);
    
    return { isBot: false, reason: null };
  }

  /**
   * Check behavioral patterns
   */
  checkBehavior(formData) {
    const suspiciousPatterns = [
      // All caps
      Object.values(formData).some(value => 
        typeof value === 'string' && value === value.toUpperCase() && value.length > 3
      ),
      // Repeated characters
      Object.values(formData).some(value => 
        typeof value === 'string' && /(.)\1{3,}/.test(value)
      ),
      // No spaces in names
      formData.first_name && !formData.first_name.includes(' '),
      // Suspicious email patterns
      formData.email && /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/i.test(formData.email)
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern);
    
    return {
      isBot: isSuspicious,
      reason: isSuspicious ? 'Suspicious behavioral patterns detected' : null
    };
  }

  /**
   * Generate CAPTCHA challenge
   */
  generateCaptcha() {
    const operations = [
      () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        return { question: `${a} + ${b} = ?`, answer: a + b };
      },
      () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        return { question: `${a} - ${b} = ?`, answer: a - b };
      },
      () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        return { question: `${a} × ${b} = ?`, answer: a * b };
      }
    ];

    return operations[Math.floor(Math.random() * operations.length)]();
  }

  /**
   * Validate CAPTCHA answer
   */
  validateCaptcha(userAnswer, correctAnswer) {
    return parseInt(userAnswer) === correctAnswer;
  }

  /**
   * Log bot attempt for analysis
   */
  logBotAttempt(detection, formData, ip, userAgent) {
    console.warn('Bot detected:', {
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      detection,
      formData: this.sanitizeFormData(formData)
    });
  }

  /**
   * Sanitize form data for logging (remove sensitive info)
   */
  sanitizeFormData(formData) {
    const sanitized = { ...formData };
    const sensitiveFields = ['password', 'ssn', 'credit_card'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
}

/**
 * Form validation with bot protection
 */
export class SecureFormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    this.botProtection = new BotProtection();
    this.rateLimiter = new RateLimiter();
    this.options = {
      enableHoneypot: true,
      enableCaptcha: true,
      enableRateLimit: true,
      ...options
    };
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    // Add honeypot fields
    if (this.options.enableHoneypot) {
      this.addHoneypotFields();
    }
    
    // Add CAPTCHA
    if (this.options.enableCaptcha) {
      this.addCaptcha();
    }
    
    // Add form submission tracking
    this.addSubmissionTracking();
  }

  addHoneypotFields() {
    const honeypotHTML = `
      <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none; tabindex: -1;" aria-hidden="true">
        <label for="website_url">Website URL (leave blank)</label>
        <input type="text" id="website_url" name="website_url" tabindex="-1" autocomplete="off">
      </div>
    `;
    
    this.form.insertAdjacentHTML('beforeend', honeypotHTML);
  }

  addCaptcha() {
    const captchaHTML = `
      <div class="form-group">
        <label class="form-label">Security Verification <span class="required">*</span></label>
        <div class="captcha-container" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--color-background-light); border-radius: var(--border-radius-md); border: 1px solid var(--color-border);">
          <div class="captcha-challenge" style="font-family: monospace; font-size: 1.5rem; font-weight: bold; color: var(--color-primary); user-select: none;">
            <span id="captcha-text">Loading...</span>
          </div>
          <input type="number" id="captcha_answer" name="captcha_answer" class="form-input" placeholder="Answer" required style="width: 100px; text-align: center;">
          <button type="button" id="refresh-captcha" style="padding: 0.5rem; background: var(--color-primary); color: white; border: none; border-radius: var(--border-radius-sm); cursor: pointer;">↻</button>
        </div>
      </div>
    `;
    
    this.form.insertAdjacentHTML('beforeend', captchaHTML);
    this.initCaptcha();
  }

  initCaptcha() {
    let captchaAnswer = 0;
    
    const generateCaptcha = () => {
      const challenge = this.botProtection.generateCaptcha();
      captchaAnswer = challenge.answer;
      document.getElementById('captcha-text').textContent = challenge.question;
    };
    
    const validateCaptcha = () => {
      const userAnswer = parseInt(document.getElementById('captcha_answer').value);
      return this.botProtection.validateCaptcha(userAnswer, captchaAnswer);
    };
    
    // Initialize
    generateCaptcha();
    
    // Refresh button
    document.getElementById('refresh-captcha').addEventListener('click', generateCaptcha);
    
    // Store validation function
    this.validateCaptcha = validateCaptcha;
  }

  addSubmissionTracking() {
    this.form.addEventListener('submit', (e) => {
      // Add start time
      const startTime = Date.now();
      this.form._startTime = startTime;
    });
  }

  validateSubmission(formData, ip = '', userAgent = '') {
    // Check rate limiting
    if (this.options.enableRateLimit && !this.rateLimiter.isAllowed(ip)) {
      return { valid: false, reason: 'Rate limit exceeded' };
    }
    
    // Check for bots
    const botDetection = this.botProtection.detectBot(formData, userAgent, ip);
    if (botDetection.isBot) {
      this.botProtection.logBotAttempt(botDetection, formData, ip, userAgent);
      return { valid: false, reason: `Bot detected: ${botDetection.reason}` };
    }
    
    // Validate CAPTCHA
    if (this.options.enableCaptcha && this.validateCaptcha && !this.validateCaptcha()) {
      return { valid: false, reason: 'CAPTCHA validation failed' };
    }
    
    return { valid: true, reason: 'All checks passed' };
  }
}

export default BotProtection;
