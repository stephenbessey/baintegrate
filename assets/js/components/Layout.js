/**
 * Layout Component
 * Provides consistent layout structure across all pages
 */

import Navigation from './Navigation.js';
import Footer from './Footer.js';

export default class Layout {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isLoggedIn = this.checkAuthentication();
  }
  
  getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('/pages/')) {
      const page = path.split('/pages/')[1].replace('.html', '');
      return page;
    }
    return 'home';
  }
  
  checkAuthentication() {
    return !!(localStorage.getItem('bais_auth_token') || sessionStorage.getItem('bais_auth_token'));
  }
  
  // Static method to get complete page structure
  static getPageStructure(pageType = 'public', currentPage = 'home') {
    const isLoggedIn = !!(localStorage.getItem('bais_auth_token') || sessionStorage.getItem('bais_auth_token'));
    
    return {
      navigation: this.getNavigationHTML(isLoggedIn, currentPage),
      footer: Footer.getFooterHTML()
    };
  }
  
  static getNavigationHTML(isLoggedIn, currentPage) {
    if (isLoggedIn) {
      return `
        <nav id="main-nav" class="navigation">
          <div class="nav-container">
            <div class="nav-logo">
              <a href="/">BA Integrate</a>
            </div>
            
            <button class="nav-toggle" aria-label="Toggle navigation">
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
            </button>
            
            <ul class="nav-links">
              <li><a href="/pages/dashboard.html" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
              <li><a href="/pages/platform.html" class="nav-link ${currentPage === 'platform' ? 'active' : ''}">Platform</a></li>
              <li><a href="/pages/solutions.html" class="nav-link ${currentPage === 'solutions' ? 'active' : ''}">Solutions</a></li>
            </ul>
            
            <div class="nav-actions">
              <div class="user-menu">
                <span class="user-name" id="user-name">Customer</span>
                <button class="btn btn-secondary" id="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </nav>
      `;
    } else {
      return `
        <nav id="main-nav" class="navigation">
          <div class="nav-container">
            <div class="nav-logo">
              <a href="/">BA Integrate</a>
            </div>
            
            <button class="nav-toggle" aria-label="Toggle navigation">
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
            </button>
            
            <ul class="nav-links">
              <li><a href="/pages/platform.html" class="nav-link ${currentPage === 'platform' ? 'active' : ''}">Platform</a></li>
              <li><a href="/pages/solutions.html" class="nav-link ${currentPage === 'solutions' ? 'active' : ''}">Solutions</a></li>
              <li><a href="/pages/contact.html" class="nav-link ${currentPage === 'contact' ? 'active' : ''}">Contact</a></li>
            </ul>
            
            <div class="nav-actions">
              <a href="/pages/login.html" class="btn btn-secondary nav-cta">Customer Login</a>
              <a href="/pages/contact.html" class="btn btn-primary nav-cta">Get Started</a>
            </div>
          </div>
        </nav>
      `;
    }
  }
  
  // Method to update navigation across all pages
  static updateNavigation() {
    const currentPage = this.getCurrentPage();
    const isLoggedIn = this.checkAuthentication();
    
    // Update navigation in current page
    const navElement = document.querySelector('#main-nav');
    if (navElement) {
      navElement.outerHTML = this.getNavigationHTML(isLoggedIn, currentPage);
    }
    
    // Initialize new navigation
    new Navigation('#main-nav');
  }
  
  static getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('/pages/')) {
      const page = path.split('/pages/')[1].replace('.html', '');
      return page;
    }
    return 'home';
  }
  
  static checkAuthentication() {
    return !!(localStorage.getItem('bais_auth_token') || sessionStorage.getItem('bais_auth_token'));
  }
}
