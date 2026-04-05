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

  // ── Resume Dropdown Toggles ──
  function setupResumeDropdown(toggleId, dropdownId) {
    const btn = document.getElementById(toggleId);
    const dropdown = btn ? btn.closest('.resume-dropdown') : null;
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      // Close all open dropdowns first
      document.querySelectorAll('.resume-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupResumeDropdown('hero-resume-btn', 'hero-resume-menu');
  setupResumeDropdown('contact-resume-btn', 'contact-resume-menu');

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.resume-dropdown.open').forEach(d => {
      d.classList.remove('open');
      const btn = d.querySelector('.resume-dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Prevent dropdown menu clicks from closing
  document.querySelectorAll('.resume-dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  // ── Show More / Show Less Experience Cards ──
  // We toggle the .exp-hidden class (CSS uses !important so inline style won't override)
  const showMoreBtn = document.getElementById('exp-show-more-btn');
  const hiddenCards = document.querySelectorAll('.exp-hidden');
  let isExpanded = false;

  if (showMoreBtn && hiddenCards.length > 0) {
    showMoreBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      hiddenCards.forEach(card => {
        if (isExpanded) {
          card.classList.remove('exp-hidden');
          card.classList.add('exp-shown');
          // Init carousel for cards that just became visible
          const carousel = card.querySelector('.carousel');
          if (carousel && !carousel.dataset.carouselInit) {
            initCarousel(carousel);
            carousel.dataset.carouselInit = 'true';
          }
        } else {
          card.classList.add('exp-hidden');
          card.classList.remove('exp-shown');
        }
      });
      showMoreBtn.classList.toggle('expanded', isExpanded);
      showMoreBtn.innerHTML = isExpanded
        ? 'Show Less <span class="show-more-arrow">↓</span>'
        : 'Show More <span class="show-more-arrow">↓</span>';
    });
  }

  // Contact Form → Google Apps Script → Google Sheet
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNTN-eRoDrc60uC62GMzaAMZ7Eb7CrLs3cPPlI1qEinPIjR0_BS2G0mdKISXO3AHr9/exec';
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const senderName  = document.getElementById('name').value.trim();
      const senderEmail = document.getElementById('email').value.trim();
      const senderMsg   = document.getElementById('message').value.trim();

      // Send to Apps Script as URL-encoded parameters (e.parameter in Apps Script)
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ name: senderName, email: senderEmail, message: senderMsg })
        });
      } catch (_) { /* no-cors fetch always throws on redirect — data still sent */ }

      // Show personalised confirmation modal
      document.getElementById('modal-name').textContent  = senderName  || 'there';
      document.getElementById('modal-email').textContent = senderEmail;
      contactForm.reset();
      successModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    function closeModal() {
      successModal.style.display = 'none';
      document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => { if (e.target === successModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && successModal.style.display === 'flex') closeModal(); });
  }

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Image Carousel Automation (named so hidden cards can be initialised on demand)
  function initCarousel(carousel) {
    const images = carousel.querySelectorAll('img');
    if (images.length <= 1) return;
    images.forEach(img => img.style.opacity = '0');
    images[0].style.opacity = '1';
    let currentIndex = 0;
    setInterval(() => {
      images[currentIndex].style.opacity = '0';
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].style.opacity = '1';
    }, 4000);
  }

  document.querySelectorAll('.carousel').forEach(carousel => {
    // Only init carousels that are currently visible (not inside hidden exp-hidden cards)
    const parentCard = carousel.closest('.exp-hidden');
    if (!parentCard) initCarousel(carousel);
  });

});
