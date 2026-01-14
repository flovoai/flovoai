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

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

// Intersection Observer for scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Problem card cracks
            if (entry.target.classList.contains('problem-card')) {
                entry.target.classList.add('in-view');
            }

            // Cost items fade in
            if (entry.target.classList.contains('cost-item')) {
                entry.target.classList.add('fade-in');
            }

            // Node animations
            if (entry.target.classList.contains('nodes-container')) {
                const lines = entry.target.querySelectorAll('.node-line');
                const circles = entry.target.querySelectorAll('.node-circle');
                lines.forEach(line => line.classList.add('animate'));
                circles.forEach(circle => circle.classList.add('animate'));
            }

            // Work lines reveal
            if (entry.target.classList.contains('how-work-content')) {
                const lines = entry.target.querySelectorAll('.work-line');
                lines.forEach(line => line.classList.add('reveal'));
            }

            // Alignment shapes
            if (entry.target.classList.contains('alignment-shapes')) {
                entry.target.classList.add('align');
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

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    // Problem card
    const problemCard = document.querySelector('.problem-card');
    if (problemCard) observer.observe(problemCard);

    // Cost items
    const costItems = document.querySelectorAll('.cost-item');
    costItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Nodes container
    const nodesContainer = document.querySelector('.nodes-container');
    if (nodesContainer) observer.observe(nodesContainer);

    // How we work content
    const howWorkContent = document.querySelector('.how-work-content');
    if (howWorkContent) observer.observe(howWorkContent);

    // Alignment shapes
    const alignmentShapes = document.querySelector('.alignment-shapes');
    if (alignmentShapes) observer.observe(alignmentShapes);

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
