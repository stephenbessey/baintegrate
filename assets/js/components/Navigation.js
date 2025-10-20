/**
 * Navigation Component
 * Handles navigation functionality and consistency across all pages
 */

export default class Navigation {
  constructor(selector = '#main-nav') {
    this.nav = document.querySelector(selector);
    this.navToggle = this.nav?.querySelector('.nav-toggle');
    this.navLinks = this.nav?.querySelector('.nav-links');
    this.navActions = this.nav?.querySelector('.nav-actions');
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
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = this.navLinks.classList.contains('active');
        
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        this.nav.classList.toggle('mobile-open');
        
        if (!isActive) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
      
      this.navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
          this.closeMenu();
        }
      });
      
      document.addEventListener('click', (e) => {
        if (this.nav.classList.contains('mobile-open') && 
            !this.nav.contains(e.target)) {
          this.closeMenu();
        }
      });
    }
  }

  closeMenu() {
    this.navLinks?.classList.remove('active');
    this.navToggle?.classList.remove('active');
    this.nav?.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }
  
  setupResponsive() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }
  
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
            <li><a href="/pages/platform.html" class="nav-link">Platform</a></li>
            <li><a href="/pages/solutions.html" class="nav-link">Solutions</a></li>
            <li><a href="/pages/contact.html" class="nav-link">Contact</a></li>
          </ul>
          
          <div class="nav-actions">
            <a href="/pages/login.html" class="btn btn-secondary nav-cta">Customer Login</a>
            <a href="/pages/contact.html" class="btn btn-primary nav-cta">Get Started</a>
          </div>
        </div>
      </nav>
    `;
    return baseNav;
  }
}
