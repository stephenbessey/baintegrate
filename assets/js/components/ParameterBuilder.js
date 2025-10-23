/**
 * Parameter Builder Component
 * Dynamic parameter configuration builder for services
 * Allows adding, editing, and removing parameters with constraints and pricing
 */

import CONSTANTS from '../core/constants.js';

export default class ParameterBuilder {
  constructor(serviceIndex, onUpdate) {
    this.serviceIndex = serviceIndex;
    this.onUpdate = onUpdate;
    this.parameters = [];
    this.container = null;
  }

  /**
   * Initialize the parameter builder
   */
  initialize(container, initialParameters = []) {
    this.container = container;
    this.parameters = initialParameters.length > 0 ? initialParameters : [];
    this.render();
    this.attachEventListeners();
  }

  /**
   * Render the complete parameter builder
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = this.getHTML();
  }

  /**
   * Get HTML for parameter builder
   */
  getHTML() {
    return `
      <div class="parameter-builder" data-service-index="${this.serviceIndex}">
        <div class="parameter-builder-header">
          <h4>Service Parameters</h4>
          <p class="help-text">${CONSTANTS.FIELD_HELP_TEXT.PARAMETER_NAME}</p>
        </div>

        <div class="parameter-list">
          ${this.parameters.map((param, index) => this.renderParameter(param, index)).join('')}
        </div>

        <button type="button" class="add-parameter-btn" data-service-index="${this.serviceIndex}">
          + Add Parameter
        </button>

        ${this.parameters.length === 0 ? '<p class="validation-hint">At least one parameter is required</p>' : ''}
      </div>
    `;
  }

  /**
   * Render a single parameter configuration
   */
  renderParameter(param, index) {
    return `
      <div class="parameter-config" data-param-index="${index}">
        <div class="parameter-header">
          <h5>Parameter ${index + 1}</h5>
          <button type="button" class="remove-param-btn" data-param-index="${index}">
            Remove
          </button>
        </div>

        <div class="parameter-body">
          <!-- Basic Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="param-name-${this.serviceIndex}-${index}">
                Parameter Name <span class="required">*</span>
              </label>
              <input
                type="text"
                id="param-name-${this.serviceIndex}-${index}"
                name="param-name-${this.serviceIndex}-${index}"
                class="param-name-input"
                placeholder="e.g., check_in_date"
                value="${param.name || ''}"
                required
                pattern="^[a-z_][a-z0-9_]*$"
                data-param-index="${index}">
              <span class="help-text">Lowercase letters, numbers, underscores only</span>
            </div>

            <div class="form-group">
              <label for="param-type-${this.serviceIndex}-${index}">
                Type <span class="required">*</span>
              </label>
              <select
                id="param-type-${this.serviceIndex}-${index}"
                name="param-type-${this.serviceIndex}-${index}"
                class="param-type-select"
                data-param-index="${index}"
                required>
                ${this.renderTypeOptions(param.type)}
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="param-description-${this.serviceIndex}-${index}">
              Description <span class="required">*</span>
            </label>
            <textarea
              id="param-description-${this.serviceIndex}-${index}"
              name="param-description-${this.serviceIndex}-${index}"
              class="param-description-input"
              placeholder="Describe what this parameter represents"
              data-param-index="${index}"
              maxlength="500"
              required>${param.description || ''}</textarea>
            <span class="char-count">${(param.description || '').length}/500</span>
          </div>

          <!-- Required Checkbox -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                name="param-required-${this.serviceIndex}-${index}"
                class="param-required-checkbox"
                data-param-index="${index}"
                ${param.required ? 'checked' : ''}>
              <span>Required Parameter</span>
            </label>
          </div>

          <!-- Default Value -->
          <div class="form-group">
            <label for="param-default-${this.serviceIndex}-${index}">
              Default Value (optional)
            </label>
            ${this.renderDefaultValueInput(param, index)}
          </div>

          <!-- Constraints (Type-specific) -->
          <div class="parameter-constraints">
            <button type="button" class="collapsible-trigger" data-param-index="${index}">
              <span>Constraints & Validation</span>
              <span class="collapsible-icon">▼</span>
            </button>
            <div class="collapsible-content" data-param-index="${index}">
              ${this.renderConstraints(param, index)}
            </div>
          </div>

          <!-- Pricing Configuration -->
          <div class="parameter-pricing">
            <button type="button" class="collapsible-trigger" data-param-index="${index}">
              <span>Pricing Configuration (optional)</span>
              <span class="collapsible-icon">▼</span>
            </button>
            <div class="collapsible-content" data-param-index="${index}">
              ${this.renderPricingConfig(param, index)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render type options dropdown
   */
  renderTypeOptions(selectedType) {
    return Object.entries(CONSTANTS.PARAMETER_TYPE_LABELS).map(([value, label]) => `
      <option value="${value}" ${selectedType === value ? 'selected' : ''}>
        ${label}
      </option>
    `).join('');
  }

  /**
   * Render default value input based on type
   */
  renderDefaultValueInput(param, index) {
    const type = param.type || 'string';

    switch (type) {
      case CONSTANTS.PARAMETER_TYPES.BOOLEAN:
        return `
          <select
            id="param-default-${this.serviceIndex}-${index}"
            class="param-default-input"
            data-param-index="${index}">
            <option value="">None</option>
            <option value="true" ${param.default === true ? 'selected' : ''}>True</option>
            <option value="false" ${param.default === false ? 'selected' : ''}>False</option>
          </select>
        `;

      case CONSTANTS.PARAMETER_TYPES.INTEGER:
        return `
          <input
            type="number"
            id="param-default-${this.serviceIndex}-${index}"
            class="param-default-input"
            data-param-index="${index}"
            step="1"
            value="${param.default !== undefined ? param.default : ''}">
        `;

      case CONSTANTS.PARAMETER_TYPES.NUMBER:
        return `
          <input
            type="number"
            id="param-default-${this.serviceIndex}-${index}"
            class="param-default-input"
            data-param-index="${index}"
            step="any"
            value="${param.default !== undefined ? param.default : ''}">
        `;

      case CONSTANTS.PARAMETER_TYPES.DATE:
        return `
          <input
            type="date"
            id="param-default-${this.serviceIndex}-${index}"
            class="param-default-input"
            data-param-index="${index}"
            value="${param.default || ''}">
        `;

      default:
        return `
          <input
            type="text"
            id="param-default-${this.serviceIndex}-${index}"
            class="param-default-input"
            data-param-index="${index}"
            value="${param.default || ''}">
        `;
    }
  }

  /**
   * Render constraints based on parameter type
   */
  renderConstraints(param, index) {
    const type = param.type || 'string';
    const constraints = param.constraints || {};

    if (type === CONSTANTS.PARAMETER_TYPES.NUMBER || type === CONSTANTS.PARAMETER_TYPES.INTEGER) {
      return this.renderNumberConstraints(constraints, index);
    }

    if (type === CONSTANTS.PARAMETER_TYPES.STRING) {
      return this.renderStringConstraints(constraints, index);
    }

    if (type === CONSTANTS.PARAMETER_TYPES.ARRAY) {
      return this.renderArrayConstraints(constraints, index);
    }

    return '<p class="help-text">No specific constraints available for this type.</p>';
  }

  /**
   * Render number/integer constraints
   */
  renderNumberConstraints(constraints, index) {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="param-min-${this.serviceIndex}-${index}">Minimum Value</label>
          <input
            type="number"
            id="param-min-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="minimum"
            data-param-index="${index}"
            step="any"
            value="${constraints.minimum !== undefined ? constraints.minimum : ''}">
        </div>

        <div class="form-group">
          <label for="param-max-${this.serviceIndex}-${index}">Maximum Value</label>
          <input
            type="number"
            id="param-max-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="maximum"
            data-param-index="${index}"
            step="any"
            value="${constraints.maximum !== undefined ? constraints.maximum : ''}">
        </div>
      </div>
    `;
  }

  /**
   * Render string constraints
   */
  renderStringConstraints(constraints, index) {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="param-minlength-${this.serviceIndex}-${index}">Minimum Length</label>
          <input
            type="number"
            id="param-minlength-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="minLength"
            data-param-index="${index}"
            min="0"
            step="1"
            value="${constraints.minLength !== undefined ? constraints.minLength : ''}">
        </div>

        <div class="form-group">
          <label for="param-maxlength-${this.serviceIndex}-${index}">Maximum Length</label>
          <input
            type="number"
            id="param-maxlength-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="maxLength"
            data-param-index="${index}"
            min="0"
            step="1"
            value="${constraints.maxLength !== undefined ? constraints.maxLength : ''}">
        </div>
      </div>

      <div class="form-group">
        <label for="param-pattern-${this.serviceIndex}-${index}">Pattern (Regex)</label>
        <input
          type="text"
          id="param-pattern-${this.serviceIndex}-${index}"
          class="param-constraint-input"
          data-constraint="pattern"
          data-param-index="${index}"
          placeholder="e.g., ^[A-Z]{2}\\d{3}$"
          value="${constraints.pattern || ''}">
        <span class="help-text">Regular expression for validation</span>
      </div>

      <div class="form-group">
        <label for="param-enum-${this.serviceIndex}-${index}">Allowed Values (comma-separated)</label>
        <input
          type="text"
          id="param-enum-${this.serviceIndex}-${index}"
          class="param-constraint-input"
          data-constraint="enum"
          data-param-index="${index}"
          placeholder="value1, value2, value3"
          value="${constraints.enum ? constraints.enum.join(', ') : ''}">
        <span class="help-text">Restricts input to specific values</span>
      </div>

      <div class="form-group">
        <label for="param-format-${this.serviceIndex}-${index}">Format</label>
        <select
          id="param-format-${this.serviceIndex}-${index}"
          class="param-constraint-input"
          data-constraint="format"
          data-param-index="${index}">
          <option value="">None</option>
          ${Object.entries(CONSTANTS.PARAMETER_FORMATS).map(([key, value]) => `
            <option value="${value}" ${constraints.format === value ? 'selected' : ''}>
              ${key}
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  /**
   * Render array constraints
   */
  renderArrayConstraints(constraints, index) {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="param-minitems-${this.serviceIndex}-${index}">Minimum Items</label>
          <input
            type="number"
            id="param-minitems-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="minItems"
            data-param-index="${index}"
            min="0"
            step="1"
            value="${constraints.minItems !== undefined ? constraints.minItems : ''}">
        </div>

        <div class="form-group">
          <label for="param-maxitems-${this.serviceIndex}-${index}">Maximum Items</label>
          <input
            type="number"
            id="param-maxitems-${this.serviceIndex}-${index}"
            class="param-constraint-input"
            data-constraint="maxItems"
            data-param-index="${index}"
            min="0"
            step="1"
            value="${constraints.maxItems !== undefined ? constraints.maxItems : ''}">
        </div>
      </div>
    `;
  }

  /**
   * Render pricing configuration
   */
  renderPricingConfig(param, index) {
    const pricing = param.pricing || {};
    const hasPricing = param.pricing !== null && param.pricing !== undefined;

    return `
      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="param-has-pricing-checkbox"
            data-param-index="${index}"
            ${hasPricing ? 'checked' : ''}>
          <span>This parameter affects pricing</span>
        </label>
      </div>

      <div class="pricing-fields ${hasPricing ? '' : 'hidden'}">
        <div class="form-row">
          <div class="form-group">
            <label for="param-price-base-${this.serviceIndex}-${index}">Base Rate</label>
            <input
              type="number"
              id="param-price-base-${this.serviceIndex}-${index}"
              class="param-pricing-input"
              data-pricing="baseRate"
              data-param-index="${index}"
              min="0"
              step="0.01"
              value="${pricing.baseRate !== undefined ? pricing.baseRate : ''}">
          </div>

          <div class="form-group">
            <label for="param-price-currency-${this.serviceIndex}-${index}">Currency</label>
            <select
              id="param-price-currency-${this.serviceIndex}-${index}"
              class="param-pricing-input"
              data-pricing="currency"
              data-param-index="${index}">
              ${Object.entries(CONSTANTS.CURRENCIES).map(([code]) => `
                <option value="${code}" ${(pricing.currency || 'USD') === code ? 'selected' : ''}>
                  ${code}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="param-price-tax-${this.serviceIndex}-${index}">Tax Rate (0-1)</label>
            <input
              type="number"
              id="param-price-tax-${this.serviceIndex}-${index}"
              class="param-pricing-input"
              data-pricing="taxRate"
              data-param-index="${index}"
              min="0"
              max="1"
              step="0.01"
              value="${pricing.taxRate !== undefined ? pricing.taxRate : ''}">
          </div>

          <div class="form-group">
            <label for="param-price-service-${this.serviceIndex}-${index}">Service Fee</label>
            <input
              type="number"
              id="param-price-service-${this.serviceIndex}-${index}"
              class="param-pricing-input"
              data-pricing="serviceFee"
              data-param-index="${index}"
              min="0"
              step="0.01"
              value="${pricing.serviceFee !== undefined ? pricing.serviceFee : ''}">
          </div>
        </div>

        <div class="form-group">
          <label for="param-price-min-${this.serviceIndex}-${index}">Minimum Charge</label>
          <input
            type="number"
            id="param-price-min-${this.serviceIndex}-${index}"
            class="param-pricing-input"
            data-pricing="minimumCharge"
            data-param-index="${index}"
            min="0"
            step="0.01"
            value="${pricing.minimumCharge !== undefined ? pricing.minimumCharge : ''}">
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (!this.container) return;

    // Add parameter button
    const addButton = this.container.querySelector('.add-parameter-btn');
    if (addButton) {
      addButton.addEventListener('click', () => this.addParameter());
    }

    // Remove parameter buttons
    this.container.querySelectorAll('.remove-param-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.paramIndex);
        this.removeParameter(index);
      });
    });

    // Collapsible triggers
    this.container.querySelectorAll('.collapsible-trigger').forEach(trigger => {
      trigger.addEventListener('click', this.toggleCollapsible.bind(this));
    });

    // Input changes
    this.attachInputChangeListeners();

    // Type change listeners (to update constraints section)
    this.container.querySelectorAll('.param-type-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.paramIndex);
        this.handleTypeChange(index);
      });
    });

    // Pricing checkbox
    this.container.querySelectorAll('.param-has-pricing-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.paramIndex);
        const pricingFields = e.target.closest('.parameter-pricing').querySelector('.pricing-fields');
        if (pricingFields) {
          pricingFields.classList.toggle('hidden', !e.target.checked);
        }
        this.updateParameterFromInputs(index);
      });
    });
  }

  /**
   * Attach input change listeners for real-time updates
   */
  attachInputChangeListeners() {
    // All parameter inputs
    const inputs = this.container.querySelectorAll(
      '.param-name-input, .param-type-select, .param-description-input, ' +
      '.param-required-checkbox, .param-default-input, .param-constraint-input, .param-pricing-input'
    );

    inputs.forEach(input => {
      const event = input.type === 'checkbox' ? 'change' : 'input';
      input.addEventListener(event, (e) => {
        const index = parseInt(e.target.dataset.paramIndex);
        this.updateParameterFromInputs(index);
      });
    });
  }

  /**
   * Toggle collapsible section
   */
  toggleCollapsible(e) {
    const trigger = e.currentTarget;
    const icon = trigger.querySelector('.collapsible-icon');
    const content = trigger.nextElementSibling;

    if (content && content.classList.contains('collapsible-content')) {
      const isOpen = content.style.display === 'block';
      content.style.display = isOpen ? 'none' : 'block';
      icon.textContent = isOpen ? '▼' : '▲';
    }
  }

  /**
   * Add new parameter
   */
  addParameter() {
    if (this.parameters.length >= CONSTANTS.CONSTRAINTS.MAX_PARAMETERS_PER_SERVICE) {
      alert(`Maximum ${CONSTANTS.CONSTRAINTS.MAX_PARAMETERS_PER_SERVICE} parameters allowed per service`);
      return;
    }

    const newParameter = {
      name: '',
      type: CONSTANTS.PARAMETER_TYPES.STRING,
      description: '',
      required: false,
      default: undefined,
      constraints: {},
      pricing: null
    };

    this.parameters.push(newParameter);
    this.render();
    this.attachEventListeners();
    this.notifyUpdate();

    // Scroll to new parameter
    const newParamElement = this.container.querySelector(`.parameter-config[data-param-index="${this.parameters.length - 1}"]`);
    if (newParamElement) {
      newParamElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Remove parameter by index
   */
  removeParameter(index) {
    if (!confirm('Are you sure you want to remove this parameter?')) {
      return;
    }

    this.parameters.splice(index, 1);
    this.render();
    this.attachEventListeners();
    this.notifyUpdate();
  }

  /**
   * Handle type change (re-render constraints section)
   */
  handleTypeChange(index) {
    this.updateParameterFromInputs(index);
    this.render();
    this.attachEventListeners();
  }

  /**
   * Update parameter object from current input values
   */
  updateParameterFromInputs(index) {
    if (index < 0 || index >= this.parameters.length) return;

    const param = this.parameters[index];
    const prefix = `#param-`;

    // Basic fields
    const nameInput = this.container.querySelector(`${prefix}name-${this.serviceIndex}-${index}`);
    const typeSelect = this.container.querySelector(`${prefix}type-${this.serviceIndex}-${index}`);
    const descInput = this.container.querySelector(`${prefix}description-${this.serviceIndex}-${index}`);
    const requiredCheckbox = this.container.querySelector(`[name="param-required-${this.serviceIndex}-${index}"]`);
    const defaultInput = this.container.querySelector(`${prefix}default-${this.serviceIndex}-${index}`);

    if (nameInput) param.name = nameInput.value;
    if (typeSelect) param.type = typeSelect.value;
    if (descInput) param.description = descInput.value;
    if (requiredCheckbox) param.required = requiredCheckbox.checked;
    if (defaultInput) {
      param.default = defaultInput.value === '' ? undefined :
                      (param.type === CONSTANTS.PARAMETER_TYPES.INTEGER ? parseInt(defaultInput.value) :
                       param.type === CONSTANTS.PARAMETER_TYPES.NUMBER ? parseFloat(defaultInput.value) :
                       param.type === CONSTANTS.PARAMETER_TYPES.BOOLEAN ? defaultInput.value === 'true' :
                       defaultInput.value);
    }

    // Constraints
    this.updateParameterConstraints(index);

    // Pricing
    this.updateParameterPricing(index);

    this.notifyUpdate();
  }

  /**
   * Update parameter constraints from inputs
   */
  updateParameterConstraints(index) {
    const param = this.parameters[index];
    const constraintInputs = this.container.querySelectorAll(`.param-constraint-input[data-param-index="${index}"]`);

    param.constraints = {};

    constraintInputs.forEach(input => {
      const constraint = input.dataset.constraint;
      let value = input.value;

      if (value === '') return;

      // Parse based on constraint type
      if (['minimum', 'maximum'].includes(constraint)) {
        value = parseFloat(value);
      } else if (['minLength', 'maxLength', 'minItems', 'maxItems'].includes(constraint)) {
        value = parseInt(value);
      } else if (constraint === 'enum') {
        value = value.split(',').map(v => v.trim()).filter(v => v);
      }

      param.constraints[constraint] = value;
    });
  }

  /**
   * Update parameter pricing from inputs
   */
  updateParameterPricing(index) {
    const param = this.parameters[index];
    const hasPricingCheckbox = this.container.querySelector(`.param-has-pricing-checkbox[data-param-index="${index}"]`);

    if (!hasPricingCheckbox || !hasPricingCheckbox.checked) {
      param.pricing = null;
      return;
    }

    const pricingInputs = this.container.querySelectorAll(`.param-pricing-input[data-param-index="${index}"]`);
    param.pricing = {};

    pricingInputs.forEach(input => {
      const pricingField = input.dataset.pricing;
      let value = input.value;

      if (value === '') return;

      if (['baseRate', 'taxRate', 'serviceFee', 'minimumCharge'].includes(pricingField)) {
        value = parseFloat(value);
      }

      param.pricing[pricingField] = value;
    });
  }

  /**
   * Get all parameters
   */
  getParameters() {
    return this.parameters;
  }

  /**
   * Set parameters (for initialization)
   */
  setParameters(parameters) {
    this.parameters = parameters || [];
    if (this.container) {
      this.render();
      this.attachEventListeners();
    }
  }

  /**
   * Notify parent of updates
   */
  notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate(this.parameters);
    }
  }
}
