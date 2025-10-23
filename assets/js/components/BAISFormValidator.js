/**
 * BAIS Form Validator
 * Comprehensive client-side validation for business onboarding form
 * Following single responsibility principle with focused validation methods
 */

import CONSTANTS from '../core/constants.js';

export default class BAISFormValidator {
  constructor() {
    this.errors = [];
  }

  /**
   * Validate complete form state
   * @param {Object} formState - Complete form state object
   * @returns {Object} - { isValid: boolean, errors: array }
   */
  validateComplete(formState) {
    this.errors = [];

    this.validateBusinessInfo(formState.businessInfo);
    this.validateLocation(formState.location);
    this.validateContact(formState.contact);
    this.validateServices(formState.services);
    this.validateIntegration(formState.integration);
    this.validateAP2Config(formState.ap2);

    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }

  /**
   * Validate business information section
   */
  validateBusinessInfo(businessInfo) {
    if (!this.isValidString(businessInfo.name, CONSTANTS.VALIDATION_RULES.BUSINESS_NAME)) {
      this.addError('Business name is required and must be 1-255 characters');
    }

    if (!businessInfo.type || !Object.values(CONSTANTS.BUSINESS_TYPES).includes(businessInfo.type)) {
      this.addError('Please select a valid business type');
    }

    if (businessInfo.website && !this.isValidURL(businessInfo.website)) {
      this.addError('Please enter a valid website URL');
    }

    if (businessInfo.description && businessInfo.description.length > CONSTANTS.VALIDATION_RULES.BUSINESS_DESCRIPTION.MAX_LENGTH) {
      this.addError(`Business description must be no more than ${CONSTANTS.VALIDATION_RULES.BUSINESS_DESCRIPTION.MAX_LENGTH} characters`);
    }

    if (businessInfo.capacity && (!Number.isInteger(businessInfo.capacity) || businessInfo.capacity < 1)) {
      this.addError('Business capacity must be a positive integer');
    }
  }

  /**
   * Validate location information
   */
  validateLocation(location) {
    if (!this.isRequiredString(location.address)) {
      this.addError('Address is required');
    }

    if (!this.isRequiredString(location.city)) {
      this.addError('City is required');
    }

    if (!this.isRequiredString(location.state)) {
      this.addError('State/Province is required');
    }

    if (!location.country || location.country.length !== 2) {
      this.addError('Please select a valid country');
    }

    if (!this.isRequiredString(location.timezone)) {
      this.addError('Timezone is required');
    }

    if (location.coordinates) {
      if (!this.isValidCoordinates(location.coordinates)) {
        this.addError('Invalid coordinates format');
      }
    }
  }

  /**
   * Validate contact information
   */
  validateContact(contact) {
    if (!this.isValidEmail(contact.email)) {
      this.addError('Please enter a valid email address');
    }

    if (contact.phone && !this.isValidPhone(contact.phone)) {
      this.addError('Please enter a valid phone number (e.g., +1-555-555-5555)');
    }

    if (contact.secondaryEmail && !this.isValidEmail(contact.secondaryEmail)) {
      this.addError('Secondary email must be a valid email address');
    }
  }

  /**
   * Validate all services
   */
  validateServices(services) {
    if (!services || services.length === 0) {
      this.addError('At least one service must be defined');
      return;
    }

    if (services.length > CONSTANTS.CONSTRAINTS.MAX_SERVICES) {
      this.addError(`Maximum ${CONSTANTS.CONSTRAINTS.MAX_SERVICES} services allowed`);
    }

    const serviceIds = new Set();

    services.forEach((service, index) => {
      const servicePrefix = `Service ${index + 1}`;

      // Validate service basics
      this.validateServiceBasics(service, servicePrefix, serviceIds);

      // Validate workflow
      this.validateWorkflow(service.workflow, servicePrefix);

      // Validate parameters
      this.validateParameters(service.parameters, servicePrefix);

      // Validate availability
      this.validateAvailability(service.availability, servicePrefix);

      // Validate cancellation policy
      this.validateCancellationPolicy(service.cancellationPolicy, servicePrefix);

      // Validate payment configuration
      this.validatePaymentConfig(service.payment, servicePrefix);

      // Validate policies
      this.validateServicePolicies(service.policies, servicePrefix);
    });
  }

  /**
   * Validate service basic information
   */
  validateServiceBasics(service, prefix, serviceIds) {
    if (!this.isValidString(service.name, CONSTANTS.VALIDATION_RULES.SERVICE_NAME)) {
      this.addError(`${prefix}: Service name is required (1-100 characters)`);
    }

    if (!this.isValidString(service.id, CONSTANTS.VALIDATION_RULES.SERVICE_ID)) {
      this.addError(`${prefix}: Service ID is required (1-100 characters)`);
    } else if (!CONSTANTS.VALIDATION_RULES.SERVICE_ID.PATTERN.test(service.id)) {
      this.addError(`${prefix}: Service ID must contain only lowercase letters, numbers, and underscores`);
    } else if (serviceIds.has(service.id)) {
      this.addError(`${prefix}: Service ID "${service.id}" is already used`);
    } else {
      serviceIds.add(service.id);
    }

    if (!this.isValidString(service.description, CONSTANTS.VALIDATION_RULES.SERVICE_DESCRIPTION)) {
      this.addError(`${prefix}: Service description is required (1-500 characters)`);
    }

    if (!this.isRequiredString(service.category)) {
      this.addError(`${prefix}: Service category is required`);
    }
  }

  /**
   * Validate workflow configuration
   */
  validateWorkflow(workflow, prefix) {
    if (!workflow) {
      this.addError(`${prefix}: Workflow configuration is required`);
      return;
    }

    if (!workflow.pattern || !Object.values(CONSTANTS.WORKFLOW_PATTERNS).includes(workflow.pattern)) {
      this.addError(`${prefix}: Please select a valid workflow pattern`);
    }

    if (workflow.steps && Array.isArray(workflow.steps)) {
      if (workflow.steps.length > CONSTANTS.CONSTRAINTS.MAX_WORKFLOW_STEPS) {
        this.addError(`${prefix}: Maximum ${CONSTANTS.CONSTRAINTS.MAX_WORKFLOW_STEPS} workflow steps allowed`);
      }

      workflow.steps.forEach((step, index) => {
        if (!this.isRequiredString(step.name)) {
          this.addError(`${prefix}, Step ${index + 1}: Step name is required`);
        }
        if (step.timeoutMinutes && (step.timeoutMinutes < 1 || step.timeoutMinutes > 1440)) {
          this.addError(`${prefix}, Step ${index + 1}: Timeout must be between 1 and 1440 minutes`);
        }
        if (step.retryAttempts !== undefined && (step.retryAttempts < 0 || step.retryAttempts > 10)) {
          this.addError(`${prefix}, Step ${index + 1}: Retry attempts must be between 0 and 10`);
        }
      });
    }
  }

  /**
   * Validate service parameters
   */
  validateParameters(parameters, prefix) {
    if (!parameters || parameters.length === 0) {
      this.addError(`${prefix}: At least one parameter is required`);
      return;
    }

    if (parameters.length > CONSTANTS.CONSTRAINTS.MAX_PARAMETERS_PER_SERVICE) {
      this.addError(`${prefix}: Maximum ${CONSTANTS.CONSTRAINTS.MAX_PARAMETERS_PER_SERVICE} parameters allowed`);
    }

    const paramNames = new Set();

    parameters.forEach((param, index) => {
      const paramPrefix = `${prefix}, Parameter ${index + 1}`;

      if (!this.isValidString(param.name, CONSTANTS.VALIDATION_RULES.PARAMETER_NAME)) {
        this.addError(`${paramPrefix}: Parameter name is required (1-100 characters)`);
      } else if (!CONSTANTS.VALIDATION_RULES.PARAMETER_NAME.PATTERN.test(param.name)) {
        this.addError(`${paramPrefix}: Parameter name must start with a letter and contain only lowercase letters, numbers, and underscores`);
      } else if (paramNames.has(param.name)) {
        this.addError(`${paramPrefix}: Parameter name "${param.name}" is already used`);
      } else {
        paramNames.add(param.name);
      }

      if (!param.type || !Object.values(CONSTANTS.PARAMETER_TYPES).includes(param.type)) {
        this.addError(`${paramPrefix}: Please select a valid parameter type`);
      }

      if (!this.isValidString(param.description, CONSTANTS.VALIDATION_RULES.PARAMETER_DESCRIPTION)) {
        this.addError(`${paramPrefix}: Description is required (1-500 characters)`);
      }

      // Validate constraints based on type
      this.validateParameterConstraints(param, paramPrefix);

      // Validate pricing if provided
      if (param.pricing) {
        this.validateParameterPricing(param.pricing, paramPrefix);
      }
    });
  }

  /**
   * Validate parameter constraints based on type
   */
  validateParameterConstraints(param, prefix) {
    if (!param.constraints) return;

    const { constraints, type } = param;

    if (type === CONSTANTS.PARAMETER_TYPES.NUMBER || type === CONSTANTS.PARAMETER_TYPES.INTEGER) {
      if (constraints.minimum !== undefined && constraints.maximum !== undefined) {
        if (constraints.minimum > constraints.maximum) {
          this.addError(`${prefix}: Minimum cannot be greater than maximum`);
        }
      }
    }

    if (type === CONSTANTS.PARAMETER_TYPES.STRING) {
      if (constraints.minLength !== undefined && constraints.maxLength !== undefined) {
        if (constraints.minLength > constraints.maxLength) {
          this.addError(`${prefix}: Minimum length cannot be greater than maximum length`);
        }
      }
      if (constraints.pattern) {
        try {
          new RegExp(constraints.pattern);
        } catch (e) {
          this.addError(`${prefix}: Invalid regex pattern`);
        }
      }
    }
  }

  /**
   * Validate parameter pricing configuration
   */
  validateParameterPricing(pricing, prefix) {
    if (pricing.baseRate !== undefined) {
      if (typeof pricing.baseRate !== 'number' || pricing.baseRate < 0) {
        this.addError(`${prefix}: Base rate must be a non-negative number`);
      }
    }

    if (pricing.currency && pricing.currency.length !== 3) {
      this.addError(`${prefix}: Currency must be a 3-character code (e.g., USD)`);
    }

    if (pricing.taxRate !== undefined) {
      if (typeof pricing.taxRate !== 'number' || pricing.taxRate < 0 || pricing.taxRate > 1) {
        this.addError(`${prefix}: Tax rate must be between 0 and 1`);
      }
    }

    if (pricing.serviceFee !== undefined) {
      if (typeof pricing.serviceFee !== 'number' || pricing.serviceFee < 0) {
        this.addError(`${prefix}: Service fee must be a non-negative number`);
      }
    }
  }

  /**
   * Validate availability configuration
   */
  validateAvailability(availability, prefix) {
    if (!availability) {
      this.addError(`${prefix}: Availability configuration is required`);
      return;
    }

    if (availability.cacheTimeoutSeconds !== undefined) {
      const rule = CONSTANTS.VALIDATION_RULES.CACHE_TIMEOUT_SECONDS;
      if (availability.cacheTimeoutSeconds < rule.MIN || availability.cacheTimeoutSeconds > rule.MAX) {
        this.addError(`${prefix}: Cache timeout must be between ${rule.MIN} and ${rule.MAX} seconds`);
      }
    }

    if (availability.advanceBookingDays !== undefined) {
      const rule = CONSTANTS.VALIDATION_RULES.ADVANCE_BOOKING_DAYS;
      if (availability.advanceBookingDays < rule.MIN || availability.advanceBookingDays > rule.MAX) {
        this.addError(`${prefix}: Advance booking days must be between ${rule.MIN} and ${rule.MAX}`);
      }
    }

    if (availability.endpoint && !this.isValidURL(availability.endpoint)) {
      this.addError(`${prefix}: Availability endpoint must be a valid URL`);
    }
  }

  /**
   * Validate cancellation policy
   */
  validateCancellationPolicy(policy, prefix) {
    if (!policy) {
      this.addError(`${prefix}: Cancellation policy is required`);
      return;
    }

    if (!policy.type || !Object.values(CONSTANTS.CANCELLATION_POLICY_TYPES).includes(policy.type)) {
      this.addError(`${prefix}: Please select a valid cancellation policy type`);
    }

    if (policy.freeUntilHours !== undefined) {
      const rule = CONSTANTS.VALIDATION_RULES.FREE_CANCELLATION_HOURS;
      if (policy.freeUntilHours < rule.MIN || policy.freeUntilHours > rule.MAX) {
        this.addError(`${prefix}: Free cancellation hours must be between ${rule.MIN} and ${rule.MAX}`);
      }
    }

    if (policy.penaltyPercentage !== undefined) {
      const rule = CONSTANTS.VALIDATION_RULES.PENALTY_PERCENTAGE;
      if (policy.penaltyPercentage < rule.MIN || policy.penaltyPercentage > rule.MAX) {
        this.addError(`${prefix}: Penalty percentage must be between ${rule.MIN} and ${rule.MAX}`);
      }
    }

    if (!this.isValidString(policy.description, CONSTANTS.VALIDATION_RULES.CANCELLATION_POLICY_DESCRIPTION)) {
      this.addError(`${prefix}: Cancellation policy description is required (10-500 characters)`);
    }
  }

  /**
   * Validate payment configuration
   */
  validatePaymentConfig(payment, prefix) {
    if (!payment) {
      this.addError(`${prefix}: Payment configuration is required`);
      return;
    }

    if (!payment.methods || payment.methods.length === 0) {
      this.addError(`${prefix}: At least one payment method must be selected`);
    } else {
      payment.methods.forEach(method => {
        if (!Object.values(CONSTANTS.PAYMENT_METHODS).includes(method)) {
          this.addError(`${prefix}: Invalid payment method "${method}"`);
        }
      });
    }

    if (!payment.timing || !Object.values(CONSTANTS.PAYMENT_TIMING).includes(payment.timing)) {
      this.addError(`${prefix}: Please select a valid payment timing`);
    }

    if (payment.depositRequired && payment.depositPercentage !== undefined) {
      const rule = CONSTANTS.VALIDATION_RULES.DEPOSIT_PERCENTAGE;
      if (payment.depositPercentage < rule.MIN || payment.depositPercentage > rule.MAX) {
        this.addError(`${prefix}: Deposit percentage must be between ${rule.MIN} and ${rule.MAX}`);
      }
    }
  }

  /**
   * Validate service policies
   */
  validateServicePolicies(policies, prefix) {
    if (!policies) return;

    if (policies.modificationFee !== undefined) {
      if (typeof policies.modificationFee !== 'number' || policies.modificationFee < 0) {
        this.addError(`${prefix}: Modification fee must be a non-negative number`);
      }
    }

    if (policies.noShowPenalty !== undefined) {
      if (typeof policies.noShowPenalty !== 'number' || policies.noShowPenalty < 0) {
        this.addError(`${prefix}: No-show penalty must be a non-negative number`);
      }
    }
  }

  /**
   * Validate integration configuration
   */
  validateIntegration(integration) {
    if (!integration) return;

    if (integration.mcp && !integration.mcp.autoGenerate) {
      if (!integration.mcp.endpoint) {
        this.addError('MCP endpoint is required when auto-generate is disabled');
      } else if (!this.isValidURL(integration.mcp.endpoint) || !integration.mcp.endpoint.endsWith('/mcp')) {
        this.addError('MCP endpoint must be a valid URL ending with /mcp');
      }
    }

    if (integration.a2a && !integration.a2a.autoGenerate) {
      if (!integration.a2a.discoveryUrl) {
        this.addError('A2A discovery URL is required when auto-generate is disabled');
      } else if (!this.isValidURL(integration.a2a.discoveryUrl) || !integration.a2a.discoveryUrl.includes('/.well-known/agent.json')) {
        this.addError('A2A discovery URL must be a valid URL containing /.well-known/agent.json');
      }
    }

    if (integration.webhooks && !integration.webhooks.autoGenerate) {
      if (!integration.webhooks.endpoint) {
        this.addError('Webhook endpoint is required when auto-generate is disabled');
      } else if (!this.isValidURL(integration.webhooks.endpoint)) {
        this.addError('Webhook endpoint must be a valid URL');
      }
    }

    if (integration.webhooks && integration.webhooks.events) {
      integration.webhooks.events.forEach(event => {
        if (!Object.values(CONSTANTS.WEBHOOK_EVENTS).includes(event)) {
          this.addError(`Invalid webhook event "${event}"`);
        }
      });
    }
  }

  /**
   * Validate AP2 configuration
   */
  validateAP2Config(ap2) {
    if (!ap2 || !ap2.enabled) return;

    if (ap2.mandateExpiryHours !== undefined) {
      if (ap2.mandateExpiryHours < 1 || ap2.mandateExpiryHours > 168) {
        this.addError('AP2 mandate expiry must be between 1 and 168 hours');
      }
    }
  }

  /**
   * Helper: Check if string is valid according to rules
   */
  isValidString(value, rules) {
    if (rules.REQUIRED && !this.isRequiredString(value)) {
      return false;
    }

    if (value && rules.MIN_LENGTH !== undefined && value.length < rules.MIN_LENGTH) {
      return false;
    }

    if (value && rules.MAX_LENGTH !== undefined && value.length > rules.MAX_LENGTH) {
      return false;
    }

    return true;
  }

  /**
   * Helper: Check if required string has value
   */
  isRequiredString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /**
   * Helper: Validate email format
   */
  isValidEmail(email) {
    if (!email) return false;
    return CONSTANTS.VALIDATION_RULES.EMAIL.PATTERN.test(email);
  }

  /**
   * Helper: Validate phone format
   */
  isValidPhone(phone) {
    if (!phone) return true; // Phone is optional
    return CONSTANTS.VALIDATION_RULES.PHONE.PATTERN.test(phone);
  }

  /**
   * Helper: Validate URL format
   */
  isValidURL(url) {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Helper: Validate coordinates
   */
  isValidCoordinates(coordinates) {
    if (!coordinates) return false;
    if (typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
      return false;
    }
    return coordinates.latitude >= -90 && coordinates.latitude <= 90 &&
           coordinates.longitude >= -180 && coordinates.longitude <= 180;
  }

  /**
   * Add error to errors array
   */
  addError(message) {
    this.errors.push(message);
  }

  /**
   * Validate single field
   * @param {string} fieldName - Name of the field
   * @param {*} value - Value to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} - { isValid: boolean, error: string }
   */
  validateField(fieldName, value, rules) {
    if (rules.REQUIRED && !value) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD };
    }

    if (rules.PATTERN && value && !rules.PATTERN.test(value)) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.PATTERN_MISMATCH };
    }

    if (rules.MIN_LENGTH && value && value.length < rules.MIN_LENGTH) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.MIN_LENGTH(rules.MIN_LENGTH) };
    }

    if (rules.MAX_LENGTH && value && value.length > rules.MAX_LENGTH) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.MAX_LENGTH(rules.MAX_LENGTH) };
    }

    if (rules.MIN !== undefined && value < rules.MIN) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.MIN_VALUE(rules.MIN) };
    }

    if (rules.MAX !== undefined && value > rules.MAX) {
      return { isValid: false, error: CONSTANTS.ERROR_MESSAGES.MAX_VALUE(rules.MAX) };
    }

    return { isValid: true, error: null };
  }
}
