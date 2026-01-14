// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    if (scrollProgress) {
        scrollProgress.style.width = scrollPercentage + '%';
    }
}

// Sticky CTA Button
function updateStickyCta() {
    const stickyCta = document.getElementById('stickyCta');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (stickyCta) {
        if (scrollTop > 800) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }
}

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Fragmentation animation
            if (entry.target.classList.contains('fragmentation-visual')) {
                const lines = entry.target.querySelectorAll('.frag-line');
                lines.forEach(line => line.classList.add('animate'));
                observer.unobserve(entry.target);
            }

            // Drain animation
            if (entry.target.classList.contains('drain-visual')) {
                const items = entry.target.querySelectorAll('.drain-item');
                const flows = entry.target.querySelectorAll('.drain-flow');
                items.forEach(item => item.classList.add('visible'));
                flows.forEach(flow => flow.classList.add('animate'));
                observer.unobserve(entry.target);
            }

            // Adaptation animation
            if (entry.target.classList.contains('adaptation-visual')) {
                const shape = entry.target.querySelector('.adapt-shape-final');
                if (shape) shape.classList.add('animate');
                observer.unobserve(entry.target);
            }

            // Journey animation
            if (entry.target.classList.contains('journey-path')) {
                const line = entry.target.querySelector('.journey-line');
                const dots = entry.target.querySelectorAll('.journey-dot');
                if (line) line.classList.add('animate');
                dots.forEach(dot => dot.classList.add('animate'));
                observer.unobserve(entry.target);
            }

            // Convergence animation
            if (entry.target.classList.contains('convergence-visual')) {
                const lines = entry.target.querySelectorAll('.converge-line');
                const center = entry.target.querySelector('.converge-center');
                lines.forEach(line => line.classList.add('animate'));
                if (center) center.classList.add('animate');
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Initialize all observers
document.addEventListener('DOMContentLoaded', () => {
    // Observe fragmentation
    const fragmentationVisual = document.querySelector('.fragmentation-visual');
    if (fragmentationVisual) observer.observe(fragmentationVisual);

    // Observe drain
    const drainVisual = document.querySelector('.drain-visual');
    if (drainVisual) observer.observe(drainVisual);

    // Observe adaptation
    const adaptationVisual = document.querySelector('.adaptation-visual');
    if (adaptationVisual) observer.observe(adaptationVisual);

    // Observe journey
    const journeyPath = document.querySelector('.journey-path');
    if (journeyPath) observer.observe(journeyPath);

    // Observe convergence
    const convergenceVisual = document.querySelector('.convergence-visual');
    if (convergenceVisual) observer.observe(convergenceVisual);

    // Add active state to nav on scroll
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }

        // Update scroll progress and sticky CTA
        updateScrollProgress();
        updateStickyCta();
    });

    // Initial check for sticky CTA
    updateStickyCta();
});
