'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const html = document.documentElement;

  /* ─── FOOTER YEAR ─── */
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ─── THEME TOGGLE ─── */
  const themeToggle = document.querySelector('.theme-toggle');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ─── MOBILE MENU ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── NAVBAR SCROLL EFFECT ─── */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      navbar.classList.toggle('scrolled', currentScroll > 50);

      if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ─── BACK TO TOP ─── */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealElements = document.querySelectorAll(
    '.about-grid, .about-stats, .about-card, .career-scoreboard, .scoreboard-panel, .gallery-masonry, .gallery-item, .contact-form, .contact-info'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ─── STAT COUNTER ─── */
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const max = parseInt(target.getAttribute('data-count'), 10);
        animateCounter(target, max);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, max) {
    let current = 0;
    const duration = 1200;
    const step = Math.ceil(max / (duration / 16));
    const suffix = el.getAttribute('data-suffix') || '';

    function tick() {
      current += step;
      if (current >= max) {
        el.textContent = max + suffix;
        return;
      }
      el.textContent = current + suffix;
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contact-form');

  if (form) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const submitBtn = form.querySelector('.btn-submit');

    nameInput.addEventListener('blur', () => validateField(nameInput, 'Name is required'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    subjectInput.addEventListener('blur', () => validateField(subjectInput, 'Subject is required'));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'Message is required'));

    function validateField(input, msg) {
      const group = input.closest('.form-group');
      const error = group.querySelector('.form-error');
      if (!input.value.trim()) {
        group.classList.add('error');
        error.textContent = msg;
        return false;
      }
      group.classList.remove('error');
      error.textContent = '';
      return true;
    }

    function validateEmail(input) {
      const group = input.closest('.form-group');
      const error = group.querySelector('.form-error');
      const value = input.value.trim();

      if (!value) {
        group.classList.add('error');
        error.textContent = 'Email is required';
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        group.classList.add('error');
        error.textContent = 'Please enter a valid email';
        return false;
      }
      group.classList.remove('error');
      error.textContent = '';
      return true;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const validName = validateField(nameInput, 'Name is required');
      const validEmail = validateEmail(emailInput);
      const validSubject = validateField(subjectInput, 'Subject is required');
      const validMessage = validateField(messageInput, 'Message is required');

      if (!validName || !validEmail || !validSubject || !validMessage) {
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 1800));

        submitBtn.classList.remove('is-loading');
        submitBtn.classList.add('is-sent');
        submitBtn.querySelector('.btn-text').textContent = 'Sent!';

        form.reset();

        setTimeout(() => {
          submitBtn.classList.remove('is-sent');
          submitBtn.querySelector('.btn-text').textContent = 'Send Message';
          submitBtn.disabled = false;
        }, 3000);
      } catch (err) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    });
  }

  /* ─── LIGHTBOX ─── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  const imageSources = [];

  if (galleryItems.length && lightbox) {
    galleryItems.forEach((item, i) => {
      const src = item.getAttribute('data-src');
      if (src) imageSources.push(src);

      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const idx = imageSources.indexOf(src);
        if (idx > -1) currentIndex = idx;
        openLightbox(currentIndex);
      });
    });

    function openLightbox(index) {
      if (index < 0 || index >= imageSources.length) return;
      currentIndex = index;
      lightboxImg.src = imageSources[index];
      lightboxImg.alt = 'Image ' + (index + 1);
      lightboxCounter.textContent = (index + 1) + ' / ' + imageSources.length;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
      openLightbox(currentIndex);
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % imageSources.length;
      openLightbox(currentIndex);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
