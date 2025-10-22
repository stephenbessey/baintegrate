/**
 * Error Handling Utilities
 * Centralized error handling following Clean Code principles
 */

import CONFIG from './config.js';

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

export class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error handler class
 */
export class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      logErrors: options.logErrors !== false,
      showUserFriendlyMessages: options.showUserFriendlyMessages !== false,
      ...options
    };
  }

  /**
   * Handle different types of errors
   */
  handle(error, context = {}) {
    if (this.options.logErrors) {
      this.logError(error, context);
    }

    if (this.options.showUserFriendlyMessages) {
      this.showUserFriendlyMessage(error);
    }

    return this.getErrorResponse(error);
  }

  /**
   * Log error with context
   */
  logError(error, context) {
    const errorInfo = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Error occurred:', errorInfo);
  }

  /**
   * Show user-friendly error message
   */
  showUserFriendlyMessage(error) {
    const message = this.getUserFriendlyMessage(error);
    this.displayErrorMessage(message);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error) {
    switch (error.name) {
      case 'ValidationError':
        return error.message;
      
      case 'NetworkError':
        return this.getNetworkErrorMessage(error);
      
      case 'ConfigurationError':
        return 'There was a configuration error. Please contact support.';
      
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get network-specific error message
   */
  getNetworkErrorMessage(error) {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    return 'Network error occurred. Please try again.';
  }

  /**
   * Display error message to user
   */
  displayErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '9999',
      maxWidth: '400px',
      fontSize: '14px'
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
      notification.remove();
    }, CONFIG.UI.TOAST_DURATION);
  }

  /**
   * Get standardized error response
   */
  getErrorResponse(error) {
    return {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        field: error.field || null,
        status: error.status || null
      }
    };
  }
}

/**
 * Global error handler instance
 */
export const globalErrorHandler = new ErrorHandler();

/**
 * Safe async wrapper for functions
 */
export const safeAsync = (asyncFunction) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      return globalErrorHandler.handle(error, { function: asyncFunction.name });
    }
  };
};

/**
 * Safe sync wrapper for functions
 */
export const safeSync = (syncFunction) => {
  return (...args) => {
    try {
      return syncFunction(...args);
    } catch (error) {
      return globalErrorHandler.handle(error, { function: syncFunction.name });
    }
  };
};

/**
 * Retry mechanism for network operations
 */
export const withRetry = (asyncFunction, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
};
