/* ═══════════════════════════════════════════════════════
   WEBNOOK — Main JavaScript
   ═══════════════════════════════════════════════════════ */

/* ── NAV: Hamburger + Overlay ─────────────────────────── */
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('navOverlay');
const navLinks  = document.querySelectorAll('.overlay-links a');

function openMenu() {
  overlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  overlay.classList.contains('open') ? closeMenu() : openMenu();
});

navLinks.forEach(a => a.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeMenu();
});

/* ── NAV: Scroll shadow ───────────────────────────────── */
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── ACTIVE NAV LINK ──────────────────────────────────── */
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.overlay-links a, .nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── FADE-IN ON SCROLL ────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window && fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── FAQ ACCORDION ────────────────────────────────────── */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });
});

/* ── CONTACT FORM ─────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      const group = field.closest('.form-group');
      const errorEl = group && group.querySelector('.form-error');
      const isEmpty = !field.value.trim();
      const isInvalidEmail = field.type === 'email' && field.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

      if (isEmpty || isInvalidEmail) {
        valid = false;
        if (group) group.classList.add('has-error');
        if (errorEl && isInvalidEmail) errorEl.textContent = 'Please enter a valid email address.';
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    if (!valid) return;

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    /* ── TO CONNECT TO FORMSPREE (free, no server needed): ──
       1. Go to formspree.io and create a free account
       2. Create a new form — you get an endpoint like:
          https://formspree.io/f/yourcode
       3. Replace YOUR_FORM_ID in contact.html's form action
       ─────────────────────────────────────────────────── */

    const action = contactForm.getAttribute('action');
    if (action && !action.includes('YOUR_FORM_ID')) {
      const data = new FormData(contactForm);
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(res => {
          if (res.ok) {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.classList.add('visible');
          } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Something went wrong — please try again or email us directly.');
          }
        })
        .catch(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert('Something went wrong — please try again or email us directly.');
        });
    } else {
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('visible');
      }, 900);
    }
  });

  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });
}

/* ── SMOOTH SCROLL for internal anchors ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
