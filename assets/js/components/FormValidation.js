/**
 * FormValidation Component
 * Multi-step form with real-time validation and accessibility
 * Following Clean Code principles with single responsibility methods
 */

import CONFIG from '../core/config.js';

export default class FormValidation {
  constructor(selector, options = {}) {
    this.formElement = document.querySelector(selector);
    if (!this.formElement) return;
    
    this.configuration = this.createConfiguration(options);
    this.currentStepNumber = 1;
    this.totalStepCount = this.calculateTotalSteps();
    this.formData = {};
    
    this.initialize();
  }
  
  createConfiguration(options) {
    return {
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      validateOnBlur: options.validateOnBlur !== false,
      validateOnInput: options.validateOnInput !== false
    };
  }

  calculateTotalSteps() {
    return this.formElement.querySelectorAll('.form-step:not([data-step="success"])').length;
  }

  initialize() {
    this.setupStepNavigation();
    this.setupFieldValidation();
    this.setupFormSubmission();
    this.updateProgressIndicator();
  }
  
  setupStepNavigation() {
    this.attachNextStepListeners();
    this.attachPreviousStepListeners();
  }

  attachNextStepListeners() {
    const nextStepButtons = this.formElement.querySelectorAll('[data-next-step]');
    nextStepButtons.forEach(button => {
      button.addEventListener('click', () => this.navigateToNextStep());
    });
  }

  attachPreviousStepListeners() {
    const previousStepButtons = this.formElement.querySelectorAll('[data-prev-step]');
    previousStepButtons.forEach(button => {
      button.addEventListener('click', () => this.navigateToPreviousStep());
    });
  }
  
  setupFieldValidation() {
    const inputElements = this.formElement.querySelectorAll('input, select, textarea');
    
    inputElements.forEach(input => {
      this.setupInputValidation(input);
    });
  }

  setupInputValidation(input) {
    if (this.isRadioButton(input)) {
      this.setupRadioButtonValidation(input);
      return;
    }
    
    this.setupStandardInputValidation(input);
    this.setupPhoneNumberFormatting(input);
  }

  isRadioButton(input) {
    return input.type === 'radio';
  }

  setupRadioButtonValidation(input) {
    input.addEventListener('change', () => {
      this.clearRadioButtonError(input);
    });
  }

  clearRadioButtonError(input) {
    const roleOptions = input.closest('.role-options');
    if (roleOptions) {
      const errorElement = roleOptions.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
  }

  setupStandardInputValidation(input) {
    if (this.configuration.validateOnBlur) {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    }
    
    if (this.configuration.validateOnInput) {
      this.setupInputValidationWithDebounce(input);
    }
  }

  setupInputValidationWithDebounce(input) {
    let debounceTimeout;
    
    input.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      this.clearInputErrorOnTyping(input);
      
      debounceTimeout = setTimeout(() => {
        this.validateField(input);
      }, CONFIG.UI.PHONE_FORMAT_DEBOUNCE);
    });
  }

  clearInputErrorOnTyping(input) {
    const errorElement = input.closest('.form-group')?.querySelector('.form-error');
    if (errorElement && input.value) {
      errorElement.textContent = '';
      input.classList.remove('error');
      input.classList.add('valid');
    }
  }

  setupPhoneNumberFormatting(input) {
    if (input.type === 'tel') {
      input.addEventListener('input', (event) => {
        this.formatPhoneNumber(event.target);
      });
    }
  }
  
  setupFormSubmission() {
    this.formElement.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      if (!this.isCurrentStepValid()) {
        return;
      }
      
      await this.handleFormSubmission();
    });
  }

  async handleFormSubmission() {
    const formData = this.collectFormData();
    const submitButton = this.getSubmitButton();
    const originalButtonText = submitButton.innerHTML;
    
    try {
      this.setSubmitButtonLoadingState(submitButton, true);
      await this.submitFormData(formData);
      this.configuration.onSuccess(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('Something went wrong. Please try again.', 'error');
      this.configuration.onError(error);
    } finally {
      this.setSubmitButtonLoadingState(submitButton, false, originalButtonText);
    }
  }

  collectFormData() {
    const formData = new FormData(this.formElement);
    return Object.fromEntries(formData.entries());
  }

  getSubmitButton() {
    return this.formElement.querySelector('button[type="submit"]');
  }

  setSubmitButtonLoadingState(submitButton, isLoading, originalText = null) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle('btn-loading', isLoading);
    
    if (!isLoading && originalText) {
      submitButton.innerHTML = originalText;
    }
  }
  
  async submitFormData(data) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BUSINESS_REGISTRATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Submission failed');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }
  
  validateField(field) {
    const fieldValue = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    const validationResult = this.performFieldValidation(field, fieldValue, fieldType, fieldName);
    this.setFieldState(field, validationResult.isValid, validationResult.errorMessage);
    
    return validationResult.isValid;
  }

  performFieldValidation(field, value, type, name) {
    if (this.isRequiredFieldEmpty(field, value)) {
      return { isValid: false, errorMessage: 'This field is required' };
    }
    
    if (this.isEmailFieldInvalid(type, value)) {
      return { isValid: false, errorMessage: 'Please enter a valid email address' };
    }
    
    if (this.isPhoneFieldInvalid(type, value)) {
      return { isValid: false, errorMessage: 'Please enter a valid phone number' };
    }
    
    if (this.isRadioGroupInvalid(type, name, field)) {
      return { isValid: false, errorMessage: 'Please select an option' };
    }
    
    return { isValid: true, errorMessage: '' };
  }

  isRequiredFieldEmpty(field, value) {
    return field.hasAttribute('required') && !value;
  }

  isEmailFieldInvalid(type, value) {
    if (type !== 'email' || !value) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value);
  }

  isPhoneFieldInvalid(type, value) {
    if (type !== 'tel' || !value) return false;
    
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return !phoneRegex.test(value);
  }

  isRadioGroupInvalid(type, name, field) {
    if (type !== 'radio' || !field.hasAttribute('required')) return false;
    
    const radioGroup = this.formElement.querySelectorAll(`input[name="${name}"]`);
    return !Array.from(radioGroup).some(radio => radio.checked);
  }
  
  setFieldState(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group') || field.closest('.role-options');
    const errorDiv = formGroup?.querySelector('.form-error');
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
      if (errorDiv) {
        errorDiv.textContent = '';
      }
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
      if (errorDiv) {
        errorDiv.textContent = errorMessage;
      }
      
      // Announce error to screen readers
      if (errorDiv) {
        errorDiv.setAttribute('role', 'alert');
      }
    }
  }
  
  isCurrentStepValid() {
    const currentStepElement = this.getCurrentStepElement();
    if (!currentStepElement) return true;
    
    if (this.isFirstStep()) {
      return this.validateFirstStep(currentStepElement);
    }
    
    return this.validateOtherSteps(currentStepElement);
  }

  getCurrentStepElement() {
    return this.formElement.querySelector(`.form-step[data-step="${this.currentStepNumber}"]`);
  }

  isFirstStep() {
    return this.currentStepNumber === 1;
  }

  validateFirstStep(stepElement) {
    const radioGroup = stepElement.querySelectorAll('input[type="radio"][name="inquiry_type"]');
    const isRadioSelected = Array.from(radioGroup).some(radio => radio.checked);

    if (!isRadioSelected) {
      this.showRadioButtonError(stepElement);
      return false;
    }

    this.clearRadioButtonError(stepElement);
    return true;
  }

  showRadioButtonError(stepElement) {
    const roleOptions = stepElement.querySelector('.role-options');
    let errorElement = roleOptions.querySelector('.form-error');

    if (!errorElement) {
      errorElement = this.createErrorElement();
      roleOptions.appendChild(errorElement);
    }

    errorElement.textContent = 'Please select an option to continue';
    errorElement.style.textAlign = 'center';
    errorElement.style.marginTop = 'var(--spacing-lg)';
  }

  createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.setAttribute('role', 'alert');
    return errorElement;
  }

  validateOtherSteps(stepElement) {
    const requiredFields = stepElement.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    let isStepValid = true;
    
    requiredFields.forEach(field => {
      if (field.hasAttribute('required') && !this.validateField(field)) {
        isStepValid = false;
      }
    });
    
    if (!isStepValid) {
      this.focusFirstInvalidField(stepElement);
    }
    
    return isStepValid;
  }

  focusFirstInvalidField(stepElement) {
    const firstInvalidField = stepElement.querySelector('.error');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }
  
  navigateToNextStep() {
    if (!this.isCurrentStepValid()) {
      return;
    }
    
    if (this.canNavigateToNextStep()) {
      this.hideCurrentStep();
      this.incrementStepNumber();
      this.showCurrentStep();
      this.updateProgressIndicator();
      this.scrollToFormTop();
      this.focusFirstInputInCurrentStep();
    }
  }
  
  navigateToPreviousStep() {
    if (this.canNavigateToPreviousStep()) {
      this.hideCurrentStep();
      this.decrementStepNumber();
      this.showCurrentStep();
      this.updateProgressIndicator();
      this.scrollToFormTop();
    }
  }

  canNavigateToNextStep() {
    return this.currentStepNumber < this.totalStepCount;
  }

  canNavigateToPreviousStep() {
    return this.currentStepNumber > 1;
  }

  hideCurrentStep() {
    const currentStepElement = this.getCurrentStepElement();
    currentStepElement.classList.remove('active');
  }

  showCurrentStep() {
    const currentStepElement = this.getCurrentStepElement();
    currentStepElement.classList.add('active');
  }

  incrementStepNumber() {
    this.currentStepNumber++;
  }

  decrementStepNumber() {
    this.currentStepNumber--;
  }

  scrollToFormTop() {
    this.formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  focusFirstInputInCurrentStep() {
    const currentStepElement = this.getCurrentStepElement();
    const firstInput = currentStepElement.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), CONFIG.UI.FOCUS_DELAY);
    }
  }
  
  updateProgressIndicator() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.form-progress');
    
    this.updateProgressBar(progressBar);
    this.updateProgressSteps(progressSteps);
  }

  updateProgressBar(progressBar) {
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', this.currentStepNumber);
    }
  }

  updateProgressSteps(progressSteps) {
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      this.updateProgressStep(step, stepNumber);
    });
  }

  updateProgressStep(step, stepNumber) {
    if (stepNumber < this.currentStepNumber) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNumber === this.currentStepNumber) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  }
  
  formatPhoneNumber(input) {
    const digitsOnly = this.extractDigitsFromInput(input.value);
    const limitedDigits = this.limitDigitsToTen(digitsOnly);
    const formattedNumber = this.formatPhoneNumberString(limitedDigits);
    
    input.value = formattedNumber;
  }

  extractDigitsFromInput(value) {
    return value.replace(/\D/g, '');
  }

  limitDigitsToTen(digits) {
    return digits.substring(0, 10);
  }

  formatPhoneNumberString(digits) {
    if (digits.length >= 6) {
      return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
    } else if (digits.length > 0) {
      return `(${digits}`;
    }
    return digits;
  }
  
  showNotification(message, type = 'info') {
    const notificationElement = this.createNotificationElement(message, type);
    this.displayNotification(notificationElement);
  }

  createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    return notification;
  }

  displayNotification(notification) {
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, CONFIG.UI.SCROLL_BEHAVIOR_DELAY);
    
    setTimeout(() => {
      this.removeNotification(notification);
    }, CONFIG.UI.NOTIFICATION_DISPLAY_DURATION);
  }

  removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, CONFIG.UI.NOTIFICATION_FADE_DURATION);
  }
}
