// ========================================
// KURO - Landing Page JavaScript
// ========================================

function getI18nText(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
        const value = window.i18n.t(key, { defaultValue: fallback });
        return value || fallback;
    }
    return fallback;
}

const initPageScripts = () => {
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initContactForm();
    initScrollAnimations();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageScripts);
} else {
    initPageScripts();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        const sendingLabel = getI18nText('contact.form.sending', 'Envoi en cours...');
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
            ${sendingLabel}
        `;
        
        try {
            // Send to Formspree (or other service)
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success modal
                const modal = document.getElementById('successModal');
                if (modal) {
                    modal.classList.add('active');
                }
                // Reset form
                form.reset();
            } else {
                const errorMessage = getI18nText(
                    'contact.form.error',
                    'Erreur lors de l\'envoi. Veuillez réessayer.'
                );
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = getI18nText(
                'contact.form.error',
                'Erreur lors de l\'envoi. Veuillez réessayer.'
            );
            alert(errorMessage);
        }
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.revealDelay || '0');
                entry.target.classList.add('animate-in');
                requestAnimationFrame(() => {
                    entry.target.style.removeProperty('opacity');
                    entry.target.style.removeProperty('transform');
                });
                window.setTimeout(() => {
                    entry.target.style.removeProperty('transition');
                }, (delay + 0.7) * 1000 + 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const revealOnScroll = (nodeList, { axis = 'Y', distance = 24, stagger = 0.1 } = {}) => {
        const elements = Array.from(nodeList);
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = `translate${axis}(${distance}px)`;
            const delay = index * stagger;
            element.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
            element.dataset.revealDelay = delay;
            observer.observe(element);
        });
    };

    revealOnScroll(document.querySelectorAll('.feature-card'), { axis: 'Y', distance: 28, stagger: 0.1 });
    revealOnScroll(document.querySelectorAll('.step'), { axis: 'X', distance: -28, stagger: 0.12 });
    revealOnScroll(document.querySelectorAll('.info-card'), { axis: 'Y', distance: 24, stagger: 0.08 });
    revealOnScroll(document.querySelectorAll('.contact-form, .cta-container, .legal-card'), { axis: 'Y', distance: 24, stagger: 0.1 });
}

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1;
        transform: translate(0);
    }
`;
document.head.appendChild(style);
