/**
 * Redwan Ahamad Samir - Research Profile
 * Main JavaScript: navigation, soft motion, filters, citations
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollEffects();
    initProjectFilters();
    initReveal();
    initSpotlight();
    initScrollProgress();
    initCursorGlow();
    initCounters();
    initHeroConstellation();
    initPageTransitions();
    initNewsletterForm();
});

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    function setMenu(open) {
        if (!hamburger || !navMenu) return;
        hamburger.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
    }

    if (hamburger) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.setAttribute('tabindex', '0');
        hamburger.addEventListener('click', function () {
            setMenu(!hamburger.classList.contains('active'));
        });
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenu(!hamburger.classList.contains('active'));
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
    });

    document.addEventListener('click', function (e) {
        if (navMenu && navMenu.classList.contains('active') && !e.target.closest('.nav-container')) {
            setMenu(false);
        }
    });

    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   Smooth in-page scrolling
   -------------------------------------------------------------------------- */
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;

            let target = null;
            try { target = document.querySelector(href); } catch (err) { return; }
            if (!target) return;

            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 90,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });
}

/* --------------------------------------------------------------------------
   Reveal on scroll: soft rise, staggered by position inside the parent
   -------------------------------------------------------------------------- */
const REVEAL_SELECTORS = [
    '.featured-card', '.focus-card', '.update-item', '.publication-card',
    '.project-card', '.blog-card', '.cert-card', '.skill-category',
    '.timeline-item', '.overview-card', '.opensource-card', '.info-card',
    '.profile-photo-card', '.research-project', '.newsletter-box',
    '.contact-form-wrapper', '.section-header', '.container > .section-title',
    '.cta-content'
].join(',');

function initReveal() {
    const items = Array.prototype.slice.call(document.querySelectorAll(REVEAL_SELECTORS));
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-in', 'is-settled'); });
        return;
    }

    // Stagger index: position among revealable siblings, capped so nothing waits long
    const counters = new Map();
    items.forEach(function (el) {
        const parent = el.parentElement;
        const n = counters.get(parent) || 0;
        el.style.setProperty('--i', Math.min(n, 5));
        counters.set(parent, n + 1);
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('is-in');
            observer.unobserve(el);
            // After the entrance finishes, drop the stagger delay so hover feels instant
            window.setTimeout(function () { el.classList.add('is-settled'); }, 700);
        });
    }, { threshold: 0.06, rootMargin: '0px 0px 6% 0px' });

    items.forEach(function (el) { observer.observe(el); });
}

/* --------------------------------------------------------------------------
   Cursor spotlight inside cards
   -------------------------------------------------------------------------- */
function initSpotlight() {
    if (!hasFinePointer || prefersReducedMotion) return;

    const cards = document.querySelectorAll(
        '.featured-card, .project-card, .publication-card, .cert-card, .info-card, ' +
        '.opensource-card, .overview-card, .research-project, .blog-card, .timeline-content'
    );

    cards.forEach(function (card) {
        let pending = false, px = 0, py = 0;
        card.addEventListener('pointermove', function (e) {
            px = e.clientX; py = e.clientY;
            if (pending) return;
            pending = true;
            window.requestAnimationFrame(function () {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (px - rect.left) + 'px');
                card.style.setProperty('--my', (py - rect.top) + 'px');
                pending = false;
            });
        }, { passive: true });
    });
}

/* --------------------------------------------------------------------------
   Scroll progress bar and parallax variable
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;

    function update() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const y = window.scrollY;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });

    update();
}

/* --------------------------------------------------------------------------
   Ambient cursor glow that eases toward the pointer
   -------------------------------------------------------------------------- */
function initCursorGlow() {
    if (!hasFinePointer || prefersReducedMotion) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    let x = tx, y = ty;
    let raf = null;

    function loop() {
        x += (tx - x) * 0.09;
        y += (ty - y) * 0.09;
        glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) {
            raf = window.requestAnimationFrame(loop);
        } else {
            raf = null;
        }
    }

    window.addEventListener('pointermove', function (e) {
        tx = e.clientX;
        ty = e.clientY;
        glow.classList.add('on');
        if (!raf) raf = window.requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('pointerleave', function () { glow.classList.remove('on'); });
}

/* --------------------------------------------------------------------------
   Hero stat counters: count up once when they scroll into view
   -------------------------------------------------------------------------- */
function initCounters() {
    const nums = document.querySelectorAll('.stat-number');
    if (!nums.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

    function run(el) {
        const raw = el.textContent.trim();
        const match = raw.match(/^(\d+)(.*)$/);
        if (!match) return;
        const target = parseInt(match[1], 10);
        const suffix = match[2];
        const duration = 900;
        const start = performance.now();
        el.textContent = '0' + suffix;

        function frame(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                // Wait for the hero entrance so the count reads as part of it
                window.setTimeout(function () { run(entry.target); }, 450);
            }
        });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { observer.observe(n); });
}

/* --------------------------------------------------------------------------
   Hero constellation: slow drifting nodes that lean toward the pointer
   -------------------------------------------------------------------------- */
function initHeroConstellation() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let nodes = [];
    const pointer = { x: -9999, y: -9999 };
    let running = true;
    let raf = null;

    function resize() {
        dpr = 1;
        const rect = hero.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.max(22, Math.min(40, Math.round((w * h) / 34000)));
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                r: Math.random() * 1.3 + 0.6
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const link = Math.min(150, w * 0.16);
        // Batch links into 4 opacity buckets: 4 strokes per frame instead of one per link
        const buckets = [[], [], [], []];

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];

            // Drift, wrap at edges
            a.x += a.vx;
            a.y += a.vy;
            if (a.x < -20) a.x = w + 20;
            if (a.x > w + 20) a.x = -20;
            if (a.y < -20) a.y = h + 20;
            if (a.y > h + 20) a.y = -20;

            // Gentle attraction toward the pointer
            const dx = pointer.x - a.x;
            const dy = pointer.y - a.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 32000) {
                a.x += dx * 0.0016;
                a.y += dy * 0.0016;
            }

            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const ddx = a.x - b.x;
                const ddy = a.y - b.y;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                if (dist < link) {
                    buckets[Math.min(3, Math.floor((1 - dist / link) * 4))].push(a.x, a.y, b.x, b.y);
                }
            }
        }

        ctx.lineWidth = 0.7;
        for (let k = 0; k < 4; k++) {
            const seg = buckets[k];
            if (!seg.length) continue;
            ctx.strokeStyle = 'rgba(217,191,140,' + (((k + 0.5) / 4) * 0.22).toFixed(3) + ')';
            ctx.beginPath();
            for (let s = 0; s < seg.length; s += 4) {
                ctx.moveTo(seg[s], seg[s + 1]);
                ctx.lineTo(seg[s + 2], seg[s + 3]);
            }
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(236,214,166,0.7)';
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            ctx.moveTo(n.x + n.r, n.y);
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        }
        ctx.fill();
    }

    let last = 0;
    function loop(now) {
        if (!running) { raf = null; return; }
        // Cap at ~30fps: the drift is slow, and this halves the work
        if (now - last >= 32) { last = now; draw(); }
        raf = window.requestAnimationFrame(loop);
    }

    function start() {
        if (!raf && running) raf = window.requestAnimationFrame(loop);
    }

    resize();
    start();

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
    });

    hero.addEventListener('pointermove', function (e) {
        const rect = hero.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
        pointer.x = pointer.y = -9999;
    });

    // Pause when the hero is off screen or the tab is hidden
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            running = entries[0].isIntersecting && !document.hidden;
            if (running) start();
        }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) start();
    });
}

/* --------------------------------------------------------------------------
   Soft fade when leaving the page through an internal link
   -------------------------------------------------------------------------- */
function initPageTransitions() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('a[href]').forEach(function (a) {
        const href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        if (a.target === '_blank' || a.hasAttribute('download')) return;
        if (/^(mailto:|tel:|https?:)/i.test(href)) return;

        a.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            const url = new URL(a.href, window.location.href);
            // Same-page hash links keep native behaviour
            if (url.pathname === window.location.pathname && url.hash) return;
            e.preventDefault();
            document.body.classList.add('is-leaving');
            window.setTimeout(function () { window.location.href = a.href; }, 220);
        });
    });

    // Restore the page when it comes back from the bfcache
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) document.body.classList.remove('is-leaving');
    });
}

/* --------------------------------------------------------------------------
   Newsletter form (static, no backend)
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
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

/* --------------------------------------------------------------------------
   Project filters with a sliding indicator
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const bar = document.querySelector('.filter-bar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!bar || filterBtns.length === 0) return;

    const indicator = document.createElement('span');
    indicator.className = 'filter-indicator';
    bar.insertBefore(indicator, bar.firstChild);

    function moveIndicator(btn) {
        indicator.style.width = btn.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }

    function placeInitial() {
        const active = document.querySelector('.filter-btn.active') || filterBtns[0];
        bar.classList.add('has-indicator');
        moveIndicator(active);
    }

    placeInitial();
    window.addEventListener('resize', function () {
        const active = document.querySelector('.filter-btn.active');
        if (active) moveIndicator(active);
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            const active = document.querySelector('.filter-btn.active');
            if (active) moveIndicator(active);
        });
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            moveIndicator(this);

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(function (card) {
                const categories = card.getAttribute('data-category') || '';
                const show = filterValue === 'all' || categories.indexOf(filterValue) !== -1;

                if (show) {
                    if (card.classList.contains('is-hidden')) {
                        card.classList.remove('is-hidden');
                        card.classList.add('is-in', 'is-settled', 'is-filtering-out');
                        // Force a frame so the fade-in can run
                        void card.offsetWidth;
                        card.classList.remove('is-filtering-out');
                    }
                } else if (!card.classList.contains('is-hidden')) {
                    card.classList.add('is-filtering-out');
                    window.setTimeout(function () {
                        card.classList.add('is-hidden');
                    }, 300);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   Notifications
   -------------------------------------------------------------------------- */
function showNotification(message, type) {
    type = type || 'info';

    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.setAttribute('role', 'status');

    const content = document.createElement('div');
    content.className = 'notification-content';
    const i = document.createElement('i');
    i.className = 'fas ' + icon;
    const span = document.createElement('span');
    span.textContent = message;
    content.appendChild(i);
    content.appendChild(span);
    notification.appendChild(content);

    document.body.appendChild(notification);

    window.setTimeout(function () { notification.classList.add('show'); }, 60);
    window.setTimeout(function () {
        notification.classList.remove('show');
        window.setTimeout(function () { notification.remove(); }, 500);
    }, 4000);
}

/* --------------------------------------------------------------------------
   Citations
   -------------------------------------------------------------------------- */
function copyCitation(paperId) {
    const citations = {
        paper1: `Rabby, F., Rahman, M., Rajdeep, Hossain, H., Samir, R. A., & Sfarhaan. (2025). Early-Stage Coronary Artery Disease Prediction Using Coronary Angiogram for Stenosis Detection in Low-Resource Settings. International Conference on Big Data, IoT and Machine Learning (BMI 2025).`,

        paper2: `Rabby, F., Rajdeep, Rahman, M., Hossain, H., & Samir, R. A. (2025). Scalable sEMG-Based User-Independent Deep Learning Framework for Assistive Wheelchair Control. International Conference on Big Data, IoT and Machine Learning (BMI 2025).`,

        paper3: `Alamgir, F. M., Samir, R. A., Arafat, S. E., Rahman, S., & Rahman, A. (2026). HornNet: A Two-Tier Deep Learning Framework for Real-Time Vehicle Classification from Acoustic Horn Signatures in Urban Environments. 2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence & Networking (QPAIN).`,

        paper4: `Rahman, S., Islam, R., Samir, R. A., Hossain, M. K., Faruk, M. O., & Kibria, R. (2026). AdaLLM: A Subject-Adaptive RAG Framework Designed for the Question Answering Process of NCTB’s Class-8 Science & BGS Subjects. 2nd International Conference on Advances in Computing, Communication, Electrical, and Smart Systems (iCACCESS 2026).`
    };

    const citation = citations[paperId];
    if (!citation) return;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(citation).then(function () {
            showNotification('Citation copied to clipboard!', 'success');
        }).catch(function () {
            fallbackCopyTextToClipboard(citation);
        });
    } else {
        fallbackCopyTextToClipboard(citation);
    }
}

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
        showNotification(successful ? 'Citation copied to clipboard!' : 'Failed to copy citation', successful ? 'success' : 'error');
    } catch (err) {
        showNotification('Failed to copy citation', 'error');
    }

    document.body.removeChild(textArea);
}

// Console greeting
console.log('%cRedwan Ahamad Samir', 'font-size: 24px; font-weight: bold; color: #d9bf8c;');
console.log('%cAI Researcher & Developer', 'font-size: 14px; color: #aeab9f;');
