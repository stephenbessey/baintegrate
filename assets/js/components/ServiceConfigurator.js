/**
 * Service Configurator Component
 * Manages individual service configuration including workflow, parameters,
 * availability, cancellation policy, and payment configuration
 */

import CONSTANTS from '../core/constants.js';
import ParameterBuilder from './ParameterBuilder.js';

export default class ServiceConfigurator {
  constructor(serviceIndex, onUpdate, onRemove) {
    this.serviceIndex = serviceIndex;
    this.onUpdate = onUpdate;
    this.onRemove = onRemove;
    this.parameterBuilder = null;
    this.container = null;
  }

  /**
   * Initialize the service configurator
   */
  initialize(container, initialService = null) {
    this.container = container;
    this.service = initialService || this.createEmptyService();
    this.render();
    this.attachEventListeners();
    this.initializeParameterBuilder();
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
   * Render complete service configuration
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="service-config" data-service-index="${this.serviceIndex}">
        <div class="service-header">
          <h3>Service ${this.serviceIndex + 1}</h3>
          ${this.serviceIndex > 0 ? `
            <button type="button" class="remove-service-btn" data-service-index="${this.serviceIndex}">
              Remove Service
            </button>
          ` : ''}
        </div>

        <div class="service-body">
          ${this.renderBasicInfo()}
          ${this.renderWorkflowConfig()}
          <div id="parameters-container-${this.serviceIndex}"></div>
          ${this.renderAvailabilityConfig()}
          ${this.renderCancellationPolicy()}
          ${this.renderPaymentConfig()}
          ${this.renderServicePolicies()}
        </div>
      </div>
    `;
  }

  /**
   * Render basic service information
   */
  renderBasicInfo() {
    return `
      <div class="form-section">
        <h4>Basic Information</h4>

        <div class="form-row">
          <div class="form-group">
            <label for="service-name-${this.serviceIndex}">
              Service Name <span class="required">*</span>
            </label>
            <input
              type="text"
              id="service-name-${this.serviceIndex}"
              class="service-input"
              data-field="name"
              placeholder="e.g., Room Booking"
              value="${this.service.name}"
              required
              maxlength="100">
            <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.SERVICE_NAME}</span>
          </div>

          <div class="form-group">
            <label for="service-id-${this.serviceIndex}">
              Service ID <span class="required">*</span>
            </label>
            <input
              type="text"
              id="service-id-${this.serviceIndex}"
              class="service-input"
              data-field="id"
              placeholder="e.g., room_booking"
              value="${this.service.id}"
              required
              pattern="^[a-z0-9_]+$"
              maxlength="100">
            <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.SERVICE_ID}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="service-description-${this.serviceIndex}">
            Description <span class="required">*</span>
          </label>
          <textarea
            id="service-description-${this.serviceIndex}"
            class="service-input"
            data-field="description"
            placeholder="Describe what this service offers"
            required
            maxlength="500">${this.service.description}</textarea>
          <span class="char-count">${this.service.description.length}/500</span>
        </div>

        <div class="form-group">
          <label for="service-category-${this.serviceIndex}">
            Category <span class="required">*</span>
          </label>
          <input
            type="text"
            id="service-category-${this.serviceIndex}"
            class="service-input"
            data-field="category"
            placeholder="e.g., accommodation, dining, retail"
            value="${this.service.category}"
            required
            maxlength="100">
          <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.SERVICE_CATEGORY}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render workflow configuration
   */
  renderWorkflowConfig() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h4>Workflow Configuration</h4>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <div class="form-group">
            <label for="workflow-pattern-${this.serviceIndex}">
              Workflow Pattern <span class="required">*</span>
            </label>
            <select
              id="workflow-pattern-${this.serviceIndex}"
              class="workflow-input"
              data-field="pattern"
              required>
              ${Object.entries(CONSTANTS.WORKFLOW_PATTERN_LABELS).map(([value, label]) => `
                <option value="${value}" ${this.service.workflow.pattern === value ? 'selected' : ''}>
                  ${label}
                </option>
              `).join('')}
            </select>
            <span class="help-text">${CONSTANTS.FIELD_HELP_TEXT.WORKFLOW_PATTERN}</span>
          </div>

          <div id="workflow-description-${this.serviceIndex}" class="workflow-description">
            ${CONSTANTS.WORKFLOW_PATTERN_DESCRIPTIONS[this.service.workflow.pattern] || ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render availability configuration
   */
  renderAvailabilityConfig() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h4>Availability Configuration</h4>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="availability-realtime-${this.serviceIndex}"
                class="availability-input"
                data-field="realTime"
                ${this.service.availability.realTime ? 'checked' : ''}>
              <span>Real-time Availability</span>
            </label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="availability-cache-${this.serviceIndex}">
                Cache Timeout (seconds)
              </label>
              <input
                type="number"
                id="availability-cache-${this.serviceIndex}"
                class="availability-input"
                data-field="cacheTimeoutSeconds"
                min="0"
                max="3600"
                value="${this.service.availability.cacheTimeoutSeconds}">
              <span class="help-text">How long to cache availability data (0-3600)</span>
            </div>

            <div class="form-group">
              <label for="availability-advance-${this.serviceIndex}">
                Advance Booking Days
              </label>
              <input
                type="number"
                id="availability-advance-${this.serviceIndex}"
                class="availability-input"
                data-field="advanceBookingDays"
                min="1"
                max="730"
                value="${this.service.availability.advanceBookingDays}">
              <span class="help-text">How far in advance customers can book (1-730 days)</span>
            </div>
          </div>

          <div class="form-group">
            <label for="availability-endpoint-${this.serviceIndex}">
              Custom Availability Endpoint (optional)
            </label>
            <input
              type="url"
              id="availability-endpoint-${this.serviceIndex}"
              class="availability-input"
              data-field="endpoint"
              placeholder="https://api.yourbusiness.com/availability"
              value="${this.service.availability.endpoint || ''}">
            <span class="help-text">Leave blank to auto-generate</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render cancellation policy
   */
  renderCancellationPolicy() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h4>Cancellation Policy</h4>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <div class="form-group">
            <label for="cancel-type-${this.serviceIndex}">
              Policy Type <span class="required">*</span>
            </label>
            <select
              id="cancel-type-${this.serviceIndex}"
              class="cancellation-input"
              data-field="type"
              required>
              ${Object.entries(CONSTANTS.CANCELLATION_POLICY_LABELS).map(([value, label]) => `
                <option value="${value}" ${this.service.cancellationPolicy.type === value ? 'selected' : ''}>
                  ${label}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="cancel-free-until-${this.serviceIndex}">
                Free Cancellation Until (hours before)
              </label>
              <input
                type="number"
                id="cancel-free-until-${this.serviceIndex}"
                class="cancellation-input"
                data-field="freeUntilHours"
                min="0"
                max="168"
                value="${this.service.cancellationPolicy.freeUntilHours}">
            </div>

            <div class="form-group">
              <label for="cancel-penalty-${this.serviceIndex}">
                Penalty Percentage (0-100)
              </label>
              <input
                type="number"
                id="cancel-penalty-${this.serviceIndex}"
                class="cancellation-input"
                data-field="penaltyPercentage"
                min="0"
                max="100"
                value="${this.service.cancellationPolicy.penaltyPercentage}">
            </div>
          </div>

          <div class="form-group">
            <label for="cancel-description-${this.serviceIndex}">
              Policy Description <span class="required">*</span>
            </label>
            <textarea
              id="cancel-description-${this.serviceIndex}"
              class="cancellation-input"
              data-field="description"
              placeholder="Describe your cancellation policy in detail"
              required
              maxlength="500">${this.service.cancellationPolicy.description}</textarea>
            <span class="char-count">${this.service.cancellationPolicy.description.length}/500</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render payment configuration
   */
  renderPaymentConfig() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h4>Payment Configuration</h4>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <div class="form-group">
            <label>Accepted Payment Methods <span class="required">*</span></label>
            <div class="checkbox-group">
              ${Object.entries(CONSTANTS.PAYMENT_METHOD_LABELS).map(([value, label]) => `
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="payment-methods-${this.serviceIndex}"
                    value="${value}"
                    ${this.service.payment.methods.includes(value) ? 'checked' : ''}>
                  <span>${label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label>Payment Timing <span class="required">*</span></label>
            <div class="radio-group">
              ${Object.entries(CONSTANTS.PAYMENT_TIMING_LABELS).map(([value, label]) => `
                <label class="radio-label">
                  <input
                    type="radio"
                    name="payment-timing-${this.serviceIndex}"
                    value="${value}"
                    ${this.service.payment.timing === value ? 'checked' : ''}>
                  <span>${label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="payment-deposit-${this.serviceIndex}"
                class="payment-deposit-checkbox"
                ${this.service.payment.depositRequired ? 'checked' : ''}>
              <span>Require Deposit</span>
            </label>
          </div>

          <div class="form-group deposit-percentage ${this.service.payment.depositRequired ? '' : 'hidden'}">
            <label for="payment-deposit-percent-${this.serviceIndex}">
              Deposit Percentage (0-100)
            </label>
            <input
              type="number"
              id="payment-deposit-percent-${this.serviceIndex}"
              class="payment-input"
              data-field="depositPercentage"
              min="0"
              max="100"
              value="${this.service.payment.depositPercentage || 0}">
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render service policies
   */
  renderServicePolicies() {
    return `
      <div class="form-section collapsible-section">
        <div class="collapsible-header">
          <h4>Service Policies</h4>
          <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
          <div class="form-row">
            <div class="form-group">
              <label for="policy-modification-${this.serviceIndex}">
                Modification Fee
              </label>
              <input
                type="number"
                id="policy-modification-${this.serviceIndex}"
                class="policy-input"
                data-field="modificationFee"
                min="0"
                step="0.01"
                value="${this.service.policies.modificationFee}">
            </div>

            <div class="form-group">
              <label for="policy-noshow-${this.serviceIndex}">
                No-Show Penalty
              </label>
              <input
                type="number"
                id="policy-noshow-${this.serviceIndex}"
                class="policy-input"
                data-field="noShowPenalty"
                min="0"
                step="0.01"
                value="${this.service.policies.noShowPenalty}">
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
    if (!this.container) return;

    // Remove service button
    const removeButton = this.container.querySelector('.remove-service-btn');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this service?')) {
          this.onRemove(this.serviceIndex);
        }
      });
    }

    // Collapsible sections
    this.container.querySelectorAll('.collapsible-header').forEach(header => {
      header.addEventListener('click', this.toggleCollapsible.bind(this));
    });

    // All service inputs
    this.container.querySelectorAll('.service-input').forEach(input => {
      input.addEventListener('input', this.handleServiceInput.bind(this));
    });

    // Workflow inputs
    this.container.querySelectorAll('.workflow-input').forEach(input => {
      input.addEventListener('change', this.handleWorkflowInput.bind(this));
    });

    // Availability inputs
    this.container.querySelectorAll('.availability-input').forEach(input => {
      const event = input.type === 'checkbox' ? 'change' : 'input';
      input.addEventListener(event, this.handleAvailabilityInput.bind(this));
    });

    // Cancellation inputs
    this.container.querySelectorAll('.cancellation-input').forEach(input => {
      const event = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(event, this.handleCancellationInput.bind(this));
    });

    // Payment method checkboxes
    this.container.querySelectorAll(`[name="payment-methods-${this.serviceIndex}"]`).forEach(checkbox => {
      checkbox.addEventListener('change', this.handlePaymentMethodsChange.bind(this));
    });

    // Payment timing radios
    this.container.querySelectorAll(`[name="payment-timing-${this.serviceIndex}"]`).forEach(radio => {
      radio.addEventListener('change', this.handlePaymentTimingChange.bind(this));
    });

    // Deposit checkbox
    const depositCheckbox = this.container.querySelector('.payment-deposit-checkbox');
    if (depositCheckbox) {
      depositCheckbox.addEventListener('change', this.handleDepositCheckboxChange.bind(this));
    }

    // Deposit percentage input
    const depositInput = this.container.querySelector(`#payment-deposit-percent-${this.serviceIndex}`);
    if (depositInput) {
      depositInput.addEventListener('input', this.handlePaymentInput.bind(this));
    }

    // Policy inputs
    this.container.querySelectorAll('.policy-input').forEach(input => {
      input.addEventListener('input', this.handlePolicyInput.bind(this));
    });
  }

  /**
   * Initialize parameter builder
   */
  initializeParameterBuilder() {
    const parametersContainer = this.container.querySelector(`#parameters-container-${this.serviceIndex}`);
    if (!parametersContainer) return;

    this.parameterBuilder = new ParameterBuilder(
      this.serviceIndex,
      (parameters) => {
        this.service.parameters = parameters;
        this.notifyUpdate();
      }
    );

    this.parameterBuilder.initialize(parametersContainer, this.service.parameters);
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
      icon.textContent = isOpen ? '▼' : '▲';
    }
  }

  /**
   * Handle service input changes
   */
  handleServiceInput(e) {
    const field = e.target.dataset.field;
    this.service[field] = e.target.value;
    this.notifyUpdate();
  }

  /**
   * Handle workflow input changes
   */
  handleWorkflowInput(e) {
    const field = e.target.dataset.field;
    this.service.workflow[field] = e.target.value;

    // Update workflow description
    const descElement = this.container.querySelector(`#workflow-description-${this.serviceIndex}`);
    if (descElement && field === 'pattern') {
      descElement.textContent = CONSTANTS.WORKFLOW_PATTERN_DESCRIPTIONS[e.target.value] || '';
    }

    this.notifyUpdate();
  }

  /**
   * Handle availability input changes
   */
  handleAvailabilityInput(e) {
    const field = e.target.dataset.field;
    const value = e.target.type === 'checkbox' ? e.target.checked :
                  (e.target.type === 'number' ? parseInt(e.target.value) : e.target.value);
    this.service.availability[field] = value;
    this.notifyUpdate();
  }

  /**
   * Handle cancellation input changes
   */
  handleCancellationInput(e) {
    const field = e.target.dataset.field;
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    this.service.cancellationPolicy[field] = value;
    this.notifyUpdate();
  }

  /**
   * Handle payment methods change
   */
  handlePaymentMethodsChange() {
    const checkboxes = this.container.querySelectorAll(`[name="payment-methods-${this.serviceIndex}"]:checked`);
    this.service.payment.methods = Array.from(checkboxes).map(cb => cb.value);
    this.notifyUpdate();
  }

  /**
   * Handle payment timing change
   */
  handlePaymentTimingChange(e) {
    this.service.payment.timing = e.target.value;
    this.notifyUpdate();
  }

  /**
   * Handle deposit checkbox change
   */
  handleDepositCheckboxChange(e) {
    this.service.payment.depositRequired = e.target.checked;
    const depositPercentageGroup = this.container.querySelector('.deposit-percentage');
    if (depositPercentageGroup) {
      depositPercentageGroup.classList.toggle('hidden', !e.target.checked);
    }
    this.notifyUpdate();
  }

  /**
   * Handle payment input changes
   */
  handlePaymentInput(e) {
    const field = e.target.dataset.field;
    this.service.payment[field] = parseFloat(e.target.value);
    this.notifyUpdate();
  }

  /**
   * Handle policy input changes
   */
  handlePolicyInput(e) {
    const field = e.target.dataset.field;
    this.service.policies[field] = parseFloat(e.target.value);
    this.notifyUpdate();
  }

  /**
   * Get service configuration
   */
  getService() {
    return this.service;
  }

  /**
   * Set service configuration
   */
  setService(service) {
    this.service = service;
    if (this.container) {
      this.render();
      this.attachEventListeners();
      this.initializeParameterBuilder();
    }
  }

  /**
   * Notify parent of updates
   */
  notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate(this.serviceIndex, this.service);
    }
  }
}
