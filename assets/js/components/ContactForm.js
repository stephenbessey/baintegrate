/**
 * Contact Form Component
 * Handles form validation and submission following Clean Code principles
 */

import CONFIG from '../core/config.js';
import { isValidEmail, sanitizeInput } from '../core/utils.js';
import { FieldValidator, ValidationResult } from '../core/validation.js';
import { globalErrorHandler } from '../core/errorHandler.js';

class ContactForm {
  constructor(formSelector, options = {}) {
    this.formElement = document.querySelector(formSelector);
    if (!this.formElement) {
      console.warn(`Form not found: ${formSelector}`);
      return;
    }
    
    this.configuration = this.createConfiguration(options);
    this.formFields = {};
    this.initialize();
  }
  
  createConfiguration(options) {
    return {
      apiEndpoint: options.apiEndpoint || `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CONTACT}`,
      onSuccess: options.onSuccess || this.handleSuccess.bind(this),
      onError: options.onError || this.handleError.bind(this),
      validateOnBlur: options.validateOnBlur !== false,
      ...options
    };
  }

  initialize() {
    this.collectFormFields();
    this.setupFieldValidation();
    this.setupFormSubmission();
  }
  
  collectFormFields() {
    const inputElements = this.formElement.querySelectorAll('input, textarea, select');
    inputElements.forEach(input => {
      this.formFields[input.name] = input;
    });
  }
  
  setupFieldValidation() {
    if (!this.configuration.validateOnBlur) return;
    
    Object.values(this.formFields).forEach(field => {
      this.attachValidationListeners(field);
    });
  }

  attachValidationListeners(field) {
    field.addEventListener('blur', () => {
      this.validateField(field);
    });
    
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        this.validateField(field);
      }
    });
  }
  
  validateField(field) {
    this.clearFieldError(field);
    
    const validator = new FieldValidator(field);
    const result = validator.validate();
    
    if (!result.isValid) {
      this.showFieldError(field, result.errorMessage);
    }
    
    return result.isValid;
  }

  
  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }
  
  clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
  
  isFormValid() {
    return Object.values(this.formFields).every(field => this.validateField(field));
  }
  
  setupFormSubmission() {
    this.formElement.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      if (!this.isFormValid()) {
        this.showMessage('Please fix the errors above', 'error');
        return;
      }
      
      await this.submitForm();
    });
  }
  
  async submitForm() {
    const submitButton = this.getSubmitButton();
    const originalButtonText = submitButton?.textContent;
    
    try {
      this.setSubmitButtonLoadingState(submitButton, true);
      
      const formData = this.collectAndSanitizeFormData();
      const response = await this.sendFormDataToApi(formData);
      const result = await response.json();
      
      this.configuration.onSuccess(result);
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.configuration.onError(error);
    } finally {
      this.setSubmitButtonLoadingState(submitButton, false, originalButtonText);
    }
  }

  getSubmitButton() {
    return this.formElement.querySelector('button[type="submit"]');
  }

  setSubmitButtonLoadingState(submitButton, isLoading, originalText = null) {
    if (!submitButton) return;
    
    submitButton.disabled = isLoading;
    submitButton.classList.toggle('btn-loading', isLoading);
    
    if (!isLoading && originalText) {
      submitButton.textContent = originalText;
    }
  }

  collectAndSanitizeFormData() {
    const formData = new FormData(this.formElement);
    const sanitizedData = {};
    
    for (const [key, value] of formData.entries()) {
      sanitizedData[key] = sanitizeInput(value);
    }
    
    return sanitizedData;
  }

  async sendFormDataToApi(data) {
    const response = await fetch(this.configuration.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'Submission failed');
    }
    
    return response;
  }
  
  handleSuccess(result) {
    this.resetForm();
    this.showMessage(
      'Thank you! We will contact you within 24 hours.',
      'success'
    );
    this.clearAllFieldErrors();
  }
  
  handleError(error) {
    this.showMessage(
      error.message || 'An error occurred. Please try again later.',
      'error'
    );
  }

  resetForm() {
    this.formElement.reset();
  }

  clearAllFieldErrors() {
    Object.values(this.formFields).forEach(field => {
      this.clearFieldError(field);
    });
  }
  
  showMessage(text, type = 'info') {
    this.removeExistingMessage();
    const messageElement = this.createMessageElement(text, type);
    this.displayMessage(messageElement);
  }

  removeExistingMessage() {
    const existingMessage = this.formElement.parentElement.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  createMessageElement(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = text;
    return messageElement;
  }

  displayMessage(messageElement) {
    this.formElement.parentElement.insertBefore(messageElement, this.formElement);
    
    setTimeout(() => {
      messageElement.remove();
    }, CONFIG.UI.TOAST_DURATION);
    
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Public method to reset form
  reset() {
    this.resetForm();
    this.clearAllFieldErrors();
  }
  
  // Public method to set field values
  setValues(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.formFields[key]) {
        this.formFields[key].value = value;
      }
    });
  }
  
  // Public method to get form data
  getData() {
    const data = {};
    Object.entries(this.formFields).forEach(([key, field]) => {
      data[key] = field.value;
    });
    return data;
  }
}

export default ContactForm;
