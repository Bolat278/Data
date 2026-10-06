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

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

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
    initChatbot();
});

// Chatbot functionality
function initChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (!chatbotBtn || !chatbotModal) return;

    // Toggle chatbot modal
    chatbotBtn.addEventListener('click', () => {
        chatbotModal.classList.toggle('active');
        if (chatbotModal.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotModal.contains(e.target) && !chatbotBtn.contains(e.target)) {
            chatbotModal.classList.remove('active');
        }
    });

    // Send message
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i data-lucide="bot"></i></div>
            <div class="message-content">
                <p>...</p>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        lucide.createIcons();

        // Get AI response
        const response = await generateResponse(message);

        // Remove typing indicator
        typingDiv.remove();

        // Add bot response
        addMessage(response, 'bot');
        chatbotSend.disabled = false;
    }

    chatbotSend.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i data-lucide="bot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        const p = document.createElement('p');
        p.textContent = text;
        contentDiv.appendChild(p);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        lucide.createIcons();
    }

    async function generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Greetings
        if (lowerMessage.includes('сәлем') || lowerMessage.includes('привет') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return currentLang === 'kk'
                ? 'Сәлем! Мен Tair bot, Википедия арқылы ақпарат табуға көмектесемін. Қандай тақырып туралы білім қалайсыз?'
                : 'Привет! Я Tair bot, помогу найти информацию через Википедию. О чем хотите узнать?';
        }

        // Search Wikipedia
        try {
            const lang = currentLang === 'kk' ? 'kk' : 'ru';
            const searchUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(message)}`;

            const response = await fetch(searchUrl);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.extract) {
                    // Remove reference numbers like [1], [2]
                    const cleanText = data.extract.replace(/\[\d+\]/g, '');
                    
                    // Limit text length
                    const maxLength = 500;
                    if (cleanText.length > maxLength) {
                        return cleanText.substring(0, maxLength) + '...';
                    }
                    
                    return cleanText;
                }
            }

            // If direct search fails, try search API
            const searchApiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(message)}&format=json&origin=*`;
            const searchResponse = await fetch(searchApiUrl);
            const searchData = await searchResponse.json();

            if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
                const firstResult = searchData.query.search[0];
                const pageUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(firstResult.title.replace(/ /g, '_'))}`;
                
                const summaryResponse = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstResult.title)}`);
                const summaryData = await summaryResponse.json();
                
                if (summaryData.extract) {
                    const cleanText = summaryData.extract.replace(/\[\d+\]/g, '');
                    const maxLength = 500;
                    const text = cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
                    
                    return text + `\n\n📚 ${currentLang === 'kk' ? 'Толығырақ:' : 'Подробнее:'} ${pageUrl}`;
                }
            }

            // Fallback response
            return currentLang === 'kk'
                ? `"${message}" туралы ақпарат табылмады. Басқа сұрақ сұраңыз немесе сөздерді өзгертіп көріңіз.`
                : `Информация о "${message}" не найдена. Попробуйте задать другой вопрос или измените формулировку.`;

        } catch (error) {
            console.error('Wikipedia API error:', error);
            return currentLang === 'kk'
                ? 'Қате орын алды. Кейінірек қайталап көріңіз.'
                : 'Произошла ошибка. Попробуйте позже.';
        }
    }
}
