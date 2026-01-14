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

// Scroll event listeners
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-premium');

    window.addEventListener('scroll', () => {
        // Update scroll progress and sticky CTA
        updateScrollProgress();
        updateStickyCta();

        // Add shadow to nav on scroll
        if (window.scrollY > 50) {
            if (nav) {
                nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }
        } else {
            if (nav) {
                nav.style.boxShadow = 'none';
            }
        }
    });

    // Initial check for sticky CTA
    updateStickyCta();
});
