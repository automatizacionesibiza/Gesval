/* =============================================
   GESVAL — JavaScript principal
   ============================================= */

(function () {
  'use strict';

  /* --- Navbar scroll behavior --- */
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.navbar__mobile .navbar__link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  const activateLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar__link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });

  /* --- Scroll reveal --- */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  /* --- Animated counters --- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* --- Contact form → Formspree --- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const FORMSPREE_URL = 'https://formspree.io/f/automatizacionesibiza@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form__submit');
      const originalHTML = btn.innerHTML;
      const spinnerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Enviando…';

      btn.innerHTML = spinnerHTML;
      btn.disabled = true;

      try {
        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.style.display = 'none';
          successMsg.style.display = 'block';
        } else {
          const data = await response.json();
          const msg = (data.errors || []).map(err => err.message).join(', ') || 'Error al enviar. Inténtalo de nuevo.';
          alert(msg);
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      } catch {
        alert('Error de conexión. Por favor, inténtalo de nuevo.');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Spinner CSS (injected) --- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin .8s linear infinite; }
    .navbar__link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);

})();
