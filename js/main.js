document.addEventListener('DOMContentLoaded', function() {

  // ===== HEADER SCROLL EFFECT =====
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ===== MOBILE HAMBURGER =====
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('mainNav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('open');
      });
    });
  }

  // ===== SCROLL REVEAL =====
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  // ===== FORM =====
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.rr-submit-btn');
      if (!btn) return;
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        contactForm.reset();
        setTimeout(function() {
          btn.innerHTML = original;
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
