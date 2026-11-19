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
  // With reduced motion the CSS swaps the movement for a short cross-fade.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSelectors = [
    '.sec-head > *', '.seg', '.panes', '.window', '.quote-card', '.stat',
    '.svc-list', '.timeline', '.flow-copy > *', '.book-copy > *'
  ];
  var STAGGER = reduceMotion ? 0 : 80;

  if ('IntersectionObserver' in window) {
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
        var delay = parseFloat(el.style.transitionDelay) || 0;
        setTimeout(function () {
          el.classList.add('revealed');
          el.classList.remove('reveal', 'in-view');
          el.style.transitionDelay = '';
        }, 1000 + delay);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    // Process line draws across when the steps come into view
    var steps = document.querySelector('.timeline');
    if (steps) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { steps.classList.add('drawn'); obs.disconnect(); }
      }, { threshold: 0.4 }).observe(steps);
    }

    // Hero plays its entrance on load
    requestAnimationFrame(function () { document.documentElement.classList.add('hero-in'); });
  } else {
    document.documentElement.classList.add('hero-in', 'no-motion');
  }

  // ── Services list: open one at a time ────────────────────────────────────
  var svcItems = document.querySelectorAll('.svc-item');
  svcItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      svcItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // ── Booking window: the next five working days ───────────────────────────
  // Picking a day opens Cal.com on that date, where the real times show.
  var calDays = document.getElementById('calDays');
  var calGo = document.getElementById('calGo');
  if (calDays && calGo) {
    var BOOK_URL = 'https://cal.com/flovoai/30min';
    var dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
    var dayLong = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var iso = function (d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    var pick = function (btn) {
      calDays.querySelectorAll('.cal-day').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      calGo.href = BOOK_URL + '?date=' + btn.dataset.date;
      calGo.firstChild.nodeValue = 'See times on ' + btn.dataset.short + ' ';
    };
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    for (var added = 0; added < 5;) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.dataset.date = iso(d);
      btn.dataset.short = dayName.format(d) + ' ' + d.getDate();
      btn.setAttribute('aria-label', dayLong.format(d));
      btn.innerHTML = '<small>' + dayName.format(d) + '</small><b>' + d.getDate() + '</b>';
      btn.addEventListener('click', function () { pick(this); });
      calDays.appendChild(btn);
      added++;
    }
    pick(calDays.firstChild);
  }

  // ── Wayfinding: highlight the nav link for the section in view ───────────
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function updateActive() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= y && y < sec.offsetTop + sec.offsetHeight) current = i;
    });
    navLinks.forEach(function (a, i) {
      var on = i === current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // ── Before / after switch ─────────────────────────────────────────────────
  // A segmented control: one pane shows at a time, the other fades out.
  var seg = document.getElementById('seg');
  if (seg) {
    seg.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-view]');
      if (!btn) return;
      var view = btn.dataset.view;
      seg.dataset.view = view;
      seg.querySelectorAll('button[data-view]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.view === view ? 'true' : 'false');
        var pane = document.getElementById(b.getAttribute('aria-controls'));
        if (pane) pane.hidden = b.dataset.view !== view;
      });
    });
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
    // Optional data-delay (ms) lets a number wait for its card to fade in
    setTimeout(function () { requestAnimationFrame(tick); }, parseInt(el.dataset.delay, 10) || 0);
  }

  var countEls = reduceMotion ? [] : document.querySelectorAll('[data-target]');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  countEls.forEach(function (el) { countObserver.observe(el); });

});
