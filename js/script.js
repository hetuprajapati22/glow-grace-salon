/* =========================================================
   GLOW & GRACE SALON - script.js
   Is file mein sab kuch ek hi jagah hai, section-wise comments ke saath.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 0. SETUP ---------- */

  // <html> par "js" class lagao. CSS isse scroll animations chalu karti hai.
  // Agar JS load na ho, to content hide nahi hota.
  document.documentElement.classList.add('js');

  // Chhote helper functions (typing kam karne ke liye)
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // Agar user ne device mein "reduce motion" on kiya hai to smooth scroll band
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

  /* ---------- 1. DYNAMIC COPYRIGHT YEAR ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. IMAGE FALLBACK ----------
     Pehle online (Unsplash) image try hoti hai.
     Fail ho to data-fallback wali local image (assets/images/...) try hoti hai.
     Wo bhi na mile to gold placeholder dikhta hai (CSS ki .img-failed class). */
  function handleImageError(img) {
    const fallback = img.getAttribute('data-fallback');
    if (fallback && !img.dataset.triedFallback) {
      img.dataset.triedFallback = 'true';
      img.src = fallback;
    } else {
      img.classList.add('img-failed');
    }
  }

  $$('img.js-img').forEach(function (img) {
    img.addEventListener('error', function () { handleImageError(img); });
    // Agar error script load hone se pehle hi aa chuka ho, to yahan pakad lo
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      handleImageError(img);
    }
  });

  /* ---------- 3. MOBILE NAVIGATION ---------- */
  const header = $('.site-header');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    // Menu ke bahar click karo to menu band ho jaye
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('is-open') && !header.contains(e.target)) {
        closeMenu();
      }
    });

    // Screen bada ho jaye (laptop size) to mobile menu band kar do
    window.matchMedia('(min-width: 993px)').addEventListener('change', function (e) {
      if (e.matches) closeMenu();
    });
  }

  /* ---------- 4. SMOOTH SCROLLING + MENU CLOSE ON LINK CLICK ---------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');

      // href="#" wale placeholder links (jaise social media) kuch nahi karenge
      if (href === '#') {
        e.preventDefault();
        return;
      }

      // Link click hote hi mobile menu band
      if (navMenu) closeMenu();

      // "Back to top" type links
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
        return;
      }

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });

      // URL mein #section dikhao (error aaye to ignore)
      try { history.replaceState(null, '', href); } catch (err) { /* ignore */ }

      // Keyboard users ke liye focus bhi target par le jao
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.style.outline = 'none';
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- 5. SCROLL EFFECTS (navbar shadow, active link, back-to-top) ---------- */
  const backToTop = $('#backToTop');
  const navLinks = $$('.nav-link');
  const pageSections = $$('main section[id]');
  let ticking = false;

  function updateOnScroll() {
    const y = window.scrollY;

    // Navbar ke neeche halki shadow
    header.classList.toggle('is-scrolled', y > 10);

    // Back-to-top button: thoda neeche jaane par hi dikhao
    if (backToTop) backToTop.hidden = y < 600;

    // Konsa section dikh raha hai, uska nav link gold karo
    let current = '';
    const line = header.offsetHeight + 120;
    pageSections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    if (y < 50) current = 'home';
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = 'contact';

    navLinks.forEach(function (link) {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateOnScroll();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  updateOnScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
  }

  /* ---------- 6. SCROLL REVEAL ANIMATION ---------- */
  const revealItems = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);

        // Animation khatam hone ke baad reveal classes hata do,
        // taaki cards ka apna hover (upar uthna) bina rukawat ke chale.
        window.setTimeout(function () {
          el.classList.remove('reveal', 'is-visible');
        }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    // Purana browser: animation chhodo, content seedha dikhao
    revealItems.forEach(function (el) { el.classList.remove('reveal'); });
  }

  /* ---------- 7. GALLERY LIGHTBOX ---------- */
  const galleryItems = $$('.gallery-item');
  const lightbox = $('#lightbox');
  const lbImage = $('#lbImage');
  const lbCaption = $('#lbCaption');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');

  let lbIndex = 0;
  let lastFocused = null;

  function lightboxIsOpen() {
    return lightbox && !lightbox.hidden;
  }

  function showLightboxImage(index) {
    lbIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[lbIndex];
    const thumb = $('img', item);
    const capEl = $('.gallery-cap', item);
    const captionText = capEl ? capEl.textContent : '';

    // Image try karne ka order: bada online -> local fallback -> chhota thumbnail
    const sources = [
      item.dataset.full,
      item.dataset.fallback,
      thumb && !thumb.classList.contains('img-failed') ? (thumb.currentSrc || thumb.src) : ''
    ].filter(function (src, i, arr) { return src && arr.indexOf(src) === i; });

    let attempt = 0;
    lbImage.onerror = function () {
      attempt += 1;
      if (attempt < sources.length) {
        lbImage.src = sources[attempt];
      } else {
        lbImage.removeAttribute('src');
        lbCaption.textContent = captionText + ' (image could not be loaded)';
      }
    };

    lbImage.alt = thumb ? thumb.alt : captionText;
    lbCaption.textContent = captionText + '  ·  ' + (lbIndex + 1) + ' / ' + galleryItems.length;
    if (sources.length) lbImage.src = sources[0];
    else lbImage.onerror();
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    const single = galleryItems.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
    showLightboxImage(index);
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    lbImage.onerror = null;
    lbImage.removeAttribute('src');
    // Focus wapas us photo par jahan se lightbox khola tha
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showLightboxImage(lbIndex - 1); });
    lbNext.addEventListener('click', function () { showLightboxImage(lbIndex + 1); });

    // Dark background par click karo to band ho jaye
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Mobile par swipe: left/right
    let touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      const diff = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(diff) < 50) return;
      showLightboxImage(diff > 0 ? lbIndex - 1 : lbIndex + 1);
    }, { passive: true });
  }

  /* ---------- 8. KEYBOARD SUPPORT (Escape, arrows, Tab) ---------- */
  document.addEventListener('keydown', function (e) {
    if (lightboxIsOpen()) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showLightboxImage(lbIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showLightboxImage(lbIndex + 1);
      } else if (e.key === 'Tab') {
        // Focus lightbox ke andar hi ghoomta rahe
        const focusable = [lbClose, lbPrev, lbNext].filter(function (btn) { return !btn.hidden; });
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      return;
    }

    // Lightbox band hai aur mobile menu khula hai: Escape se menu band
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- 9. APPOINTMENT ENQUIRY FORM (validation + demo message) ---------- */
  const form = $('#enquiryForm');
  const formStatus = $('#formStatus');

  if (form) {
    const fieldNames = ['fullName', 'phone', 'email', 'service', 'date'];

    // Date ke liye aaj ki date (local time) aur 12 mahine baad ki date
    function toDateString(d) {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + mm + '-' + dd;
    }
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const todayStr = toDateString(today);
    const maxStr = toDateString(nextYear);

    const dateInput = $('#date');
    dateInput.min = todayStr;
    dateInput.max = maxStr;

    // Har field ka rule. Khali string ('') ka matlab: sab theek hai.
    const rules = {
      fullName: function (value) {
        const v = value.trim();
        if (!v) return 'Please enter your full name.';
        if (v.length < 2) return 'Your name looks too short. Please enter your full name.';
        if (!/^[\p{L}\p{M}\s.'’-]+$/u.test(v)) return 'Please use only letters in your name.';
        return '';
      },
      phone: function (value) {
        const cleaned = value.replace(/[\s\-()]/g, '');
        if (!cleaned) return 'Please enter your phone number.';
        if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned)) {
          return 'Please enter a valid 10-digit mobile number (starting with 6, 7, 8 or 9).';
        }
        return '';
      },
      email: function (value) {
        const v = value.trim();
        if (!v) return ''; // email optional hai
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          return 'Please enter a valid email address, like name@example.com.';
        }
        return '';
      },
      service: function (value) {
        return value ? '' : 'Please choose a service.';
      },
      date: function (value) {
        if (!value) return 'Please choose your preferred date.';
        if (value < todayStr) return 'Please choose today or a future date.';
        if (value > maxStr) return 'Please choose a date within the next 12 months.';
        return '';
      }
    };

    function setFieldError(field, message) {
      const errorEl = document.getElementById(field.id + 'Error');
      if (errorEl) errorEl.textContent = message;
      field.classList.toggle('is-invalid', Boolean(message));
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }

    // true = field theek hai, false = galat hai
    function validateField(name) {
      const field = document.getElementById(name);
      const message = rules[name](field.value);
      setFieldError(field, message);
      return message === '';
    }

    function clearAllErrors() {
      fieldNames.forEach(function (name) {
        setFieldError(document.getElementById(name), '');
      });
    }

    function showStatus(type, title, text) {
      formStatus.className = 'form-status' + (type ? ' is-' + type : '');
      formStatus.replaceChildren();
      const strong = document.createElement('strong');
      strong.textContent = title;
      const p = document.createElement('p');
      p.textContent = text;
      formStatus.append(strong, p);
      formStatus.hidden = false;
      formStatus.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
    }

    // Live feedback: user type kare ya field chhode to check karo
    fieldNames.forEach(function (name) {
      const field = document.getElementById(name);
      field.addEventListener('blur', function () {
        // Optional email khali ho to blur par error mat dikhao
        if (name === 'email' && !field.value.trim()) { setFieldError(field, ''); return; }
        validateField(name);
      });
      const liveEvent = field.tagName === 'SELECT' || field.type === 'date' ? 'change' : 'input';
      field.addEventListener(liveEvent, function () {
        if (field.classList.contains('is-invalid')) validateField(name);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Saare fields check karo (pehla galat field yaad rakho)
      let firstInvalid = null;
      fieldNames.forEach(function (name) {
        if (!validateField(name) && !firstInvalid) {
          firstInvalid = document.getElementById(name);
        }
      });

      if (firstInvalid) {
        showStatus('error', 'Please check the form.', 'Some details need your attention. Please fix the highlighted fields and try again.');
        firstInvalid.focus();
        return;
      }

      // Sab theek hai. Yeh sirf DEMO hai, kuch bhi bheja ya book nahi hota.
      const firstName = $('#fullName').value.trim().split(/\s+/)[0];
      form.reset();
      clearAllErrors();
      showStatus(
        '',
        'This is a demo form. Nothing has been sent or booked.',
        'Thank you, ' + firstName + '! Your details look correct, but this website has no backend yet, so no enquiry or appointment was made. To receive real enquiries, the site needs a form service (such as Netlify Forms or Formspree) or a backend.'
      );
    });
  }

  /* ---------- 10. WHATSAPP PLACEHOLDER CHECK ---------- */
  const whatsappBtn = $('#whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function (e) {
      // Jab tak number abhi bhi placeholder (0000000000) hai, real chat mat kholo
      if (whatsappBtn.href.indexOf('910000000000') !== -1) {
        e.preventDefault();
        window.alert('Demo website: the WhatsApp number is still a placeholder.\n\nReplace 910000000000 in index.html with the salon owner\'s authorised number (country code + number, no spaces or +).');
      }
    });
  }

})();
