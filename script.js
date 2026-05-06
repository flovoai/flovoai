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
  var staggerGroups = ['.prob-item', '.stat', '.service', '.process-step-compact', '.industry-stat'];
  var singleEls     = ['.compare', '.quote', '.contact-cta', '.case-head'];
  var allReveal = [];

  staggerGroups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 90) + 'ms';
      allReveal.push(el);
    });
  });
  singleEls.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
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
      var delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(function () { el.style.transitionDelay = ''; }, 650 + delay);
    });
  }, { threshold: 0.12 });

  allReveal.forEach(function (el) { revealObserver.observe(el); });

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
