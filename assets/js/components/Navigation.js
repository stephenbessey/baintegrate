class Navigation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.initializeEventListeners();
  }
  
  initializeEventListeners() {
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    const scrollPosition = window.scrollY;
    const threshold = 50;
    
    if (scrollPosition > threshold) {
      this.container.classList.add('nav-scrolled');
    } else {
      this.container.classList.remove('nav-scrolled');
    }
  }
  
  setActiveLink(currentPath) {
    const links = this.container.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
}

export default Navigation;
