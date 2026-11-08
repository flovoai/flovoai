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
  // Elements fade up as they enter the viewport. Items that share a parent
  // (e.g. the three cards in a row) are staggered so they arrive one by one.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSelectors = [
    '.sec-head > *', '.case-left > *', '.approach > div:first-child > *', '.contact > *',
    '.card', '.stat', '.step', '.mock', '.compare-col', '.diagram'
  ];
  var STAGGER = 110;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var counts = new Map();
    document.querySelectorAll(revealSelectors.join(',')).forEach(function (el) {
      var n = counts.get(el.parentNode) || 0;
      counts.set(el.parentNode, n + 1);
      el.classList.add('reveal');
      el.style.transitionDelay = (n * STAGGER) + 'ms';
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        revealObserver.unobserve(el);
        el.classList.add('in-view');
        // Once finished, drop the reveal classes so hover effects feel snappy
        var delay = parseFloat(el.style.transitionDelay) || 0;
        setTimeout(function () {
          el.classList.add('revealed');
          el.classList.remove('reveal', 'in-view');
          el.style.transitionDelay = '';
        }, 900 + delay);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    // Hero plays its entrance on load
    requestAnimationFrame(function () { document.documentElement.classList.add('hero-in'); });
  } else {
    document.documentElement.classList.add('hero-in', 'no-motion');
  }

  // ── Number counter animation ──────────────────────────────────────────────
  // Handles both .stat-num[data-target] and .industry-num[data-target]
  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10);
    // Find first text node (the number); leave any child elements (.industry-unit, <small>) in place
    var textNode = null;
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) { textNode = el.childNodes[i]; break; }
    }
    if (!textNode) return;

    var duration = 1400;
    var startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      textNode.nodeValue = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else textNode.nodeValue = target;
    }

    textNode.nodeValue = '0';
    requestAnimationFrame(tick);
  }

  var countEls = document.querySelectorAll('.stat-num[data-target], .industry-num[data-target]');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  countEls.forEach(function (el) { countObserver.observe(el); });

});
