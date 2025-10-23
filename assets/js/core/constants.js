/**
 * BAIS Constants and Enums
 * Centralized constants for the Business-Agent Integration Standard
 */

export const BUSINESS_TYPES = {
  HOSPITALITY: 'hospitality',
  FOOD_SERVICE: 'food_service',
  RETAIL: 'retail',
  HEALTHCARE: 'healthcare',
  FINANCE: 'finance',
  PROFESSIONAL_SERVICES: 'professional_services',
  EDUCATION: 'education',
  TECHNOLOGY: 'technology',
  CREATIVE: 'creative',
  OTHER: 'other'
};

export const BUSINESS_TYPE_LABELS = {
  [BUSINESS_TYPES.HOSPITALITY]: 'Hospitality',
  [BUSINESS_TYPES.FOOD_SERVICE]: 'Food Service',
  [BUSINESS_TYPES.RETAIL]: 'Retail',
  [BUSINESS_TYPES.HEALTHCARE]: 'Healthcare',
  [BUSINESS_TYPES.FINANCE]: 'Finance',
  [BUSINESS_TYPES.PROFESSIONAL_SERVICES]: 'Professional Services',
  [BUSINESS_TYPES.EDUCATION]: 'Education',
  [BUSINESS_TYPES.TECHNOLOGY]: 'Technology',
  [BUSINESS_TYPES.CREATIVE]: 'Creative',
  [BUSINESS_TYPES.OTHER]: 'Other'
};

export const WORKFLOW_PATTERNS = {
  BOOKING_CONFIRMATION_PAYMENT: 'booking_confirmation_payment',
  REQUEST_APPROVAL_PAYMENT: 'request_approval_payment',
  INSTANT_PURCHASE: 'instant_purchase',
  QUOTE_NEGOTIATION_CONTRACT: 'quote_negotiation_contract'
};

export const WORKFLOW_PATTERN_LABELS = {
  [WORKFLOW_PATTERNS.BOOKING_CONFIRMATION_PAYMENT]: 'Booking → Confirmation → Payment',
  [WORKFLOW_PATTERNS.REQUEST_APPROVAL_PAYMENT]: 'Request → Approval → Payment',
  [WORKFLOW_PATTERNS.INSTANT_PURCHASE]: 'Instant Purchase',
  [WORKFLOW_PATTERNS.QUOTE_NEGOTIATION_CONTRACT]: 'Quote → Negotiation → Contract'
};

export const WORKFLOW_PATTERN_DESCRIPTIONS = {
  [WORKFLOW_PATTERNS.BOOKING_CONFIRMATION_PAYMENT]: 'Customer books, receives confirmation, then pays',
  [WORKFLOW_PATTERNS.REQUEST_APPROVAL_PAYMENT]: 'Customer requests, business approves, then payment',
  [WORKFLOW_PATTERNS.INSTANT_PURCHASE]: 'Immediate purchase with instant payment',
  [WORKFLOW_PATTERNS.QUOTE_NEGOTIATION_CONTRACT]: 'Quote provided, negotiated, then contract signed'
};

export const PARAMETER_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  OBJECT: 'object',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time'
};

export const PARAMETER_TYPE_LABELS = {
  [PARAMETER_TYPES.STRING]: 'Text (String)',
  [PARAMETER_TYPES.INTEGER]: 'Whole Number (Integer)',
  [PARAMETER_TYPES.NUMBER]: 'Decimal Number',
  [PARAMETER_TYPES.BOOLEAN]: 'True/False (Boolean)',
  [PARAMETER_TYPES.ARRAY]: 'List (Array)',
  [PARAMETER_TYPES.OBJECT]: 'Complex Object',
  [PARAMETER_TYPES.DATE]: 'Date',
  [PARAMETER_TYPES.DATETIME]: 'Date & Time',
  [PARAMETER_TYPES.TIME]: 'Time'
};

export const PARAMETER_FORMATS = {
  DATE: 'date',
  DATETIME: 'date-time',
  TIME: 'time',
  EMAIL: 'email',
  URL: 'url',
  UUID: 'uuid',
  PHONE: 'phone'
};

export const CANCELLATION_POLICY_TYPES = {
  FLEXIBLE: 'flexible',
  MODERATE: 'moderate',
  STRICT: 'strict',
  NON_REFUNDABLE: 'non_refundable'
};

export const CANCELLATION_POLICY_LABELS = {
  [CANCELLATION_POLICY_TYPES.FLEXIBLE]: 'Flexible',
  [CANCELLATION_POLICY_TYPES.MODERATE]: 'Moderate',
  [CANCELLATION_POLICY_TYPES.STRICT]: 'Strict',
  [CANCELLATION_POLICY_TYPES.NON_REFUNDABLE]: 'Non-Refundable'
};

export const CANCELLATION_POLICY_DESCRIPTIONS = {
  [CANCELLATION_POLICY_TYPES.FLEXIBLE]: 'Full refund with reasonable notice',
  [CANCELLATION_POLICY_TYPES.MODERATE]: 'Partial refund based on timing',
  [CANCELLATION_POLICY_TYPES.STRICT]: 'Limited refund, strict terms',
  [CANCELLATION_POLICY_TYPES.NON_REFUNDABLE]: 'No refunds available'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  DIGITAL_WALLET: 'digital_wallet',
  CRYPTOCURRENCY: 'cryptocurrency',
  BUY_NOW_PAY_LATER: 'buy_now_pay_later',
  CASH: 'cash',
  CHECK: 'check'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.DIGITAL_WALLET]: 'Digital Wallet (PayPal, Apple Pay, etc.)',
  [PAYMENT_METHODS.CRYPTOCURRENCY]: 'Cryptocurrency',
  [PAYMENT_METHODS.BUY_NOW_PAY_LATER]: 'Buy Now Pay Later (Klarna, Affirm, etc.)',
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.CHECK]: 'Check'
};

export const PAYMENT_TIMING = {
  AT_BOOKING: 'at_booking',
  ON_ARRIVAL: 'on_arrival',
  AFTER_SERVICE: 'after_service',
  DEPOSIT_THEN_BALANCE: 'deposit_then_balance'
};

export const PAYMENT_TIMING_LABELS = {
  [PAYMENT_TIMING.AT_BOOKING]: 'At Booking (Pay Now)',
  [PAYMENT_TIMING.ON_ARRIVAL]: 'On Arrival / Start',
  [PAYMENT_TIMING.AFTER_SERVICE]: 'After Service Completion',
  [PAYMENT_TIMING.DEPOSIT_THEN_BALANCE]: 'Deposit Now, Balance Later'
};

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY',
  CNY: 'CNY',
  INR: 'INR'
};

export const WEBHOOK_EVENTS = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_MODIFIED: 'booking_modified',
  BOOKING_CANCELLED: 'booking_cancelled',
  PAYMENT_PROCESSED: 'payment_processed',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  SERVICE_STARTED: 'service_started',
  SERVICE_COMPLETED: 'service_completed'
};

export const WEBHOOK_EVENT_LABELS = {
  [WEBHOOK_EVENTS.BOOKING_CONFIRMED]: 'Booking Confirmed',
  [WEBHOOK_EVENTS.BOOKING_MODIFIED]: 'Booking Modified',
  [WEBHOOK_EVENTS.BOOKING_CANCELLED]: 'Booking Cancelled',
  [WEBHOOK_EVENTS.PAYMENT_PROCESSED]: 'Payment Processed',
  [WEBHOOK_EVENTS.PAYMENT_FAILED]: 'Payment Failed',
  [WEBHOOK_EVENTS.PAYMENT_REFUNDED]: 'Payment Refunded',
  [WEBHOOK_EVENTS.SERVICE_STARTED]: 'Service Started',
  [WEBHOOK_EVENTS.SERVICE_COMPLETED]: 'Service Completed'
};

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }
];

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'America/Vancouver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland'
];

export const VALIDATION_RULES = {
  BUSINESS_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
    REQUIRED: true
  },
  BUSINESS_DESCRIPTION: {
    MIN_LENGTH: 0,
    MAX_LENGTH: 1000,
    REQUIRED: false
  },
  SERVICE_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    REQUIRED: true
  },
  SERVICE_ID: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-z0-9_]+$/,
    REQUIRED: true
  },
  SERVICE_DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    REQUIRED: true
  },
  PARAMETER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-z_][a-z0-9_]*$/,
    REQUIRED: true
  },
  PARAMETER_DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    REQUIRED: true
  },
  EMAIL: {
    PATTERN: /^[^@]+@[^@]+\.[^@]+$/,
    REQUIRED: true
  },
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
    REQUIRED: false
  },
  URL: {
    PATTERN: /^https?:\/\/.+/,
    REQUIRED: false
  },
  POSTAL_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 10,
    REQUIRED: false
  },
  CANCELLATION_POLICY_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
    REQUIRED: true
  },
  DEPOSIT_PERCENTAGE: {
    MIN: 0,
    MAX: 100,
    REQUIRED: false
  },
  TAX_RATE: {
    MIN: 0,
    MAX: 1,
    REQUIRED: false
  },
  PRICE: {
    MIN: 0,
    REQUIRED: false
  },
  ADVANCE_BOOKING_DAYS: {
    MIN: 1,
    MAX: 730,
    DEFAULT: 365
  },
  CACHE_TIMEOUT_SECONDS: {
    MIN: 0,
    MAX: 3600,
    DEFAULT: 300
  },
  FREE_CANCELLATION_HOURS: {
    MIN: 0,
    MAX: 168,
    DEFAULT: 24
  },
  PENALTY_PERCENTAGE: {
    MIN: 0,
    MAX: 100,
    DEFAULT: 0
  }
};

export const DEFAULT_VALUES = {
  CURRENCY: 'USD',
  COUNTRY: 'US',
  TIMEZONE: 'UTC',
  WORKFLOW_PATTERN: WORKFLOW_PATTERNS.BOOKING_CONFIRMATION_PAYMENT,
  CANCELLATION_POLICY_TYPE: CANCELLATION_POLICY_TYPES.FLEXIBLE,
  PAYMENT_TIMING: PAYMENT_TIMING.AT_BOOKING,
  REAL_TIME_AVAILABILITY: true,
  CACHE_TIMEOUT_SECONDS: 300,
  ADVANCE_BOOKING_DAYS: 365,
  FREE_CANCELLATION_HOURS: 24,
  PENALTY_PERCENTAGE: 0,
  DEPOSIT_REQUIRED: false,
  AP2_ENABLED: true,
  AP2_VERIFICATION_REQUIRED: true,
  AP2_MANDATE_EXPIRY_HOURS: 24,
  AUTO_GENERATE_ENDPOINTS: true,
  RETRY_ATTEMPTS: 3,
  TIMEOUT_MINUTES: 30
};

export const CONSTRAINTS = {
  MAX_SERVICES: 20,
  MAX_PARAMETERS_PER_SERVICE: 50,
  MAX_WORKFLOW_STEPS: 10,
  MIN_PARAMETERS_PER_SERVICE: 1
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number (e.g., +1-555-555-5555)',
  INVALID_URL: 'Please enter a valid URL (must start with http:// or https://)',
  INVALID_SERVICE_ID: 'Service ID must contain only lowercase letters, numbers, and underscores',
  INVALID_PARAMETER_NAME: 'Parameter name must start with a letter and contain only lowercase letters, numbers, and underscores',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
  PATTERN_MISMATCH: 'Invalid format',
  AT_LEAST_ONE: 'Please select at least one option',
  DUPLICATE_VALUE: 'This value already exists'
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_COMPLETE: 'Business registration completed successfully!',
  VALIDATION_PASSED: 'All fields validated successfully',
  SERVICE_ADDED: 'Service added successfully',
  PARAMETER_ADDED: 'Parameter added successfully'
};

export const FIELD_HELP_TEXT = {
  BUSINESS_NAME: 'The legal or operating name of your business',
  BUSINESS_TYPE: 'Select the category that best describes your business',
  BUSINESS_DESCRIPTION: 'Brief description of your business and what makes it unique',
  SERVICE_ID: 'Unique identifier (lowercase, underscores only) - e.g., "room_booking"',
  SERVICE_NAME: 'Display name for this service - e.g., "Room Booking"',
  SERVICE_CATEGORY: 'Category helps agents understand the type of service',
  WORKFLOW_PATTERN: 'How customers interact with this service from start to finish',
  PARAMETER_NAME: 'Technical name (lowercase, underscores) - e.g., "check_in_date"',
  PARAMETER_TYPE: 'The data type for this parameter',
  CANCELLATION_POLICY: 'Define how customers can cancel and what penalties apply',
  PAYMENT_TIMING: 'When customers will be charged for this service',
  DEPOSIT_PERCENTAGE: 'Percentage of total price required as deposit (0-100)',
  MCP_ENDPOINT: 'Model Context Protocol endpoint for AI agent integration',
  A2A_ENDPOINT: 'Agent-to-Agent discovery URL for cross-platform integration',
  WEBHOOK_ENDPOINT: 'URL to receive real-time notifications about bookings and payments',
  AP2_PROTOCOL: 'Autonomous Payment Protocol for secure AI-initiated transactions'
};

export default {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  WORKFLOW_PATTERNS,
  WORKFLOW_PATTERN_LABELS,
  WORKFLOW_PATTERN_DESCRIPTIONS,
  PARAMETER_TYPES,
  PARAMETER_TYPE_LABELS,
  PARAMETER_FORMATS,
  CANCELLATION_POLICY_TYPES,
  CANCELLATION_POLICY_LABELS,
  CANCELLATION_POLICY_DESCRIPTIONS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_TIMING,
  PAYMENT_TIMING_LABELS,
  CURRENCIES,
  WEBHOOK_EVENTS,
  WEBHOOK_EVENT_LABELS,
  COUNTRIES,
  TIMEZONES,
  VALIDATION_RULES,
  DEFAULT_VALUES,
  CONSTRAINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FIELD_HELP_TEXT
};
