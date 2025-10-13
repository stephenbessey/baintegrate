/**
 * Contact Form Component
 * Handles form validation and submission
 */

import CONFIG from '../core/config.js';
import { isValidEmail, sanitizeInput } from '../core/utils.js';

class ContactForm {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.warn(`Form not found: ${formSelector}`);
      return;
    }
    
    this.options = {
      apiEndpoint: options.apiEndpoint || `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CONTACT}`,
      onSuccess: options.onSuccess || this.handleSuccess.bind(this),
      onError: options.onError || this.handleError.bind(this),
      validateOnBlur: options.validateOnBlur !== false,
      ...options
    };
    
    this.fields = {};
    this.initialize();
  }
  
  initialize() {
    this.collectFields();
    this.setupValidation();
    this.setupSubmission();
  }
  
  collectFields() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      this.fields[input.name] = input;
    });
  }
  
  setupValidation() {
    if (!this.options.validateOnBlur) return;
    
    Object.values(this.fields).forEach(field => {
      field.addEventListener('blur', () => {
        this.validateField(field);
      });
      
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          this.validateField(field);
        }
      });
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldType = field.type;
    
    // Clear previous errors
    this.clearFieldError(field);
    
    // Required validation
    if (isRequired && !value) {
      this.showFieldError(field, 'This field is required');
      return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !isRequired) {
      return true;
    }
    
    // Email validation
    if (fieldType === 'email' && !isValidEmail(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    
    // Min length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      this.showFieldError(field, `Minimum ${minLength} characters required`);
      return false;
    }
    
    // Max length validation
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
      this.showFieldError(field, `Maximum ${maxLength} characters allowed`);
      return false;
    }
    
    return true;
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
  
  validateForm() {
    let isValid = true;
    
    Object.values(this.fields).forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  setupSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm()) {
        this.showMessage('Please fix the errors above', 'error');
        return;
      }
      
      await this.submitForm();
    });
  }
  
  async submitForm() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    
    try {
      // Disable submit button
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('btn-loading');
      }
      
      // Collect and sanitize form data
      const formData = new FormData(this.form);
      const data = {};
      
      for (const [key, value] of formData.entries()) {
        data[key] = sanitizeInput(value);
      }
      
      // Submit to API
      const response = await fetch(this.options.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
      
      const result = await response.json();
      this.options.onSuccess(result);
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.options.onError(error);
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        if (originalText) {
          submitButton.textContent = originalText;
        }
      }
    }
  }
  
  handleSuccess(result) {
    this.form.reset();
    this.showMessage(
      'Thank you! We will contact you within 24 hours.',
      'success'
    );
    
    // Clear any error states
    Object.values(this.fields).forEach(field => {
      this.clearFieldError(field);
    });
  }
  
  handleError(error) {
    this.showMessage(
      error.message || 'An error occurred. Please try again later.',
      'error'
    );
  }
  
  showMessage(text, type = 'info') {
    // Remove existing message
    const existingMessage = this.form.parentElement.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = text;
    
    this.form.parentElement.insertBefore(messageElement, this.form);
    
    // Auto-remove after duration
    setTimeout(() => {
      messageElement.remove();
    }, CONFIG.UI.TOAST_DURATION);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Public method to reset form
  reset() {
    this.form.reset();
    Object.values(this.fields).forEach(field => {
      this.clearFieldError(field);
    });
  }
  
  // Public method to set field values
  setValues(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.fields[key]) {
        this.fields[key].value = value;
      }
    });
  }
  
  // Public method to get form data
  getData() {
    const data = {};
    Object.entries(this.fields).forEach(([key, field]) => {
      data[key] = field.value;
    });
    return data;
  }
}

export default ContactForm;
