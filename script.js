// Language Switching
const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'kk';

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setLanguage(lang);
    });
});

function setLanguage(lang) {
    currentLang = lang;

    // Update active button
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Update all text elements with data-kk and data-ru attributes
    const elements = document.querySelectorAll('[data-kk]');
    elements.forEach(el => {
        const text = el.dataset[lang];
        if (text) {
            el.textContent = text;
        }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-kk-placeholder]');
    placeholderElements.forEach(el => {
        const placeholder = el.dataset[`${lang}-placeholder`];
        if (placeholder) {
            el.placeholder = placeholder;
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Save preference to localStorage
    localStorage.setItem('preferredLang', lang);
}

// Load saved language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && (savedLang === 'kk' || savedLang === 'ru')) {
        setLanguage(savedLang);
    }
}

// Smooth scroll for navigation links
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            alert(currentLang === 'kk' ? 'Барлық өрістерді толтырыңыз' : 'Заполните все поля');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(currentLang === 'kk' ? 'Дұрыс email енгізіңіз' : 'Введите правильный email');
            return;
        }

        // Success message
        alert(currentLang === 'kk' 
            ? 'Хабарлама сәтті жіберілді! Рахмет!' 
            : 'Сообщение успешно отправлено! Спасибо!');

        // Reset form
        contactForm.reset();
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.info-card, .gallery-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLanguagePreference();
    lucide.createIcons();
});
