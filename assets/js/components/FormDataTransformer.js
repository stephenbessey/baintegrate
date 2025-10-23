/**
 * Form Data Transformer
 * Transforms frontend form state into BAIS API format
 * Handles data mapping, sanitization, and formatting
 */

export default class FormDataTransformer {
  /**
   * Transform complete form state to API format
   * @param {Object} formState - Frontend form state
   * @returns {Object} - API-formatted registration data
   */
  transformToAPIFormat(formState) {
    return {
      business_name: formState.businessInfo.name,
      business_type: formState.businessInfo.type,
      business_description: formState.businessInfo.description || undefined,
      established_date: formState.businessInfo.establishedDate || undefined,
      capacity: formState.businessInfo.capacity || undefined,

      contact_info: this.transformContactInfo(formState.contact, formState.businessInfo),

      location: this.transformLocation(formState.location),

      services_config: this.transformServices(formState.services),

      integration: this.transformIntegration(formState.integration, formState.businessInfo),

      ap2_config: this.transformAP2Config(formState.ap2)
    };
  }

  /**
   * Transform contact information
   */
  transformContactInfo(contact, businessInfo) {
    return {
      email: contact.email,
      phone: this.sanitizePhone(contact.phone) || undefined,
      secondary_email: contact.secondaryEmail || undefined,
      website: businessInfo.website || undefined,
      business_hours: contact.businessHours || undefined
    };
  }

  /**
   * Transform location information
   */
  transformLocation(location) {
    return {
      address: location.address,
      city: location.city,
      state: location.state,
      postal_code: location.postalCode || undefined,
      country: location.country || 'US',
      timezone: location.timezone || 'UTC',
      coordinates: location.coordinates ? {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      } : undefined
    };
  }

  /**
   * Transform all services
   */
  transformServices(services) {
    return services.map(service => this.transformService(service));
  }

  /**
   * Transform single service configuration
   */
  transformService(service) {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,

      workflow_pattern: service.workflow.pattern,
      workflow_steps: this.transformWorkflowSteps(service.workflow.steps),

      parameters: this.transformParameters(service.parameters),

      availability: this.transformAvailability(service.availability),

      cancellation_policy: this.transformCancellationPolicy(service.cancellationPolicy),

      payment_config: this.transformPaymentConfig(service.payment),

      policies: this.transformServicePolicies(service.policies)
    };
  }

  /**
   * Transform workflow steps
   */
  transformWorkflowSteps(steps) {
    if (!steps || steps.length === 0) {
      return undefined;
    }

    return steps.map(step => ({
      name: step.name,
      description: step.description || undefined,
      required: step.required !== false,
      timeout_minutes: step.timeoutMinutes || 30,
      retry_attempts: step.retryAttempts !== undefined ? step.retryAttempts : 3
    }));
  }

  /**
   * Transform service parameters
   */
  transformParameters(parameters) {
    const transformed = {};

    parameters.forEach(param => {
      transformed[param.name] = {
        type: param.type,
        description: param.description,
        required: param.required || false,
        default: param.default !== undefined ? param.default : undefined,
        ...this.transformParameterConstraints(param),
        ...(param.pricing ? { pricing: this.transformParameterPricing(param.pricing) } : {})
      };
    });

    return transformed;
  }

  /**
   * Transform parameter constraints based on type
   */
  transformParameterConstraints(param) {
    if (!param.constraints) {
      return {};
    }

    const constraints = {};
    const c = param.constraints;

    // Number/Integer constraints
    if (c.minimum !== undefined) {
      constraints.minimum = c.minimum;
    }
    if (c.maximum !== undefined) {
      constraints.maximum = c.maximum;
    }

    // String constraints
    if (c.minLength !== undefined) {
      constraints.min_length = c.minLength;
    }
    if (c.maxLength !== undefined) {
      constraints.max_length = c.maxLength;
    }
    if (c.pattern) {
      constraints.pattern = c.pattern;
    }
    if (c.enum && Array.isArray(c.enum)) {
      constraints.enum = c.enum;
    }

    // Format
    if (c.format) {
      constraints.format = c.format;
    }

    return constraints;
  }

  /**
   * Transform parameter pricing
   */
  transformParameterPricing(pricing) {
    return {
      base_rate: pricing.baseRate || 0,
      currency: pricing.currency || 'USD',
      tax_rate: pricing.taxRate || 0,
      service_fee: pricing.serviceFee || 0,
      minimum_charge: pricing.minimumCharge || undefined
    };
  }

  /**
   * Transform availability configuration
   */
  transformAvailability(availability) {
    return {
      endpoint: availability.endpoint || undefined,
      real_time: availability.realTime !== false,
      cache_timeout_seconds: availability.cacheTimeoutSeconds || 300,
      advance_booking_days: availability.advanceBookingDays || 365
    };
  }

  /**
   * Transform cancellation policy
   */
  transformCancellationPolicy(policy) {
    return {
      type: policy.type,
      free_until_hours: policy.freeUntilHours || 24,
      penalty_percentage: policy.penaltyPercentage || 0,
      description: policy.description
    };
  }

  /**
   * Transform payment configuration
   */
  transformPaymentConfig(payment) {
    return {
      methods: payment.methods || ['credit_card'],
      timing: payment.timing || 'at_booking',
      processing: 'secure_tokenized',
      deposit_required: payment.depositRequired || false,
      deposit_percentage: payment.depositRequired ? (payment.depositPercentage || 0) : undefined
    };
  }

  /**
   * Transform service policies
   */
  transformServicePolicies(policies) {
    if (!policies) {
      return {
        modification_fee: 0,
        no_show_penalty: 0
      };
    }

    return {
      modification_fee: policies.modificationFee || 0,
      no_show_penalty: policies.noShowPenalty || 0
    };
  }

  /**
   * Transform integration configuration
   */
  transformIntegration(integration, businessInfo) {
    const sanitizedBusinessName = this.sanitizeBusinessName(businessInfo.name);

    return {
      mcp_endpoint: this.getMCPEndpoint(integration.mcp, sanitizedBusinessName),
      a2a_discovery_url: this.getA2ADiscoveryUrl(integration.a2a, sanitizedBusinessName),
      webhook_endpoint: this.getWebhookEndpoint(integration.webhooks, sanitizedBusinessName),
      webhook_events: integration.webhooks?.events || [
        'booking_confirmed',
        'payment_processed',
        'booking_cancelled'
      ]
    };
  }

  /**
   * Get MCP endpoint (auto-generate or use provided)
   */
  getMCPEndpoint(mcp, sanitizedBusinessName) {
    if (!mcp || mcp.autoGenerate) {
      return undefined; // Backend will auto-generate
    }
    return mcp.endpoint;
  }

  /**
   * Get A2A discovery URL (auto-generate or use provided)
   */
  getA2ADiscoveryUrl(a2a, sanitizedBusinessName) {
    if (!a2a || a2a.autoGenerate) {
      return undefined; // Backend will auto-generate
    }
    return a2a.discoveryUrl;
  }

  /**
   * Get webhook endpoint (auto-generate or use provided)
   */
  getWebhookEndpoint(webhooks, sanitizedBusinessName) {
    if (!webhooks || webhooks.autoGenerate) {
      return undefined; // Backend will auto-generate
    }
    return webhooks.endpoint;
  }

  /**
   * Transform AP2 configuration
   */
  transformAP2Config(ap2) {
    if (!ap2 || !ap2.enabled) {
      return undefined;
    }

    return {
      enabled: true,
      verification_required: ap2.verificationRequired !== false,
      mandate_expiry_hours: ap2.mandateExpiryHours || 24
    };
  }

  /**
   * Sanitize business name for URL usage
   */
  sanitizeBusinessName(name) {
    if (!name) return 'business';

    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  /**
   * Sanitize phone number to international format
   */
  sanitizePhone(phone) {
    if (!phone) return null;

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If starts with 1 and has 11 digits, format as +1-XXX-XXX-XXXX
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits[0]}-${digits.substring(1, 4)}-${digits.substring(4, 7)}-${digits.substring(7)}`;
    }

    // If has 10 digits, assume US number
    if (digits.length === 10) {
      return `+1-${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    }

    // Otherwise, return with + prefix if not present
    return digits.startsWith('+') ? phone : `+${phone}`;
  }

  /**
   * Transform form state from API format (for editing)
   * @param {Object} apiData - Data from API
   * @returns {Object} - Frontend form state
   */
  transformFromAPIFormat(apiData) {
    return {
      businessInfo: {
        name: apiData.business_name,
        type: apiData.business_type,
        description: apiData.business_description,
        website: apiData.contact_info?.website,
        establishedDate: apiData.established_date,
        capacity: apiData.capacity
      },

      location: {
        address: apiData.location.address,
        city: apiData.location.city,
        state: apiData.location.state,
        postalCode: apiData.location.postal_code,
        country: apiData.location.country || 'US',
        timezone: apiData.location.timezone || 'UTC',
        coordinates: apiData.location.coordinates
      },

      contact: {
        email: apiData.contact_info.email,
        phone: apiData.contact_info.phone,
        secondaryEmail: apiData.contact_info.secondary_email,
        businessHours: apiData.contact_info.business_hours
      },

      services: apiData.services_config?.map(service => this.transformServiceFromAPI(service)) || [],

      integration: {
        mcp: {
          autoGenerate: !apiData.integration?.mcp_endpoint,
          endpoint: apiData.integration?.mcp_endpoint
        },
        a2a: {
          autoGenerate: !apiData.integration?.a2a_discovery_url,
          discoveryUrl: apiData.integration?.a2a_discovery_url
        },
        webhooks: {
          autoGenerate: !apiData.integration?.webhook_endpoint,
          endpoint: apiData.integration?.webhook_endpoint,
          events: apiData.integration?.webhook_events
        }
      },

      ap2: {
        enabled: apiData.ap2_config?.enabled || false,
        verificationRequired: apiData.ap2_config?.verification_required !== false,
        mandateExpiryHours: apiData.ap2_config?.mandate_expiry_hours || 24
      }
    };
  }

  /**
   * Transform service from API format
   */
  transformServiceFromAPI(service) {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,

      workflow: {
        pattern: service.workflow_pattern,
        steps: service.workflow_steps || []
      },

      parameters: this.transformParametersFromAPI(service.parameters),

      availability: {
        endpoint: service.availability?.endpoint,
        realTime: service.availability?.real_time !== false,
        cacheTimeoutSeconds: service.availability?.cache_timeout_seconds || 300,
        advanceBookingDays: service.availability?.advance_booking_days || 365
      },

      cancellationPolicy: {
        type: service.cancellation_policy.type,
        freeUntilHours: service.cancellation_policy.free_until_hours || 24,
        penaltyPercentage: service.cancellation_policy.penalty_percentage || 0,
        description: service.cancellation_policy.description
      },

      payment: {
        methods: service.payment_config.methods || ['credit_card'],
        timing: service.payment_config.timing || 'at_booking',
        depositRequired: service.payment_config.deposit_required || false,
        depositPercentage: service.payment_config.deposit_percentage
      },

      policies: {
        modificationFee: service.policies?.modification_fee || 0,
        noShowPenalty: service.policies?.no_show_penalty || 0
      }
    };
  }

  /**
   * Transform parameters from API format
   */
  transformParametersFromAPI(parameters) {
    if (!parameters) return [];

    return Object.entries(parameters).map(([name, config]) => ({
      name,
      type: config.type,
      description: config.description,
      required: config.required || false,
      default: config.default,
      constraints: {
        minimum: config.minimum,
        maximum: config.maximum,
        minLength: config.min_length,
        maxLength: config.max_length,
        pattern: config.pattern,
        enum: config.enum,
        format: config.format
      },
      pricing: config.pricing ? {
        baseRate: config.pricing.base_rate,
        currency: config.pricing.currency,
        taxRate: config.pricing.tax_rate,
        serviceFee: config.pricing.service_fee,
        minimumCharge: config.pricing.minimum_charge
      } : null
    }));
  }
}
