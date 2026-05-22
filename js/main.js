document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });

  // ===== MOBILE HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // ===== HERO SLIDER =====
  const track = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let autoSlide;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.slider-dots span').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  }

  autoSlide = setInterval(nextSlide, 5000);

  // Touch/swipe
  let touchStartX = 0;
  let touchEndX = 0;

  const sliderContainer = document.getElementById('sliderContainer');
  sliderContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoSlide();
    }
  }, { passive: true });

  // ===== PARTNER CAROUSEL =====
  const partnerTrack = document.getElementById('partnerTrack');
  const partnerCards = partnerTrack.querySelectorAll('.partner-card');

  function getCardWidth() {
    if (partnerCards[0]) {
      return partnerCards[0].offsetWidth + 24;
    }
    return 294;
  }

  let partnerOffset = 0;

  function updatePartnerCarousel() {
    const cardW = getCardWidth();
    const container = partnerTrack.parentElement;
    const visibleWidth = container.offsetWidth;
    const maxOffset = Math.max(0, (partnerCards.length * cardW) - visibleWidth);
    partnerOffset = Math.max(0, Math.min(partnerOffset, maxOffset));
    partnerTrack.style.transform = `translateX(-${partnerOffset}px)`;
  }

  document.getElementById('partnerNext').addEventListener('click', () => {
    const cardW = getCardWidth();
    const visibleWidth = partnerTrack.parentElement.offsetWidth;
    const maxOffset = Math.max(0, (partnerCards.length * cardW) - visibleWidth);
    partnerOffset = Math.min(partnerOffset + cardW, maxOffset);
    updatePartnerCarousel();
  });

  document.getElementById('partnerPrev').addEventListener('click', () => {
    const cardW = getCardWidth();
    partnerOffset = Math.max(0, partnerOffset - cardW);
    updatePartnerCarousel();
  });

  window.addEventListener('resize', () => {
    partnerOffset = 0;
    updatePartnerCarousel();
  });

  updatePartnerCarousel();

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const update = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          return;
        }
        counter.textContent = Math.round(current);
        requestAnimationFrame(update);
      };
      update();
    });
  }

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll(
    '.stat-card, .feature-card, .member-card, .gallery-item, .about-image-frame, .about-content'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Stats observer
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) statsObserver.observe(statsGrid);

  // ===== FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-block');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        btn.style.background = '#059669';
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});