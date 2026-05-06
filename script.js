document.addEventListener('DOMContentLoaded', function () {

  // ── Nav border on scroll ──────────────────────────────────────────────────
  var nav = document.getElementById('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Smooth scroll for hash anchors ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });
  });

  // ── Scroll entrance animations ────────────────────────────────────────────
  // Groups to animate in with a left-to-right stagger
  var staggerGroups = [
    '.prob-item',
    '.stat',
    '.service',
    '.process-step',
  ];
  // Single elements that just fade in
  var singleEls = [
    '.compare',
    '.quote',
    '.contact-card',
  ];

  var allReveal = [];

  staggerGroups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 90) + 'ms';
      allReveal.push(el);
    });
  });

  singleEls.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('reveal');
      allReveal.push(el);
    });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('in-view');
      revealObserver.unobserve(el);
      // Clear stagger delay once the animation has settled so hover
      // transitions on services etc. aren't also delayed.
      var delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(function () { el.style.transitionDelay = ''; }, 600 + delay);
    });
  }, { threshold: 0.12 });

  allReveal.forEach(function (el) { revealObserver.observe(el); });

  // ── Stat counter animation ────────────────────────────────────────────────
  var statNums = document.querySelectorAll('.stat-num[data-target]');

  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10);
    // The numeric text is the first child text node; <small> stays in place
    var textNode = el.childNodes[0];
    if (!textNode || textNode.nodeType !== 3) return;

    var duration = 1400;
    var startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      textNode.nodeValue = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else textNode.nodeValue = target;
    }

    textNode.nodeValue = '0';
    requestAnimationFrame(tick);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { countObserver.observe(el); });

});
