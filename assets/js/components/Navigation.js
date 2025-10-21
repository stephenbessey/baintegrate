/**
 * Navigation Component
 * Enhanced with accessibility, dropdown support, and improved UX
 */

export default class Navigation {
  constructor(selector = '#main-nav') {
    this.nav = document.querySelector(selector);
    if (!this.nav) return;
    
    this.navToggle = this.nav.querySelector('.nav-toggle');
    this.navLinks = this.nav.querySelector('.nav-links');
    this.navActions = this.nav.querySelector('.nav-actions');
    this.currentPage = this.getCurrentPage();
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    this.setupToggle();
    this.setActiveLink();
    this.setupDropdowns();
    this.setupScrollBehavior();
    this.setupKeyboardNav();
    this.setupClickOutside();
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
    const links = this.nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      const href = link.getAttribute('href');
      
      if (href === '/' && this.currentPage === 'home') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (href && href.includes(this.currentPage)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }
  
  setupToggle() {
    if (!this.navToggle || !this.navLinks) return;
    
    this.navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });
    
    // Close menu when clicking on a link
    this.navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) {
          this.closeMenu();
        }
      });
    });
  }
  
  toggleMenu() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }
  
  openMenu() {
    this.isOpen = true;
    this.navLinks.classList.add('active');
    this.navToggle.classList.add('active');
    this.nav.classList.add('mobile-open');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden';
    
    // Focus first link for accessibility
    const firstLink = this.navLinks.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  closeMenu() {
    this.isOpen = false;
    this.navLinks.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.nav.classList.remove('mobile-open');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Close any open dropdowns
    this.closeAllDropdowns();
  }
  
  setupDropdowns() {
    const dropdownToggles = this.nav.querySelectorAll('.nav-dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      const dropdown = toggle.closest('.nav-dropdown');
      const menu = dropdown.querySelector('.nav-dropdown-menu');
      
      if (!menu) return;
      
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        // Close other dropdowns
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        if (!isExpanded) {
          toggle.setAttribute('aria-expanded', 'true');
          dropdown.classList.add('active');
          menu.style.display = 'block';
          
          // Focus first menu item
          const firstMenuItem = menu.querySelector('a');
          if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
          }
        }
      });
      
      // Close dropdown when clicking menu item
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeAllDropdowns();
        });
      });
    });
  }
  
  closeAllDropdowns() {
    const dropdownToggles = this.nav.querySelectorAll('.nav-dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      const dropdown = toggle.closest('.nav-dropdown');
      const menu = dropdown.querySelector('.nav-dropdown-menu');
      
      toggle.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('active');
      if (menu) {
        menu.style.display = 'none';
      }
    });
  }
  
  setupClickOutside() {
    document.addEventListener('click', (e) => {
      // Close mobile menu if clicking outside
      if (this.isOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
      
      // Close dropdowns if clicking outside
      if (!e.target.closest('.nav-dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }
  
  setupScrollBehavior() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow when scrolled
      if (currentScroll > 10) {
        this.nav.classList.add('nav-scrolled');
      } else {
        this.nav.classList.remove('nav-scrolled');
      }
      
      // Hide nav on scroll down, show on scroll up (desktop only)
      if (window.innerWidth > 768) {
        if (currentScroll > lastScroll && currentScroll > 100) {
          this.nav.style.transform = 'translateY(-100%)';
        } else {
          this.nav.style.transform = 'translateY(0)';
        }
      }
      
      lastScroll = currentScroll;
    });
  }
  
  setupKeyboardNav() {
    // ESC to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) {
          this.closeMenu();
          this.navToggle.focus();
        }
        this.closeAllDropdowns();
      }
    });
    
    // Arrow key navigation in dropdowns
    this.nav.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
      const menuItems = Array.from(menu.querySelectorAll('a'));
      
      menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextItem = menuItems[index + 1] || menuItems[0];
            nextItem.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
            prevItem.focus();
          }
        });
      });
    });
  }
  
  // Static method to update navigation dynamically
  static updateNavigation(isLoggedIn = false) {
    const nav = document.querySelector('#main-nav');
    if (!nav) return;
    
    const navActions = nav.querySelector('.nav-actions');
    if (!navActions) return;
    
    if (isLoggedIn) {
      navActions.innerHTML = `
        <a href="/pages/business-dashboard.html" class="nav-utility-link">Dashboard</a>
        <button id="logout-btn" class="btn btn-secondary btn-small">Sign Out</button>
      `;
      
      // Setup logout
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('bais_auth_token');
          sessionStorage.removeItem('bais_auth_token');
          localStorage.removeItem('bais_user_email');
          sessionStorage.removeItem('bais_user_email');
          window.location.href = '/';
        });
      }
    } else {
      navActions.innerHTML = `
        <a href="/pages/login.html" class="nav-utility-link">Sign In</a>
        <a href="/pages/contact.html" class="btn btn-primary btn-cta">Get Started</a>
      `;
    }
  }
  
  // Check auth status on load
  static checkAuthAndUpdate() {
    const token = localStorage.getItem('bais_auth_token') || 
                  sessionStorage.getItem('bais_auth_token');
    
    if (token) {
      Navigation.updateNavigation(true);
    }
  }
}

// Auto-check auth on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    Navigation.checkAuthAndUpdate();
  });
}
