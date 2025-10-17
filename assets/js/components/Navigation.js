/**
 * Navigation Component
 * Handles navigation functionality and consistency across all pages
 */

export default class Navigation {
  constructor(selector = '#main-nav') {
    this.nav = document.querySelector(selector);
    this.navToggle = this.nav?.querySelector('.nav-toggle');
    this.navLinks = this.nav?.querySelector('.nav-links');
    this.currentPage = this.getCurrentPage();
    
    if (this.nav) {
      this.init();
    }
  }
  
  init() {
    this.setupToggle();
    this.setActiveLink();
    this.setupResponsive();
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
  
  setActiveLink() {
    const links = this.nav?.querySelectorAll('.nav-link');
    links?.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === '/' && this.currentPage === 'home') {
        link.classList.add('active');
      } else if (href && href.includes(this.currentPage)) {
        link.classList.add('active');
      }
    });
  }
  
  setupToggle() {
    if (this.navToggle && this.navLinks) {
      this.navToggle.addEventListener('click', () => {
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        this.nav.classList.toggle('mobile-open');
      });
      
      // Close mobile menu when clicking on a link
      this.navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          this.navLinks.classList.remove('active');
          this.navToggle.classList.remove('active');
          this.nav.classList.remove('mobile-open');
        }
      });
    }
  }
  
  setupResponsive() {
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.navLinks?.classList.remove('active');
        this.navToggle?.classList.remove('active');
        this.nav?.classList.remove('mobile-open');
      }
    });
  }
  
  // Static method to get consistent navigation HTML
  static getNavigationHTML(isAuthenticated = false, userRole = 'public') {
  const baseNav = `
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
          ${this.getNavLinks(isAuthenticated, userRole)}
        </ul>
        
        ${this.getNavActions(isAuthenticated, userRole)}
      </div>
    </nav>
  `;
  return baseNav;
}

static getNavLinks(isAuthenticated, userRole) {
  if (isAuthenticated) {
    if (userRole === 'business') {
      return `
        <li><a href="/pages/business-dashboard.html" class="nav-link">Dashboard</a></li>
        <li><a href="/pages/platform.html" class="nav-link">Platform</a></li>
        <li><a href="/pages/support.html" class="nav-link">Support</a></li>
      `;
    } else if (userRole === 'platform_admin') {
      return `
        <li><a href="/pages/platform-dashboard.html" class="nav-link">Platform Dashboard</a></li>
        <li><a href="/pages/dashboard.html" class="nav-link">Customers</a></li>
        <li><a href="/pages/platform.html" class="nav-link">Platform</a></li>
      `;
    }
  }
  
  return `
    <li><a href="/pages/platform.html" class="nav-link">Platform</a></li>
    <li><a href="/pages/solutions.html" class="nav-link">Solutions</a></li>
    <li><a href="/pages/contact.html" class="nav-link">Contact</a></li>
  `;
}

static getNavActions(isAuthenticated, userRole) {
  if (isAuthenticated) {
    return `
      <div class="nav-actions">
        <div class="user-menu">
          <span class="user-name" id="user-name">User</span>
          <button class="btn btn-secondary" id="logout-btn">Logout</button>
        </div>
      </div>
    `;
  }
  
  return `
    <a href="/pages/contact.html" class="btn btn-primary nav-cta">Schedule Demo</a>
  `;
}
