/**
 * Configuration Module
 * Centralized configuration for the application
 */

const CONFIG = {
  // API Configuration - Using window.location to determine environment
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : 'https://api.baintegrate.com',
  API_VERSION: 'v1',
  
  // API Endpoints
  ENDPOINTS: {
    CONTACT: '/api/v1/contact',
    BUSINESS_REGISTRATION: '/api/v1/business-registration',
    DEMO_REQUEST: '/api/v1/demo-generation/generate',
    NEWSLETTER: '/api/v1/newsletter/subscribe',
    BUSINESSES: '/api/v1/businesses',
    BUSINESS_DASHBOARD: '/api/v1/dashboard/business',
    PLATFORM_DASHBOARD: '/api/v1/dashboard/platform',
  },
  
  // Feature Flags
  FEATURES: {
    ANALYTICS_ENABLED: true,
    DEMO_MODE: false,
    DEBUG_MODE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  },
  
  // Contact Information
  CONTACT: {
    EMAIL: 'contact@baintegrate.com',
    SALES_EMAIL: 'sales@baintegrate.com',
    SUPPORT_EMAIL: 'support@baintegrate.com',
    PARTNERSHIPS_EMAIL: 'partnerships@baintegrate.com',
  },
  
  // Social Media
  SOCIAL: {
    TWITTER: 'https://twitter.com/baintegrate',
    LINKEDIN: 'https://linkedin.com/company/baintegrate',
    GITHUB: 'https://github.com/baintegrate',
  },
  
  // Application Settings
  APP: {
    NAME: 'BA Integrate',
    DESCRIPTION: 'Enterprise AI Agent Integration Platform',
    URL: 'https://baintegrate.com',
  },
  
  // Validation Rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    MIN_MESSAGE_LENGTH: 10,
    MAX_MESSAGE_LENGTH: 1000,
  },
  
  // UI Settings
  UI: {
    TOAST_DURATION: 5000,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 500,
    PHONE_FORMAT_DEBOUNCE: 500,
    NOTIFICATION_DISPLAY_DURATION: 5000,
    NOTIFICATION_FADE_DURATION: 300,
    FOCUS_DELAY: 300,
    SCROLL_BEHAVIOR_DELAY: 100,
  },
};

export default CONFIG;
