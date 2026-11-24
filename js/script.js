/**
 * ESSAM HASHEM — PROFESSIONAL PORTFOLIO JAVASCRIPT
 * Capabilities: Bilingual Localization (EN / AR RTL), Theme System (Dark / Light),
 * Mobile Navigation, Scroll-Spy, Scroll Animations, Numerical Counters,
 * Project Modals, and Localized Contact Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const htmlElement = document.documentElement;

  /* ===================================================================
     1. BILINGUAL SYSTEM (ENGLISH / ARABIC WITH RTL SUPPORT)
     =================================================================== */
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langToggleText = document.getElementById('lang-toggle-text');
  const mobileLangToggleBtn = document.getElementById('mobile-lang-toggle-btn');
  const mobileLangToggleText = document.getElementById('mobile-lang-toggle-text');

  // Retrieve stored language or default to 'en'
  let currentLang = localStorage.getItem('eh_portfolio_lang') || 'en';

  // Helper to reliably access translation dictionary
  function getTranslations(lang) {
    const t = window.TRANSLATIONS || (typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : null);
    return t && t[lang] ? t[lang] : null;
  }

  function setLanguage(lang) {
    const dict = getTranslations(lang);
    if (!dict) {
      console.warn('Translation dictionary not loaded for:', lang);
      return;
    }

    currentLang = lang;
    localStorage.setItem('eh_portfolio_lang', lang);

    const isArabic = lang === 'ar';

    // Set HTML attributes for direction & language
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    // Update Language Toggle Button UI (Navbar)
    if (langToggleText) {
      langToggleText.textContent = dict.lang_btn_text;
    }
    if (langToggleBtn) {
      langToggleBtn.setAttribute('title', dict.lang_btn_title);
      langToggleBtn.setAttribute('aria-label', dict.lang_btn_title);
    }

    // Update Mobile Drawer Language Toggle Button UI
    if (mobileLangToggleText) {
      mobileLangToggleText.textContent = isArabic ? 'English (EN)' : 'العربية (AR)';
    }

    // Update Document Title & Meta Description
    if (dict.page_title) {
      document.title = dict.page_title;
    }
    const metaDesc = document.querySelector('meta[data-i18n-content="page_desc"]');
    if (metaDesc && dict.page_desc) {
      metaDesc.setAttribute('content', dict.page_desc);
    }

    // Update all text elements with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        const val = dict[key];
        // If string contains HTML (e.g. <strong>), use innerHTML, else textContent
        if (typeof val === 'string' && val.includes('<') && val.includes('>')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update all input placeholders with data-i18n-ph
    const i18nPlaceholders = document.querySelectorAll('[data-i18n-ph]');
    i18nPlaceholders.forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Trigger custom event for language change
    window.dispatchEvent(new CustomEvent('portfolio:langchange', { detail: { lang } }));
  }

  // Initialize language on DOM ready
  setLanguage(currentLang);

  // Desktop/Header Toggle Button Click
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  }

  // Mobile Drawer Toggle Button Click
  if (mobileLangToggleBtn) {
    mobileLangToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  }

  // Expose setLanguage globally for console testing
  window.setPortfolioLanguage = setLanguage;

  /* ===================================================================
     2. THEME TOGGLE (DARK / LIGHT MODE) WITH PERSISTENCE
     =================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Retrieve stored theme or default to dark
  const storedTheme = localStorage.getItem('eh_portfolio_theme') || 'dark';
  setTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('eh_portfolio_theme', theme);
    if (themeToggleBtn) {
      const title = theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
      themeToggleBtn.setAttribute('title', title);
      themeToggleBtn.setAttribute('aria-label', title);
    }
  }

  /* ===================================================================
     3. HEADER SCROLL STATE & STICKY BEHAVIOR
     =================================================================== */
  const header = document.getElementById('header');
  const floatingBackToTop = document.getElementById('floating-back-to-top');

  window.addEventListener('scroll', handleScrollEvents, { passive: true });

  function handleScrollEvents() {
    const scrollY = window.scrollY;

    // Header class on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating Back to Top Button visibility
    if (floatingBackToTop) {
      if (scrollY > 450) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }
  }

  /* ===================================================================
     4. MOBILE NAVIGATION DRAWER
     =================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any link inside the mobile drawer
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNavDrawer.classList.contains('open')) {
        if (!mobileNavDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });
  }

  function openMobileMenu() {
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ===================================================================
     5. ACTIVE NAVIGATION LINK ON SCROLL (SCROLL-SPY)
     =================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ===================================================================
     6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     =================================================================== */
  const revealElements = document.querySelectorAll('.reveal-fade-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ===================================================================
     7. ANIMATED COUNTERS FOR STATS & MILESTONES
     =================================================================== */
  const counterElements = document.querySelectorAll('[data-counter]');

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, targetValue, suffix);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.5
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(element, target, suffix) {
    if (isNaN(target)) return;

    let start = 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    if (target > 1000) {
      start = target - 30;
    }

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ===================================================================
     8. BACK-TO-TOP BUTTONS
     =================================================================== */
  const footerBackToTop = document.getElementById('footer-back-to-top');

  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', scrollToTop);
  }

  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', scrollToTop);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /* ===================================================================
     9. INTERACTIVE PROJECT DETAILS MODAL
     =================================================================== */
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ===================================================================
     10. CONTACT FORM LOCALIZED VALIDATION & FEEDBACK
     =================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const feedbackAlert = document.getElementById('form-feedback-alert');

  if (contactForm) {
    const fullNameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    fullNameInput.addEventListener('input', () => validateField(fullNameInput, 'group-fullname', val => val.trim().length >= 2));
    emailInput.addEventListener('input', () => validateField(emailInput, 'group-email', isValidEmail));
    subjectInput.addEventListener('input', () => validateField(subjectInput, 'group-subject', val => val.trim().length >= 3));
    messageInput.addEventListener('input', () => validateField(messageInput, 'group-message', val => val.trim().length >= 15));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(fullNameInput, 'group-fullname', val => val.trim().length >= 2);
      const isEmailValid = validateField(emailInput, 'group-email', isValidEmail);
      const isSubjectValid = validateField(subjectInput, 'group-subject', val => val.trim().length >= 3);
      const isMessageValid = validateField(messageInput, 'group-message', val => val.trim().length >= 15);

      const dict = getTranslations(currentLang) || getTranslations('en') || {};

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const nameVal = fullNameInput.value.trim();
        const subjectVal = encodeURIComponent(subjectInput.value.trim());
        const messageVal = encodeURIComponent(
          `From: ${nameVal}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
        );

        const successTitle = dict.form_feedback_success_title || "Inquiry Prepared Successfully!";
        const successDesc = (dict.form_feedback_success_desc || "Thank you, {name}. Your contact form inputs are valid.").replace('{name}', `<strong>${escapeHTML(nameVal)}</strong>`);
        const sendBtnText = dict.form_feedback_send_btn || "Send via Email Client";
        const altPhone = dict.form_feedback_alt_phone || "Or connect directly by phone at 01141477899.";

        feedbackAlert.className = 'form-status-alert success';
        feedbackAlert.innerHTML = `
          <strong>${successTitle}</strong><br>
          ${successDesc}
          <div style="margin-top: 10px;">
            <a href="mailto:essamhashem1000@gmail.com?subject=${subjectVal}&body=${messageVal}" class="btn btn-primary btn-sm" style="display: inline-flex; margin-top: 4px;">
              <span>${sendBtnText}</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
              ${altPhone}
            </span>
          </div>
        `;

        contactForm.reset();
        [fullNameInput, emailInput, subjectInput, messageInput].forEach(input => {
          input.closest('.form-group').classList.remove('has-error');
        });
      } else {
        feedbackAlert.className = 'form-status-alert error';
        feedbackAlert.textContent = dict.form_feedback_error || 'Please correct the highlighted fields above before submitting.';

        const firstInvalid = contactForm.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  function validateField(inputElement, groupId, validatorFn) {
    const group = document.getElementById(groupId);
    if (!group) return true;

    const isValid = validatorFn(inputElement.value);
    if (!isValid) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }
    return isValid;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
