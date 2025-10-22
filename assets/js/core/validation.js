/**
 * Validation Utilities
 * Reusable validation functions following Clean Code principles
 */

import CONFIG from './config.js';

/**
 * Field validation result object
 */
export class ValidationResult {
  constructor(isValid, errorMessage = '') {
    this.isValid = isValid;
    this.errorMessage = errorMessage;
  }

  static success() {
    return new ValidationResult(true);
  }

  static error(message) {
    return new ValidationResult(false, message);
  }
}

/**
 * Email validation utility
 */
export const emailValidator = {
  isValid: (email) => {
    if (!email) return false;
    return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
  },

  getErrorMessage: () => 'Please enter a valid email address'
};

/**
 * Phone validation utility
 */
export const phoneValidator = {
  isValid: (phone) => {
    if (!phone) return false;
    return CONFIG.VALIDATION.PHONE_REGEX.test(phone);
  },

  getErrorMessage: () => 'Please enter a valid phone number'
};

/**
 * Required field validation utility
 */
export const requiredValidator = {
  isValid: (value, isRequired) => {
    return !isRequired || (value && value.trim().length > 0);
  },

  getErrorMessage: () => 'This field is required'
};

/**
 * Length validation utility
 */
export const lengthValidator = {
  isValid: (value, minLength, maxLength) => {
    if (!value) return true; // Let required validator handle empty values
    
    const trimmedValue = value.trim();
    
    if (minLength && trimmedValue.length < minLength) return false;
    if (maxLength && trimmedValue.length > maxLength) return false;
    
    return true;
  },

  getErrorMessage: (minLength, maxLength) => {
    if (minLength && maxLength) {
      return `Must be between ${minLength} and ${maxLength} characters`;
    }
    if (minLength) {
      return `Minimum ${minLength} characters required`;
    }
    if (maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }
    return 'Invalid length';
  }
};

/**
 * Radio group validation utility
 */
export const radioGroupValidator = {
  isValid: (formElement, name) => {
    const radioGroup = formElement.querySelectorAll(`input[name="${name}"]`);
    return Array.from(radioGroup).some(radio => radio.checked);
  },

  getErrorMessage: () => 'Please select an option'
};

/**
 * Comprehensive field validator
 */
export class FieldValidator {
  constructor(field) {
    this.field = field;
    this.value = field.value.trim();
    this.type = field.type;
    this.name = field.name;
    this.isRequired = field.hasAttribute('required');
  }

  validate() {
    // Required validation first
    if (!requiredValidator.isValid(this.value, this.isRequired)) {
      return ValidationResult.error(requiredValidator.getErrorMessage());
    }

    // Skip further validation if field is empty and not required
    if (!this.value && !this.isRequired) {
      return ValidationResult.success();
    }

    // Type-specific validation
    const typeValidation = this.performTypeValidation();
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    // Length validation
    const lengthValidation = this.performLengthValidation();
    if (!lengthValidation.isValid) {
      return lengthValidation;
    }

    return ValidationResult.success();
  }

  performTypeValidation() {
    switch (this.type) {
      case 'email':
        return emailValidator.isValid(this.value) 
          ? ValidationResult.success()
          : ValidationResult.error(emailValidator.getErrorMessage());
      
      case 'tel':
        return phoneValidator.isValid(this.value)
          ? ValidationResult.success()
          : ValidationResult.error(phoneValidator.getErrorMessage());
      
      default:
        return ValidationResult.success();
    }
  }

  performLengthValidation() {
    const minLength = this.field.getAttribute('minlength');
    const maxLength = this.field.getAttribute('maxlength');
    
    const min = minLength ? parseInt(minLength) : null;
    const max = maxLength ? parseInt(maxLength) : null;
    
    if (!lengthValidator.isValid(this.value, min, max)) {
      return ValidationResult.error(lengthValidator.getErrorMessage(min, max));
    }
    
    return ValidationResult.success();
  }
}

/**
 * Form validation orchestrator
 */
export class FormValidator {
  constructor(formElement) {
    this.formElement = formElement;
  }

  validateField(field) {
    const validator = new FieldValidator(field);
    return validator.validate();
  }

  validateAllFields() {
    const fields = this.formElement.querySelectorAll('input, select, textarea');
    const results = [];
    
    fields.forEach(field => {
      const result = this.validateField(field);
      results.push({ field, result });
    });
    
    return results;
  }

  isFormValid() {
    const validationResults = this.validateAllFields();
    return validationResults.every(({ result }) => result.isValid);
  }

  getFirstInvalidField() {
    const validationResults = this.validateAllFields();
    const invalidResult = validationResults.find(({ result }) => !result.isValid);
    return invalidResult ? invalidResult.field : null;
  }
}
