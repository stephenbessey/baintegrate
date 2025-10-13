/**
 * Navigation Component
 * Handles navigation interactions and scroll behavior
 */

import { throttle } from '../core/utils.js';

class Navigation {
  constructor(selector) {
    this.nav = document.querySelector(selector);
    if (!this.nav) {
      console.warn(`Navigation element not found: ${selector}`);
      return;
    }
    
    this.navToggle = this.nav.querySelector('.nav-toggle');
    this.navLinks = this.nav.querySelector('.nav-links');
    this.scrollThreshold = 50;
    
    this.initialize();
  }
  
  initialize() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupActiveLink();
    this.setupSmoothScroll();
  }
  
  setupScrollBehavior() {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > this.scrollThreshold) {
        this.nav.classList.add('nav-scrolled');
      } else {
        this.nav.classList.remove('nav-scrolled');
      }
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }
  
  setupMobileMenu() {
    if (!this.navToggle || !this.navLinks) return;
    
    this.navToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking on a link
    const links = this.navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    this.navToggle.classList.toggle('active');
    this.navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (this.navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  closeMobileMenu() {
    this.navToggle?.classList.remove('active');
    this.navLinks?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  setupActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.nav.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === currentPath || 
          (currentPath === '/' && href === '/index.html') ||
          (href !== '/' && currentPath.includes(href))) {
        link.classList.add('active');
      }
    });
  }
  
  setupSmoothScroll() {
    const links = this.nav.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const navHeight = this.nav.offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          this.closeMobileMenu();
        }
      });
    });
  }
  
  // Public method to highlight a specific link
  setActiveLink(href) {
    const links = this.nav.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export default Navigation;
