/**
 * Redwan Ahamad Samir - Research Profile
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initProjectFilters();
    initAnimations();
    initNewsletterForm();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
    
    // Navbar background on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Scroll effects and smooth scrolling
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const featured = document.querySelector('#featured');
            if (featured) {
                window.scrollTo({
                    top: featured.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/**
 * Newsletter form handling (static - no backend)
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (!email) {
                showNotification('Please enter your email', 'error');
                return;
            }
            
            showNotification('Thank you for subscribing!', 'success');
            this.reset();
        });
    }
}

/**
 * Project filtering functionality
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.featured-card, .focus-card, .update-item, .publication-card, ' +
        '.project-card, .blog-card, .cert-card, .skill-category, .timeline-item'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add animated class styles
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Notification system
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? 'rgba(91, 141, 239, 0.95)' : type === 'error' ? 'rgba(239, 91, 91, 0.95)' : 'rgba(124, 58, 237, 0.95)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Copy citation to clipboard
 */
function copyCitation(paperId) {
    const citations = {
        paper1: `Rabby, F., Rahman, M., Rajdeep, Hossain, H., Samir, R. A., & Sfarhaan. (2025). Early-Stage Coronary Artery Disease Prediction Using Coronary Angiogram for Stenosis Detection in Low-Resource Settings. International Conference on Big Data, IoT and Machine Learning (BMI 2025).`,
        
        paper2: `Rabby, F., Rajdeep, Rahman, M., Hossain, H., & Samir, R. A. (2025). Scalable sEMG-Based User-Independent Deep Learning Framework for Assistive Wheelchair Control. International Conference on Big Data, IoT and Machine Learning (BMI 2025).`,
        
        paper3: `Alamgir, F. M., Samir, R. A., Arafat, S. E., Rahman, S., & Rahman, A. (2026). HornNet: A Two-Tier Deep Learning Framework for Real-Time Vehicle Classification from Acoustic Horn Signatures in Urban Environments. 2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence & Networking (QPAIN).`
    };
    
    const citation = citations[paperId];
    if (citation) {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(citation).then(() => {
                showNotification('Citation copied to clipboard!', 'success');
            }).catch(() => {
                fallbackCopyTextToClipboard(citation);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyTextToClipboard(citation);
        }
    }
}

/**
 * Fallback copy function for older browsers
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Citation copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy citation', 'error');
        }
    } catch (err) {
        showNotification('Failed to copy citation', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Typing effect for hero section (optional enhancement)
 */
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;
    
    const text = element.getAttribute('data-text');
    const speed = 100;
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Reading progress indicator
 */
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 999;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize reading progress on blog and research pages
if (document.body.classList.contains('page-blog') || document.body.classList.contains('page-research')) {
    initReadingProgress();
}

/**
 * Dark mode toggle (if needed in future)
 */
function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;
    
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'false') {
        document.body.classList.add('light-mode');
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        localStorage.setItem('darkMode', isDark);
    });
}

// Console greeting
console.log('%cRedwan Ahamad Samir', 'font-size: 24px; font-weight: bold; color: #5b8def;');
console.log('%cAI Researcher & Developer', 'font-size: 14px; color: #a0a0b0;');
console.log('%cWelcome to my research profile!', 'font-size: 12px; color: #6a6a7a;');