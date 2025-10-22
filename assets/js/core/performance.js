/**
 * Performance Utilities
 * Optimizations for better performance following Clean Code principles
 */

/**
 * Debounced function execution for performance
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttled function execution for performance
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy loading utility for images and components
 */
export class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.options
      );
    }
  }

  observe(element, callback) {
    if (this.observer) {
      element.dataset.lazyCallback = callback.toString();
      this.observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      callback();
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const callback = entry.target.dataset.lazyCallback;
        if (callback) {
          eval(callback)();
          this.observer.unobserve(entry.target);
        }
      }
    });
  }
}

/**
 * Memory-efficient event listener management
 */
export class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  add(element, event, handler, options = {}) {
    const key = `${element}-${event}`;
    
    if (this.listeners.has(key)) {
      this.remove(element, event);
    }
    
    element.addEventListener(event, handler, options);
    this.listeners.set(key, { element, event, handler, options });
  }

  remove(element, event) {
    const key = `${element}-${event}`;
    const listener = this.listeners.get(key);
    
    if (listener) {
      element.removeEventListener(event, listener.handler, listener.options);
      this.listeners.delete(key);
    }
  }

  removeAll() {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners.clear();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTiming(name) {
    this.metrics.set(name, performance.now());
  }

  endTiming(name) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      return duration;
    }
    return null;
  }

  measureFunction(name, func) {
    this.startTiming(name);
    const result = func();
    const duration = this.endTiming(name);
    
    if (CONFIG.FEATURES.DEBUG_MODE) {
      console.log(`Function ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  async measureAsyncFunction(name, asyncFunc) {
    this.startTiming(name);
    const result = await asyncFunc();
    const duration = this.endTiming(name);
    
    if (CONFIG.FEATURES.DEBUG_MODE) {
      console.log(`Async function ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
}

/**
 * DOM manipulation optimizations
 */
export class DOMOptimizer {
  static batchDOMUpdates(updates) {
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }

  static createDocumentFragment(elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach(element => fragment.appendChild(element));
    return fragment;
  }

  static optimizeScrollListener(callback, throttleDelay = 16) {
    const throttledCallback = throttle(callback, throttleDelay);
    return throttledCallback;
  }
}

/**
 * Caching utilities for performance
 */
export class Cache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Global instances
export const globalEventManager = new EventManager();
export const globalPerformanceMonitor = new PerformanceMonitor();
export const globalCache = new Cache();
