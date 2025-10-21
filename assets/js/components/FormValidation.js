/**
 * FormValidation Component
 * Multi-step form with real-time validation and accessibility
 */

export default class FormValidation {
  constructor(selector, options = {}) {
    this.form = document.querySelector(selector);
    if (!this.form) return;
    
    this.options = {
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      validateOnBlur: options.validateOnBlur !== false,
      validateOnInput: options.validateOnInput !== false
    };
    
    this.currentStep = 1;
    this.totalSteps = this.form.querySelectorAll('.form-step:not([data-step="success"])').length;
    this.formData = {};
    
    this.init();
  }
  
  init() {
    this.setupStepNavigation();
    this.setupValidation();
    this.setupFormSubmission();
    this.updateProgress();
  }
  
  setupStepNavigation() {
    // Next step buttons
    const nextButtons = this.form.querySelectorAll('[data-next-step]');
    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });
    
    // Previous step buttons
    const prevButtons = this.form.querySelectorAll('[data-prev-step]');
    prevButtons.forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
  }
  
  setupValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Special handling for radio buttons
      if (input.type === 'radio') {
        input.addEventListener('change', () => {
          // Clear error message when a radio is selected
          const roleOptions = input.closest('.role-options');
          if (roleOptions) {
            const errorDiv = roleOptions.querySelector('.form-error');
            if (errorDiv) {
              errorDiv.textContent = '';
            }
          }
        });
        return;
      }
      
      // Validate on blur
      if (this.options.validateOnBlur) {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      }
      
      // Validate on input (with debounce)
      if (this.options.validateOnInput) {
        let timeout;
        input.addEventListener('input', () => {
          clearTimeout(timeout);
          
          // Clear error immediately if user is typing
          const errorDiv = input.closest('.form-group')?.querySelector('.form-error');
          if (errorDiv && input.value) {
            errorDiv.textContent = '';
            input.classList.remove('error');
            input.classList.add('valid');
          }
          
          // Validate after 500ms of no typing
          timeout = setTimeout(() => {
            this.validateField(input);
          }, 500);
        });
      }
      
      // Auto-format phone numbers
      if (input.type === 'tel') {
        input.addEventListener('input', (e) => {
          this.formatPhoneNumber(e.target);
        });
      }
    });
  }
  
  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateCurrentStep()) {
        return;
      }
      
      // Collect all form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Show loading state
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      
      try {
        // Simulate API call
        await this.submitForm(data);
        
        // Call success callback
        this.options.onSuccess(data);
      } catch (error) {
        console.error('Form submission error:', error);
        this.showNotification('Something went wrong. Please try again.', 'error');
        this.options.onError(error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerHTML = originalText;
      }
    });
  }
  
  async submitForm(data) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', data);
        resolve(data);
      }, 1000);
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Radio button validation
    else if (type === 'radio' && field.hasAttribute('required')) {
      const radioGroup = this.form.querySelectorAll(`input[name="${name}"]`);
      const isChecked = Array.from(radioGroup).some(radio => radio.checked);
      if (!isChecked) {
        isValid = false;
        errorMessage = 'Please select an option';
      }
    }
    
    this.setFieldState(field, isValid, errorMessage);
    return isValid;
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
  
  validateCurrentStep() {
    const currentStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    if (!currentStepEl) return true;
    
    // Special handling for step 1 (role selection with radio buttons)
    if (this.currentStep === 1) {
      const radioGroup = currentStepEl.querySelectorAll('input[type="radio"][name="business_type"]');
      const isChecked = Array.from(radioGroup).some(radio => radio.checked);
      
      if (!isChecked) {
        // Show error in the role-options container
        const roleOptions = currentStepEl.querySelector('.role-options');
        let errorDiv = roleOptions.querySelector('.form-error');
        
        if (!errorDiv) {
          errorDiv = document.createElement('div');
          errorDiv.className = 'form-error';
          errorDiv.setAttribute('role', 'alert');
          roleOptions.appendChild(errorDiv);
        }
        
        errorDiv.textContent = 'Please select a business type to continue';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = 'var(--spacing-lg)';
        
        return false;
      } else {
        // Clear any error messages
        const roleOptions = currentStepEl.querySelector('.role-options');
        const errorDiv = roleOptions.querySelector('.form-error');
        if (errorDiv) {
          errorDiv.textContent = '';
        }
        return true;
      }
    }
    
    // For other steps, validate all fields
    const fields = currentStepEl.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    let isStepValid = true;
    
    fields.forEach(field => {
      if (field.hasAttribute('required')) {
        if (!this.validateField(field)) {
          isStepValid = false;
        }
      }
    });
    
    if (!isStepValid) {
      // Focus first invalid field
      const firstInvalid = currentStepEl.querySelector('.error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
    
    return isStepValid;
  }
  
  nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }
    
    if (this.currentStep < this.totalSteps) {
      // Hide current step
      const currentStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      currentStepEl.classList.remove('active');
      
      // Show next step
      this.currentStep++;
      const nextStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      nextStepEl.classList.add('active');
      
      // Update progress
      this.updateProgress();
      
      // Scroll to top of form
      this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Focus first input in next step
      const firstInput = nextStepEl.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
      }
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      // Hide current step
      const currentStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      currentStepEl.classList.remove('active');
      
      // Show previous step
      this.currentStep--;
      const prevStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
      prevStepEl.classList.add('active');
      
      // Update progress
      this.updateProgress();
      
      // Scroll to top of form
      this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  updateProgress() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.form-progress');
    
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', this.currentStep);
    }
    
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }
  
  formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    value = value.substring(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (value.length >= 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length >= 3) {
      value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    input.value = value;
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}
