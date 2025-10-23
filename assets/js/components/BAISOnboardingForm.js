/**
 * BAIS Onboarding Form Component
 * Main orchestrator for the business onboarding process
 * Manages form state, validation, service configuration, and submission
 */

import CONSTANTS from '../core/constants.js';
import CONFIG from '../core/config.js';
import BAISFormValidator from './BAISFormValidator.js';
import FormDataTransformer from './FormDataTransformer.js';
import ServiceConfigurator from './ServiceConfigurator.js';

export default class BAISOnboardingForm {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    this.validator = new BAISFormValidator();
    this.transformer = new FormDataTransformer();
    this.serviceConfigurators = [];

    this.formState = this.initializeFormState();
    this.isSubmitting = false;

    this.initialize();
  }

  /**
   * Initialize form state with default values
   */
  initializeFormState() {
    return {
      businessInfo: {
        name: '',
        type: '',
        description: '',
        website: '',
        establishedDate: '',
        capacity: null
      },
      location: {
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: CONSTANTS.DEFAULT_VALUES.COUNTRY,
        timezone: CONSTANTS.DEFAULT_VALUES.TIMEZONE,
        coordinates: null
      },
      contact: {
        email: '',
        phone: '',
        secondaryEmail: '',
        businessHours: ''
      },
      services: [this.createEmptyService()],
      integration: {
        mcp: { autoGenerate: true, endpoint: '' },
        a2a: { autoGenerate: true, discoveryUrl: '' },
        webhooks: { autoGenerate: true, endpoint: '', events: [] }
      },
      ap2: {
        enabled: CONSTANTS.DEFAULT_VALUES.AP2_ENABLED,
        verificationRequired: CONSTANTS.DEFAULT_VALUES.AP2_VERIFICATION_REQUIRED,
        mandateExpiryHours: CONSTANTS.DEFAULT_VALUES.AP2_MANDATE_EXPIRY_HOURS
      }
    };
  }

  /**
   * Create empty service object
   */
  createEmptyService() {
    return {
      name: '',
      id: '',
      description: '',
      category: '',
      workflow: {
        pattern: CONSTANTS.DEFAULT_VALUES.WORKFLOW_PATTERN,
        steps: []
      },
      parameters: [],
      availability: {
        realTime: CONSTANTS.DEFAULT_VALUES.REAL_TIME_AVAILABILITY,
        cacheTimeoutSeconds: CONSTANTS.DEFAULT_VALUES.CACHE_TIMEOUT_SECONDS,
        advanceBookingDays: CONSTANTS.DEFAULT_VALUES.ADVANCE_BOOKING_DAYS,
        endpoint: ''
      },
      cancellationPolicy: {
        type: CONSTANTS.DEFAULT_VALUES.CANCELLATION_POLICY_TYPE,
        freeUntilHours: CONSTANTS.DEFAULT_VALUES.FREE_CANCELLATION_HOURS,
        penaltyPercentage: CONSTANTS.DEFAULT_VALUES.PENALTY_PERCENTAGE,
        description: ''
      },
      payment: {
        methods: ['credit_card'],
        timing: CONSTANTS.DEFAULT_VALUES.PAYMENT_TIMING,
        depositRequired: CONSTANTS.DEFAULT_VALUES.DEPOSIT_REQUIRED,
        depositPercentage: 0
      },
      policies: {
        modificationFee: 0,
        noShowPenalty: 0
      }
    };
  }

  /**
   * Initialize the form
   */
  initialize() {
    this.render();
    this.attachEventListeners();
    this.initializeServiceConfigurators();
  }

  /**
   * Render the complete form
   */
  render() {
    this.container.innerHTML = `
      <div class="onboarding-form-container">
        <div class="onboarding-header">
          <h1>Business Onboarding</h1>
          <p>Complete this form to register your business with the BAIS platform and enable AI agent interactions.</p>
        </div>

        <form id="bais-onboarding-form" novalidate>
          <!-- Validation Summary (hidden by default) -->
          <div id="validation-summary" class="validation-summary" style="display: none;">
            <h3>Please fix the following errors:</h3>
            <ul id="validation-errors-list"></ul>
          </div>

          <!-- Business Information -->
          ${this.renderBusinessInfo()}

          <!-- Location Information -->
          ${this.renderLocationInfo()}

          <!-- Contact Information -->
          ${this.renderContactInfo()}

          <!-- Services Configuration -->
          ${this.renderServicesSection()}

          <!-- Integration Configuration -->
          ${this.renderIntegrationConfig()}

          <!-- AP2 Configuration -->
          ${this.renderAP2Config()}

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" id="save-draft-btn">
              Save Draft
            </button>
            <button type="submit" class="btn-primary" id="submit-btn">
              Complete Registration
            </button>
          </div>
        </form>

        <!-- Success Message (hidden by default) -->
        <div id="success-message" class="success-message" style="display: none;">
          <h2>✓ Registration Successful!</h2>
          <p>Your business has been successfully registered with BAIS.</p>
          <div id="registration-details"></div>
        </div>

        <!-- Loading Overlay (hidden by default) -->
        <div id="loading-overlay" class="loading-overlay" style="display: none;">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Processing your registration...</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render business information section
   */
  renderBusinessInfo() {
    return `
      <div class="form-section">
        <h2>Business Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="business-name">
              Business Name <span class="required">*</span>
            </label>
            <input
              type="text"
              id="business-name"
              name="business_name"
              class="business-info-input"
              data-field="name"
              value="${this.formState.businessInfo.name}"
              required
              maxlength="255">
            <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.BUSINESS_NAME}</span>
          </div>

          <div class="form-group">
            <label for="business-type">
              Business Type <span class="required">*</span>
            </label>
            <select
              id="business-type"
              name="business_type"
              class="business-info-input"
              data-field="type"
              required>
              <option value="">Select a type</option>
              ${Object.entries(CONSTANTS.BUSINESS_TYPE_LABELS).map(([value, label]) => `
                <option value="${value}" ${this.formState.businessInfo.type === value ? 'selected' : ''}>
                  ${label}
                </option>
              `).join('')}
            </select>
            <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.BUSINESS_TYPE}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="business-description">
            Business Description (optional)
          </label>
          <textarea
            id="business-description"
            name="business_description"
            class="business-info-input"
            data-field="description"
            maxlength="1000"
            rows="4">${this.formState.businessInfo.description}</textarea>
          <span class="char-count">${this.formState.businessInfo.description.length}/1000</span>
          <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.BUSINESS_DESCRIPTION}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="business-website">
              Website URL (optional)
            </label>
            <input
              type="url"
              id="business-website"
              name="business_website"
              class="business-info-input"
              data-field="website"
              placeholder="https://yourbusiness.com"
              value="${this.formState.businessInfo.website}">
          </div>

          <div class="form-group">
            <label for="business-capacity">
              Business Capacity (optional)
            </label>
            <input
              type="number"
              id="business-capacity"
              name="business_capacity"
              class="business-info-input"
              data-field="capacity"
              min="1"
              step="1"
              placeholder="e.g., 50"
              value="${this.formState.businessInfo.capacity || ''}">
            <span class="help-text">Maximum customers/guests at once</span>
          </div>
        </div>

        <div class="form-group">
          <label for="business-established">
            Established Date (optional)
          </label>
          <input
            type="date"
            id="business-established"
            name="business_established"
            class="business-info-input"
            data-field="establishedDate"
            value="${this.formState.businessInfo.establishedDate}">
        </div>
      </div>
    `;
  }

  /**
   * Render location information section
   */
  renderLocationInfo() {
    return `
      <div class="form-section">
        <h2>Location Information</h2>

        <div class="form-group">
          <label for="location-address">
            Street Address <span class="required">*</span>
          </label>
          <input
            type="text"
            id="location-address"
            name="location_address"
            class="location-input"
            data-field="address"
            value="${this.formState.location.address}"
            required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="location-city">
              City <span class="required">*</span>
            </label>
            <input
              type="text"
              id="location-city"
              name="location_city"
              class="location-input"
              data-field="city"
              value="${this.formState.location.city}"
              required>
          </div>

          <div class="form-group">
            <label for="location-state">
              State/Province <span class="required">*</span>
            </label>
            <input
              type="text"
              id="location-state"
              name="location_state"
              class="location-input"
              data-field="state"
              value="${this.formState.location.state}"
              required>
          </div>

          <div class="form-group">
            <label for="location-postal">
              Postal Code (optional)
            </label>
            <input
              type="text"
              id="location-postal"
              name="location_postal"
              class="location-input"
              data-field="postalCode"
              value="${this.formState.location.postalCode}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="location-country">
              Country <span class="required">*</span>
            </label>
            <select
              id="location-country"
              name="location_country"
              class="location-input"
              data-field="country"
              required>
              ${CONSTANTS.COUNTRIES.map(country => `
                <option value="${country.code}" ${this.formState.location.country === country.code ? 'selected' : ''}>
                  ${country.name}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label for="location-timezone">
              Timezone <span class="required">*</span>
            </label>
            <select
              id="location-timezone"
              name="location_timezone"
              class="location-input"
              data-field="timezone"
              required>
              ${CONSTANTS.TIMEZONES.map(tz => `
                <option value="${tz}" ${this.formState.location.timezone === tz ? 'selected' : ''}>
                  ${tz}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render contact information section
   */
  renderContactInfo() {
    return `
      <div class="form-section">
        <h2>Contact Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="contact-email">
              Email Address <span class="required">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="contact_email"
              class="contact-input"
              data-field="email"
              value="${this.formState.contact.email}"
              required>
          </div>

          <div class="form-group">
            <label for="contact-phone">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="contact-phone"
              name="contact_phone"
              class="contact-input"
              data-field="phone"
              placeholder="+1-555-555-5555"
              value="${this.formState.contact.phone}">
          </div>
        </div>

        <div class="form-group">
          <label for="contact-secondary-email">
            Secondary Email (optional)
          </label>
          <input
            type="email"
            id="contact-secondary-email"
            name="contact_secondary_email"
            class="contact-input"
            data-field="secondaryEmail"
            value="${this.formState.contact.secondaryEmail}">
        </div>

        <div class="form-group">
          <label for="contact-business-hours">
            Business Hours (optional)
          </label>
          <input
            type="text"
            id="contact-business-hours"
            name="contact_business_hours"
            class="contact-input"
            data-field="businessHours"
            placeholder="e.g., Mon-Fri 9AM-5PM"
            value="${this.formState.contact.businessHours}">
        </div>
      </div>
    `;
  }

  /**
   * Render services configuration section
   */
  renderServicesSection() {
    return `
      <div class="form-section">
        <h2>Services Configuration</h2>
        <p class="section-description">
          Define the services your business offers. Each service can have unique parameters, pricing, and policies.
        </p>

        <div id="services-container"></div>

        <button type="button" class="add-service-btn" id="add-service-btn">
          + Add Another Service
        </button>
      </div>
    `;
  }

  /**
   * Render integration configuration section
   */
  renderIntegrationConfig() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h2>Integration Configuration</h2>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <p class="section-description">
            Configure how AI agents will integrate with your business systems.
          </p>

          <!-- MCP Configuration -->
          <div class="integration-subsection">
            <h4>MCP (Model Context Protocol)</h4>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="mcp-auto-generate"
                  checked>
                <span>Auto-generate MCP endpoint</span>
              </label>
            </div>
            <div class="form-group mcp-manual" style="display: none;">
              <label for="mcp-endpoint">
                MCP Endpoint URL
              </label>
              <input
                type="url"
                id="mcp-endpoint"
                placeholder="https://api.yourbusiness.com/mcp"
                value="${this.formState.integration.mcp.endpoint}">
              <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.MCP_ENDPOINT}</span>
            </div>
          </div>

          <!-- A2A Configuration -->
          <div class="integration-subsection">
            <h4>A2A (Agent-to-Agent)</h4>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="a2a-auto-generate"
                  checked>
                <span>Auto-generate A2A discovery URL</span>
              </label>
            </div>
            <div class="form-group a2a-manual" style="display: none;">
              <label for="a2a-discovery-url">
                A2A Discovery URL
              </label>
              <input
                type="url"
                id="a2a-discovery-url"
                placeholder="https://api.yourbusiness.com/.well-known/agent.json"
                value="${this.formState.integration.a2a.discoveryUrl}">
              <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.A2A_ENDPOINT}</span>
            </div>
          </div>

          <!-- Webhook Configuration -->
          <div class="integration-subsection">
            <h4>Webhooks</h4>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="webhook-auto-generate"
                  checked>
                <span>Auto-generate webhook endpoint</span>
              </label>
            </div>
            <div class="form-group webhook-manual" style="display: none;">
              <label for="webhook-endpoint">
                Webhook Endpoint URL
              </label>
              <input
                type="url"
                id="webhook-endpoint"
                placeholder="https://api.yourbusiness.com/webhooks"
                value="${this.formState.integration.webhooks.endpoint}">
              <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.WEBHOOK_ENDPOINT}</span>
            </div>
            <div class="form-group">
              <label>Webhook Events</label>
              <div class="checkbox-group">
                ${Object.entries(CONSTANTS.WEBHOOK_EVENT_LABELS).map(([value, label]) => `
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      name="webhook-events"
                      value="${value}"
                      ${['booking_confirmed', 'payment_processed', 'booking_cancelled'].includes(value) ? 'checked' : ''}>
                    <span>${label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render AP2 configuration section
   */
  renderAP2Config() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h2>AP2 Payment Protocol (Advanced)</h2>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <p class="section-description">
            ${CONSTANTS.FIELD_HELP_TEXT.AP2_PROTOCOL}
          </p>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="ap2-enabled"
                ${this.formState.ap2.enabled ? 'checked' : ''}>
              <span>Enable AP2 Protocol</span>
            </label>
          </div>

          <div id="ap2-config-fields" ${this.formState.ap2.enabled ? '' : 'style="display: none;"'}>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  id="ap2-verification"
                  ${this.formState.ap2.verificationRequired ? 'checked' : ''}>
                <span>Require Verification</span>
              </label>
            </div>

            <div class="form-group">
              <label for="ap2-mandate-expiry">
                Mandate Expiry (hours)
              </label>
              <input
                type="number"
                id="ap2-mandate-expiry"
                min="1"
                max="168"
                value="${this.formState.ap2.mandateExpiryHours}">
              <span class="help-text">Payment mandate validity period (1-168 hours)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Business info inputs
    this.attachInputListeners('.business-info-input', 'businessInfo');

    // Location inputs
    this.attachInputListeners('.location-input', 'location');

    // Contact inputs
    this.attachInputListeners('.contact-input', 'contact');

    // Add service button
    document.getElementById('add-service-btn')?.addEventListener('click', () => this.addService());

    // Integration checkboxes
    document.getElementById('mcp-auto-generate')?.addEventListener('change', (e) => {
      this.handleIntegrationAutoGenerate('mcp', e.target.checked);
    });

    document.getElementById('a2a-auto-generate')?.addEventListener('change', (e) => {
      this.handleIntegrationAutoGenerate('a2a', e.target.checked);
    });

    document.getElementById('webhook-auto-generate')?.addEventListener('change', (e) => {
      this.handleIntegrationAutoGenerate('webhook', e.target.checked);
    });

    // Integration manual inputs
    document.getElementById('mcp-endpoint')?.addEventListener('input', (e) => {
      this.formState.integration.mcp.endpoint = e.target.value;
    });

    document.getElementById('a2a-discovery-url')?.addEventListener('input', (e) => {
      this.formState.integration.a2a.discoveryUrl = e.target.value;
    });

    document.getElementById('webhook-endpoint')?.addEventListener('input', (e) => {
      this.formState.integration.webhooks.endpoint = e.target.value;
    });

    // Webhook events
    document.querySelectorAll('[name="webhook-events"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.formState.integration.webhooks.events = Array.from(
          document.querySelectorAll('[name="webhook-events"]:checked')
        ).map(cb => cb.value);
      });
    });

    // AP2 configuration
    document.getElementById('ap2-enabled')?.addEventListener('change', (e) => {
      this.formState.ap2.enabled = e.target.checked;
      const configFields = document.getElementById('ap2-config-fields');
      if (configFields) {
        configFields.style.display = e.target.checked ? 'block' : 'none';
      }
    });

    document.getElementById('ap2-verification')?.addEventListener('change', (e) => {
      this.formState.ap2.verificationRequired = e.target.checked;
    });

    document.getElementById('ap2-mandate-expiry')?.addEventListener('input', (e) => {
      this.formState.ap2.mandateExpiryHours = parseInt(e.target.value);
    });

    // Collapsible sections
    document.querySelectorAll('.collapsible-header').forEach(header => {
      header.addEventListener('click', this.toggleCollapsible.bind(this));
    });

    // Form submission
    document.getElementById('bais-onboarding-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Save draft
    document.getElementById('save-draft-btn')?.addEventListener('click', () => {
      this.saveDraft();
    });
  }

  /**
   * Attach input listeners for a section
   */
  attachInputListeners(selector, stateSection) {
    document.querySelectorAll(selector).forEach(input => {
      const event = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(event, (e) => {
        const field = e.target.dataset.field;
        let value = e.target.value;

        // Parse value based on input type
        if (e.target.type === 'number') {
          value = value === '' ? null : (e.target.step === '1' ? parseInt(value) : parseFloat(value));
        }

        this.formState[stateSection][field] = value;

        // Update character count if textarea
        if (e.target.tagName === 'TEXTAREA') {
          const charCount = e.target.closest('.form-group')?.querySelector('.char-count');
          if (charCount) {
            const max = e.target.getAttribute('maxlength') || '0';
            charCount.textContent = `${e.target.value.length}/${max}`;
          }
        }
      });
    });
  }

  /**
   * Initialize service configurators
   */
  initializeServiceConfigurators() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;

    this.formState.services.forEach((service, index) => {
      this.addServiceConfigurator(index, service);
    });
  }

  /**
   * Add service configurator
   */
  addServiceConfigurator(index, service = null) {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;

    const serviceDiv = document.createElement('div');
    serviceDiv.id = `service-${index}`;
    servicesContainer.appendChild(serviceDiv);

    const configurator = new ServiceConfigurator(
      index,
      (serviceIndex, updatedService) => {
        this.formState.services[serviceIndex] = updatedService;
      },
      (serviceIndex) => this.removeService(serviceIndex)
    );

    configurator.initialize(serviceDiv, service);
    this.serviceConfigurators[index] = configurator;
  }

  /**
   * Add new service
   */
  addService() {
    if (this.formState.services.length >= CONSTANTS.CONSTRAINTS.MAX_SERVICES) {
      alert(`Maximum ${CONSTANTS.CONSTRAINTS.MAX_SERVICES} services allowed`);
      return;
    }

    const newService = this.createEmptyService();
    const newIndex = this.formState.services.length;
    this.formState.services.push(newService);
    this.addServiceConfigurator(newIndex, newService);

    // Scroll to new service
    const serviceElement = document.getElementById(`service-${newIndex}`);
    if (serviceElement) {
      serviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Remove service
   */
  removeService(index) {
    this.formState.services.splice(index, 1);
    this.serviceConfigurators.splice(index, 1);

    // Re-render services
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
      servicesContainer.innerHTML = '';
      this.serviceConfigurators = [];
      this.formState.services.forEach((service, i) => {
        this.addServiceConfigurator(i, service);
      });
    }
  }

  /**
   * Handle integration auto-generate toggle
   */
  handleIntegrationAutoGenerate(type, autoGenerate) {
    const manualGroup = document.querySelector(`.${type}-manual`);
    if (manualGroup) {
      manualGroup.style.display = autoGenerate ? 'none' : 'block';
    }

    if (type === 'mcp') {
      this.formState.integration.mcp.autoGenerate = autoGenerate;
    } else if (type === 'a2a') {
      this.formState.integration.a2a.autoGenerate = autoGenerate;
    } else if (type === 'webhook') {
      this.formState.integration.webhooks.autoGenerate = autoGenerate;
    }
  }

  /**
   * Toggle collapsible section
   */
  toggleCollapsible(e) {
    const header = e.currentTarget;
    const section = header.closest('.collapsible-section');
    const content = section.querySelector('.collapsible-content');
    const icon = header.querySelector('.collapsible-icon');

    if (content) {
      const isOpen = content.classList.contains('active');
      content.classList.toggle('active', !isOpen);
      content.style.display = isOpen ? 'none' : 'block';
      icon.textContent = isOpen ? '▼' : '▲';
    }
  }

  /**
   * Validate and submit form
   */
  async handleSubmit() {
    if (this.isSubmitting) return;

    // Hide previous errors/success
    this.hideValidationSummary();
    this.hideSuccessMessage();

    // Validate
    const validationResult = this.validator.validateComplete(this.formState);

    if (!validationResult.isValid) {
      this.showValidationErrors(validationResult.errors);
      this.scrollToTop();
      return;
    }

    // Transform and submit
    this.isSubmitting = true;
    this.showLoadingOverlay(true);

    try {
      const apiData = this.transformer.transformToAPIFormat(this.formState);
      const result = await this.submitToAPI(apiData);

      if (result.success) {
        this.showSuccessMessage(result);
        this.clearDraft();
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}. Please try again.`);
    } finally {
      this.isSubmitting = false;
      this.showLoadingOverlay(false);
    }
  }

  /**
   * Submit data to API
   */
  async submitToAPI(apiData) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/v1/businesses/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        businessId: data.business_id,
        apiKey: data.api_keys?.primary,
        mcpEndpoint: data.mcp_endpoint,
        a2aEndpoint: data.a2a_endpoint
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Show validation errors
   */
  showValidationErrors(errors) {
    const summary = document.getElementById('validation-summary');
    const errorsList = document.getElementById('validation-errors-list');

    if (summary && errorsList) {
      errorsList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
      summary.style.display = 'block';
    }
  }

  /**
   * Hide validation summary
   */
  hideValidationSummary() {
    const summary = document.getElementById('validation-summary');
    if (summary) {
      summary.style.display = 'none';
    }
  }

  /**
   * Show success message
   */
  showSuccessMessage(result) {
    const form = document.getElementById('bais-onboarding-form');
    const successMessage = document.getElementById('success-message');
    const detailsDiv = document.getElementById('registration-details');

    if (form) form.style.display = 'none';

    if (detailsDiv) {
      detailsDiv.innerHTML = `
        <div class="registration-info">
          <div class="info-item">
            <strong>Business ID:</strong>
            <code>${result.businessId}</code>
          </div>
          <div class="info-item">
            <strong>API Key:</strong>
            <div class="api-key-display">
              <code>${result.apiKey}</code>
              <button type="button" onclick="navigator.clipboard.writeText('${result.apiKey}')">
                Copy
              </button>
            </div>
            <p class="warning">⚠️ Save this API key securely. You won't be able to see it again.</p>
          </div>
          ${result.mcpEndpoint ? `
            <div class="info-item">
              <strong>MCP Endpoint:</strong>
              <code>${result.mcpEndpoint}</code>
            </div>
          ` : ''}
          ${result.a2aEndpoint ? `
            <div class="info-item">
              <strong>A2A Endpoint:</strong>
              <code>${result.a2aEndpoint}</code>
            </div>
          ` : ''}
        </div>
        <div class="next-steps">
          <h3>Next Steps:</h3>
          <ol>
            <li>Save your API key in a secure location</li>
            <li>Test your integration with our sandbox environment</li>
            <li>Review the <a href="/pages/guides.html">integration guides</a></li>
            <li>Contact support if you need assistance</li>
          </ol>
        </div>
      `;
    }

    if (successMessage) {
      successMessage.style.display = 'block';
    }

    this.scrollToTop();
  }

  /**
   * Hide success message
   */
  hideSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }

  /**
   * Show/hide loading overlay
   */
  showLoadingOverlay(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Save form as draft to localStorage
   */
  saveDraft() {
    try {
      localStorage.setItem('bais-onboarding-draft', JSON.stringify(this.formState));
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    }
  }

  /**
   * Load draft from localStorage
   */
  loadDraft() {
    try {
      const draft = localStorage.getItem('bais-onboarding-draft');
      if (draft) {
        this.formState = JSON.parse(draft);
        this.render();
        this.attachEventListeners();
        this.initializeServiceConfigurators();
        alert('Draft loaded successfully!');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft() {
    localStorage.removeItem('bais-onboarding-draft');
  }

  /**
   * Scroll to top of form
   */
  scrollToTop() {
    this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
