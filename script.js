document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Toggle ──
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  function setThemeIcons(theme) {
    if (theme === 'dark') {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  setThemeIcons(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcons(next);
  });

  // ── Mobile Menu ──
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-active');
    });
  });

  // ── Sticky Navbar ──
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Scroll Fade-in Animations ──
  const faders = document.querySelectorAll('.fade-in-section');
  const appearOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  // ── Show More / Show Less Experience Cards ──
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
          // Init carousels in newly visible cards
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

  // ── Contact Form → Google Apps Script ──
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

      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ name: senderName, email: senderEmail, message: senderMsg })
        });
      } catch (_) { /* no-cors fetch always throws on redirect - data still sent */ }

      // Show confirmation modal
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

  // ── Back to Top ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Image Carousel ──
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
    // Only init carousels that are currently visible
    const parentCard = carousel.closest('.exp-hidden');
    if (!parentCard) initCarousel(carousel);
  });

  // ── Active Nav Link Highlight on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

});
