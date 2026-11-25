/**
 * ESSAM HASHEM — PROFESSIONAL PORTFOLIO JAVASCRIPT
 * Capabilities: Bilingual Localization (AR RTL / EN LTR), Theme System (Dark / Light),
 * Mobile Navigation Drawer, Scroll-Spy, Scroll Animations, Certificate Lightbox Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const htmlElement = document.documentElement;

  /* ===================================================================
     1. BILINGUAL SYSTEM (ARABIC DEFAULT RTL / ENGLISH LTR)
     =================================================================== */
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langToggleText = document.getElementById('lang-toggle-text');
  const mobileLangToggleBtn = document.getElementById('mobile-lang-toggle-btn');
  const mobileLangToggleText = document.getElementById('mobile-lang-toggle-text');

  // Retrieve stored language or default to 'ar'
  let currentLang = localStorage.getItem('eh_portfolio_lang') || 'ar';

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
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    htmlElement.lang = lang;
    htmlElement.dir = isArabic ? 'rtl' : 'ltr';

    // Update Language Toggle Button UI (Navbar)
    if (langToggleText) {
      langToggleText.textContent = isArabic ? 'EN' : 'عربي';
    }
    if (langToggleBtn) {
      const btnTitle = isArabic ? 'Switch to English' : 'التبديل إلى العربية';
      langToggleBtn.setAttribute('title', btnTitle);
      langToggleBtn.setAttribute('aria-label', btnTitle);
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
        if (typeof val === 'string' && val.includes('<') && val.includes('>')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Trigger custom event for language change
    window.dispatchEvent(new CustomEvent('portfolio:langchange', { detail: { lang } }));
  }

  // Initialize language on DOM ready
  setLanguage(currentLang);

  // Desktop Header Language Toggle Button Click
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      setLanguage(newLang);
    });
  }

  // Mobile Drawer Language Toggle Button Click
  if (mobileLangToggleBtn) {
    mobileLangToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      setLanguage(newLang);
      closeMobileMenu();
    });
  }

  // Expose setLanguage globally for testing
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
     3. HEADER SCROLL STATE & FLOATING BACK-TO-TOP
     =================================================================== */
  const header = document.getElementById('header');
  const floatingBackToTop = document.getElementById('floating-back-to-top');

  window.addEventListener('scroll', handleScrollEvents, { passive: true });

  function handleScrollEvents() {
    const scrollY = window.scrollY;

    // Header scrolled style
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating Back to Top Button visibility
    if (floatingBackToTop) {
      if (scrollY > 400) {
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
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
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

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking any link inside the mobile drawer
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
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
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  /* ===================================================================
     5. ACTIVE NAVIGATION LINK ON SCROLL (SCROLL-SPY)
     =================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;

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
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ===================================================================
     7. BACK-TO-TOP BUTTONS
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
     8. AMAZON CERTIFICATE LIGHTBOX MODAL
     =================================================================== */
  const certModal = document.getElementById('cert-modal');
  const certThumbTrigger = document.getElementById('cert-thumb-trigger');
  const openCertModalBtn = document.getElementById('open-cert-modal-btn');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalDismissBtn = document.getElementById('cert-modal-dismiss-btn');

  function openCertificateModal() {
    if (certModal) {
      certModal.classList.add('active');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (certModalClose) certModalClose.focus();
    }
  }

  function closeCertificateModal() {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (certThumbTrigger) {
    certThumbTrigger.addEventListener('click', openCertificateModal);
  }

  if (openCertModalBtn) {
    openCertModalBtn.addEventListener('click', openCertificateModal);
  }

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertificateModal);
  }

  if (certModalDismissBtn) {
    certModalDismissBtn.addEventListener('click', closeCertificateModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertificateModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertificateModal();
    }
  });

});
