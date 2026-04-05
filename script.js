document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '☀️';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '🌙';
    }
  });

  // Mobile Menu
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  // Sticky Navbar Blur and styling on scroll
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Scroll Animations (Intersection Observer)
  const faders = document.querySelectorAll('.fade-in-section');
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Typewriter Effect
  const typeText = document.querySelector('.typewriter-text');
  const words = ['Mechanical Engineer', 'Operations Strategist', 'Future MBA'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typeText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }
  
  if (typeText) {
    setTimeout(type, 1000);
  }

  // Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = card.classList.contains('featured') ? 'flex' : 'flex'; // maintain grid/flex structure
          if (window.innerWidth <= 900 && card.classList.contains('featured')) {
             card.style.flexDirection = 'column';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Contact Form → Google Forms with Confirmation Popup
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // stop native form navigation

      const senderName  = document.getElementById('name').value.trim();
      const senderEmail = document.getElementById('email').value.trim();

      // Send data to Google Forms via fetch (no-cors bypasses CORS restriction)
      // Google still records the response — we just can't read the reply
      try {
        await fetch(contactForm.action, {
          method: 'POST',
          mode: 'no-cors',
          body: new FormData(contactForm)
        });
      } catch (_) {
        // no-cors fetch may throw in some edge-cases — data is still sent
      }

      // Show personalised confirmation modal
      document.getElementById('modal-name').textContent  = senderName  || 'there';
      document.getElementById('modal-email').textContent = senderEmail;
      contactForm.reset();
      successModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    // Close modal helpers
    function closeModal() {
      successModal.style.display = 'none';
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && successModal.style.display === 'flex') closeModal();
    });
  }

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Image Carousel Automation
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('img');
    if (images.length <= 1) return;
    
    // Initialize
    images.forEach(img => img.style.opacity = '0');
    images[0].style.opacity = '1';
    
    let currentIndex = 0;
    setInterval(() => {
      images[currentIndex].style.opacity = '0';
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].style.opacity = '1';
    }, 4000); // 4 seconds per image
  });

});
