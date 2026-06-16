/* =========================================================
   VERITY HOSPITAL — INTERACTIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Inject pulse-line dividers from template ---------- */
  const pulseTemplate = document.getElementById('pulse-divider-template');
  document.querySelectorAll('[data-pulse]').forEach(slot => {
    slot.appendChild(pulseTemplate.content.cloneNode(true));
  });

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.innerHTML = isOpen
      ? '<svg width="22" height="22"><use href="#icon-close"/></svg>'
      : '<svg width="22" height="22"><use href="#icon-menu"/></svg>';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<svg width="22" height="22"><use href="#icon-menu"/></svg>';
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.hero-stats dt[data-count]');
  let countersStarted = false;
  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { startCounters(); obs.disconnect(); }
      });
    }, { threshold: 0.4 }).observe(heroStatsEl);
  }

  /* ---------- Doctor horizontal scroll controls ---------- */
  const doctorTrack = document.getElementById('doctor-track');
  const docPrev = document.getElementById('doc-prev');
  const docNext = document.getElementById('doc-next');
  if (doctorTrack) {
    const scrollAmount = () => doctorTrack.querySelector('.doctor-card').offsetWidth + 22;
    docNext.addEventListener('click', () => doctorTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    docPrev.addEventListener('click', () => doctorTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  }

  /* ---------- Testimonial slider ---------- */
  const storyTrack = document.getElementById('story-track');
  const storyDotsWrap = document.getElementById('story-dots');
  if (storyTrack && storyDotsWrap) {
    const slides = Array.from(storyTrack.children);
    let current = 0;
    let autoplayTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      storyDotsWrap.appendChild(dot);
    });
    const dots = Array.from(storyDotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      storyTrack.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function next() { goTo(current + 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, 6000);
    }
    function stopAutoplay() { clearInterval(autoplayTimer); }

    storyTrack.parentElement.addEventListener('mouseenter', stopAutoplay);
    storyTrack.parentElement.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  /* ---------- Booking form ---------- */
  const doctorsBySpecialty = {
    cardiology: ['Dr. Ananya Rao', 'Dr. Sanjay Mehta'],
    neurology: ['Dr. Vikram Sehgal', 'Dr. Farah Khan'],
    orthopaedics: ['Dr. Arjun Nair', 'Dr. Kavita Joshi'],
    oncology: ['Dr. Sneha Iyer', 'Dr. Rohit Bansal'],
    maternity: ['Dr. Meera Pillai', 'Dr. Anjali Verma'],
    nephrology: ['Dr. Suresh Kumar', 'Dr. Divya Menon'],
    gastroenterology: ['Dr. Imran Sheikh', 'Dr. Pooja Shah'],
    general: ['Dr. Neha Gupta', 'Dr. Karan Malhotra']
  };
  const specialtyLabels = {
    cardiology: 'Cardiology',
    neurology: 'Neurology & Neurosurgery',
    orthopaedics: 'Orthopaedics & Joint Care',
    oncology: 'Oncology',
    maternity: 'Maternity & Child Care',
    nephrology: 'Nephrology & Dialysis',
    gastroenterology: 'Gastroenterology',
    general: 'General Medicine'
  };

  const specialtySelect = document.getElementById('bk-specialty');
  const doctorSelect = document.getElementById('bk-doctor');
  const dateInput = document.getElementById('bk-date');
  const slotChips = document.querySelectorAll('#slot-chips .chip');
  const slotHidden = document.getElementById('bk-slot');
  const bookingForm = document.getElementById('booking-form');
  const formError = document.getElementById('form-error');
  const bookingConfirm = document.getElementById('booking-confirm');
  const bookAnother = document.getElementById('book-another');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (specialtySelect) {
    specialtySelect.addEventListener('change', () => {
      const list = doctorsBySpecialty[specialtySelect.value] || [];
      doctorSelect.innerHTML = '';
      if (list.length) {
        doctorSelect.disabled = false;
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.textContent = 'Choose a doctor';
        doctorSelect.appendChild(placeholder);
        list.forEach(name => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          doctorSelect.appendChild(opt);
        });
      } else {
        doctorSelect.disabled = true;
        const opt = document.createElement('option');
        opt.textContent = 'Select specialty first';
        doctorSelect.appendChild(opt);
      }
    });
  }

  slotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      slotChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      slotHidden.value = chip.dataset.slot;
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      const required = ['specialty', 'doctor', 'date', 'name', 'phone', 'email'];
      const missing = required.some(field => !data.get(field)) || !slotHidden.value;

      if (missing) {
        formError.hidden = false;
        return;
      }
      formError.hidden = true;

      const ref = 'VRT-' + Math.floor(100000 + Math.random() * 900000);
      const dateObj = new Date(data.get('date') + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

      document.getElementById('confirm-name').textContent = data.get('name').split(' ')[0];
      document.getElementById('confirm-ref').textContent = ref;
      document.getElementById('confirm-specialty').textContent = specialtyLabels[data.get('specialty')] || data.get('specialty');
      document.getElementById('confirm-doctor').textContent = data.get('doctor');
      document.getElementById('confirm-datetime').textContent = `${formattedDate}, ${slotHidden.value}`;

      bookingForm.hidden = true;
      bookingConfirm.hidden = false;
    });
  }

  if (bookAnother) {
    bookAnother.addEventListener('click', () => {
      bookingForm.reset();
      doctorSelect.innerHTML = '<option value="" selected>Select specialty first</option>';
      doctorSelect.disabled = true;
      slotChips.forEach(c => c.classList.remove('selected'));
      slotHidden.value = '';
      formError.hidden = true;
      bookingConfirm.hidden = true;
      bookingForm.hidden = false;
    });
  }

  /* ---------- Newsletter fake-subscribe ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMsg = document.getElementById('newsletter-msg');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterMsg.hidden = false;
      newsletterForm.reset();
    });
  }

});