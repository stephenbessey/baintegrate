class ContactForm {
  constructor(formId, apiEndpoint) {
    this.form = document.getElementById(formId);
    this.apiEndpoint = apiEndpoint;
    this.initializeValidation();
    this.attachSubmitHandler();
  }
  
  initializeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
      this.showError(field, 'This field is required');
      return false;
    }
    
    if (field.type === 'email' && !this.isValidEmail(value)) {
      this.showError(field, 'Please enter a valid email');
      return false;
    }
    
    this.clearError(field);
    return true;
  }
  
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  showError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
    }
    field.classList.add('error');
  }
  
  clearError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = '';
    }
    field.classList.remove('error');
  }
  
  attachSubmitHandler() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm()) {
        return;
      }
      
      await this.submitForm();
    });
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  async submitForm() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        this.handleSuccess();
      } else {
        this.handleError('Submission failed. Please try again.');
      }
    } catch (error) {
      this.handleError('Network error. Please check your connection.');
    }
  }
  
  handleSuccess() {
    this.form.reset();
    this.showMessage('Thank you! We will contact you within 24 hours.', 'success');
  }
  
  handleError(message) {
    this.showMessage(message, 'error');
  }
  
  showMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = text;
    
    this.form.insertAdjacentElement('beforebegin', messageElement);
    
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

export default ContactForm;
