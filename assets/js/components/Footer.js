/**
 * Footer Component
 * Provides consistent footer across all pages
 */

export default class Footer {
  constructor(selector = '#main-footer') {
    this.footer = document.querySelector(selector);
    if (this.footer) {
      this.init();
    }
  }
  
  init() {
    // Any footer-specific initialization can go here
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Add any footer-specific event listeners here
  }
  
  // Static method to get consistent footer HTML
  static getFooterHTML() {
    return `
      <footer id="main-footer" class="footer">
        <div class="footer-container">
          <div class="footer-grid">
            <div>
              <div class="footer-brand">BA Integrate</div>
              <p class="footer-description">
                Business-Agent Integration Standard (BAIS) platform for hotels, restaurants, and e-commerce.
              </p>
            </div>
            
            <div>
              <h4 class="footer-section-title">Platform</h4>
              <ul class="footer-links">
                <li><a href="/pages/platform.html">Features</a></li>
                <li><a href="/pages/security.html">Security</a></li>
                <li><a href="/pages/contact.html">Contact</a></li>
                <li><a href="/pages/integrations.html">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="footer-section-title">Resources</h4>
              <ul class="footer-links">
                <li><a href="/pages/guides.html">Guides</a></li>
                <li><a href="/pages/api-reference.html">API Reference</a></li>
                <li><a href="/pages/support.html">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="footer-section-title">Company</h4>
              <ul class="footer-links">
                <li><a href="/pages/about.html">About</a></li>
                <li><a href="/pages/careers.html">Careers</a></li>
                <li><a href="/pages/blog.html">Blog</a></li>
                <li><a href="/pages/contact.html">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-copyright">
              &copy; 2025 BA Integrate. All rights reserved.
            </div>
            <div class="footer-legal">
              <a href="/pages/privacy.html">Privacy Policy</a>
              <a href="/pages/terms.html">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
