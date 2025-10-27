
/* ========================================
   LOAD LENIS LIBRARY FIRST (EXTERNAL)
   ======================================== */
// Add this line in your HTML BEFORE the main script tag:
// <script src="https://unpkg.com/@studio-freight/lenis@1/dist/lenis.min.js"></script>


/* ========================================
   1. LENIS SMOOTH SCROLL INITIALIZATION
   Must run FIRST before any Lenis-dependent code
   ======================================== */
const lenis = new Lenis({
    duration: 1.2,       
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    // Exclude projects right scroll AND testimonials from smooth scroll
    prevent: (node) => {
        return node.closest('.projects-right-scroll, .testimonials-track-container, .projects-showcase.locked') !== null;
    }
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


/* ========================================
   2. CUSTOM CURSOR (GLOBAL UI ELEMENT)
   ======================================== */
(function() {
    'use strict';
    
    // Don't initialize on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }
    
    // Create main cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Create trail particles
    const trailCount = 6;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'custom-cursor-trail';
        trail.style.opacity = (1 - (i / trailCount)) * 0.6;
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Animate trails with progressive delay
        trails.forEach((trail, index) => {
            const delay = (index + 1) * 0.05;
            trail.x += (cursorX - trail.x) * (0.15 - delay);
            trail.y += (cursorY - trail.y) * (0.15 - delay);
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        });
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects for clickable elements
    const clickableElements = 'a, button, .btn, .service-card, .testimonial-card, .faq-card, .project-slide, .nav-menu a, .social-link, [role="button"], [onclick], .menu-btn, .cta-btn, .testimonials-nav';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(clickableElements)) {
            cursor.classList.add('hover');
            trails.forEach(trail => trail.element.style.opacity = '0');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(clickableElements)) {
            cursor.classList.remove('hover');
            trails.forEach((trail, index) => {
                trail.element.style.opacity = (1 - (index / trailCount)) * 0.6;
            });
        }
    });
    
    // Text input hover
    const textInputs = 'input[type="text"], input[type="email"], input[type="tel"], textarea';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches(textInputs)) {
            cursor.classList.add('text-hover');
            trails.forEach(trail => trail.element.style.opacity = '0');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.matches(textInputs)) {
            cursor.classList.remove('text-hover');
            trails.forEach((trail, index) => {
                trail.element.style.opacity = (1 - (index / trailCount)) * 0.6;
            });
        }
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trails.forEach(trail => trail.element.style.opacity = '0');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        trails.forEach((trail, index) => {
            trail.element.style.opacity = (1 - (index / trailCount)) * 0.6;
        });
    });
    
    console.log('%c✨ Custom Cursor Active!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 14px; padding: 6px; font-weight: bold;');
})();


/* ========================================
   3. NAVIGATION & HEADER
   ======================================== */
// Hide nav on scroll-down / show on scroll-up
const nav = document.querySelector('.main-nav');
let lastY = 0;

window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > lastY && y > 200) nav.style.transform = 'translate(-50%, -120%)';
    else nav.style.transform = 'translate(-50%, 0)';
    lastY = y;
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Menu button toggle
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');

if (menuBtn && menuDropdown) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === 'flex' ? 'none' : 'flex';
        menuBtn.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target)) {
            menuDropdown.style.display = 'none';
            menuBtn.classList.remove('open');
        }
    });
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


/* ========================================
   4. HERO SECTION
   ======================================== */
// Animate hero title on load
window.addEventListener('load', () => {
    document.querySelectorAll('.title-text').forEach(el => {
        el.classList.add('animate');
    });
});


/* ========================================
   5. GLOBAL SCROLL ANIMATIONS
   ======================================== */
// Scroll fade-in effect for all sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-fade').forEach(el => {
    observer.observe(el);
});


/* ========================================
   6. STATS SECTION
   ======================================== */
// Animated counter for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                let count = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= number) {
                        stat.textContent = number + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(count) + suffix;
                    }
                }, 40);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.stats-container');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}


/* ========================================
   7. PARALLAX EFFECTS (GLOBAL)
   ======================================== */
// Parallax effect on scroll for orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');
    
    if (orb1) orb1.style.transform = `translateY(${scrolled * 0.5}px)`;
    if (orb2) orb2.style.transform = `translateY(${-scrolled * 0.3}px)`;
    if (orb3) orb3.style.transform = `translateY(${scrolled * 0.4}px)`;
});


/* ========================================
   8. SERVICES SECTION - HORIZONTAL SCROLL
   DEPENDS ON LENIS - Must come after Lenis init
   ======================================== */
// Services progress tracking with Lenis
(function() {
    const servicesSection = document.querySelector('.services-horizontal');
    const slides = document.querySelectorAll('.service-slide');
    const progressFill = document.getElementById('servicesProgress');
    const currentSlideText = document.getElementById('currentSlide');
    const progressIndicator = document.querySelector('.services-progress');
    
    if (!servicesSection || slides.length === 0) return;
    
    let ticking = false;
    
    function updateProgress() {
        // Use Lenis scroll value
        const scrollY = lenis.scroll || window.pageYOffset;
        
        const rect = servicesSection.getBoundingClientRect();
        const sectionTop = scrollY + rect.top;
        const sectionHeight = servicesSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const isInView = rect.top < windowHeight && rect.bottom > 0;
        
        if (!isInView || rect.bottom <= 0) {
            if (progressIndicator) {
                progressIndicator.style.opacity = '0';
                progressIndicator.style.pointerEvents = 'none';
            }
            ticking = false;
            return;
        } else {
            if (progressIndicator) {
                progressIndicator.style.opacity = '1';
                progressIndicator.style.pointerEvents = 'auto';
            }
        }
        
        const scrolledIntoSection = Math.max(0, scrollY - sectionTop);
        const maxScroll = sectionHeight - windowHeight;
        const progress = Math.max(0, Math.min(100, (scrolledIntoSection / maxScroll) * 100));
        
        const slideProgress = scrolledIntoSection / windowHeight;
        const currentSlide = Math.max(1, Math.min(slides.length, Math.ceil(slideProgress)));
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentSlideText) currentSlideText.textContent = String(currentSlide).padStart(2, '0');
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }
    
    lenis.on('scroll', requestTick);
    window.addEventListener('scroll', requestTick, { passive: true });
    
    updateProgress();
    
    console.log('%c📊 Services Progress Active!', 'background: #10B981; color: white; padding: 6px; font-weight: bold;');
})();

// Service cards tilt effect & slider
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Service slider controls
const track = document.getElementById('sliderTrack');
if (track) {
    const cards = track.querySelectorAll('.service-card');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let index = 0;
    const cardWidth = cards[0]?.offsetWidth + 32;

    function scrollToIndex() {
        track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            index = (index + 1) % cards.length;
            scrollToIndex();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            index = (index - 1 + cards.length) % cards.length;
            scrollToIndex();
        });
    }
}

// Smooth performance for ticker animations
(function() {
    const tickers = document.querySelectorAll('[class*="ticker"]');
    
    tickers.forEach(ticker => {
        const track = ticker.querySelector('[class*="content"], [class*="track"], [class*="line"], [class*="scroll"]');
        if (!track) return;
        
        track.style.transform = 'translateZ(0)';
        track.style.backfaceVisibility = 'hidden';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, { threshold: 0.1 });
        
        observer.observe(ticker);
    });
})();


/* ========================================
   9. PROJECTS SECTION
   ======================================== */
(function() {
    'use strict';
    
    const projectSlides = document.querySelectorAll('.project-slide');
    
    if (projectSlides.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    projectSlides.forEach(slide => {
        observer.observe(slide);
    });
    
    // Parallax effect on images
    projectSlides.forEach(slide => {
        const image = slide.querySelector('.project-image');
        
        if (!image) return;
        
        slide.addEventListener('mousemove', (e) => {
            const rect = slide.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 10;
            const moveY = (y - centerY) / centerY * 10;
            
            image.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        });
        
        slide.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1.1)';
        });
    });
    
    console.log('%c✨ Projects Section Active!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 14px; padding: 8px; font-weight: bold;');
})();


/* ========================================
   10. ABOUT SECTION
   ======================================== */
(function() {
    'use strict';
    
    // AOS (Animate On Scroll)
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
        const heroSection = document.querySelector('.about-hero-section');
        if (heroSection) observer.observe(heroSection);
    }
    
    // Animate hero title
    document.querySelectorAll('.about-hero-title .title-line').forEach(el =>
        el.classList.add('aos-animate')
    );
    
    // Parallax for background layers
    function initParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const aboutSection = document.querySelector('.about-revolution');
            
            if (!aboutSection) return;
            
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                layers.forEach((layer, index) => {
                    const speed = (index + 1) * 0.1;
                    const yPos = -(scrolled * speed);
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            }
        }, { passive: true });
    }
    
    // Animated counters
    function animateCounters() {
        const statValues = document.querySelectorAll('.stat-value[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const count = parseInt(target.dataset.count);
                    const duration = 2000;
                    const increment = count / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= count) {
                            target.textContent = count + (count === 98 ? '%' : '+');
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + (count === 98 ? '%' : '+');
                        }
                    }, 16);
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statValues.forEach(stat => observer.observe(stat));
    }
    
    // Banner scroll pause on hover
    function initBannerHover() {
        const banners = document.querySelectorAll('.scroll-banner');
        
        banners.forEach(banner => {
            const track = banner.querySelector('.banner-track');
            
            banner.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });
            
            banner.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        });
    }
    
    // 3D tilt for cards
    function init3DTilt() {
        const cards = document.querySelectorAll('.grid-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * 5;
                const rotateY = ((centerX - x) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
    
    // Value items stagger animation
    function initValueItemsAnimation() {
        const valuesList = document.querySelector('.values-list');
        
        if (!valuesList) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.value-item');
                    
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateX(-30px)';
                            
                            setTimeout(() => {
                                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                                item.style.opacity = '1';
                                item.style.transform = 'translateX(0)';
                            }, 50);
                        }, index * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(valuesList);
    }
    
    // Magnetic CTA button
    function initMagneticButton() {
        const ctaBtn = document.querySelector('.cta-button-about');
        
        if (!ctaBtn) return;
        
        ctaBtn.addEventListener('mousemove', (e) => {
            const rect = ctaBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            ctaBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        ctaBtn.addEventListener('mouseleave', () => {
            ctaBtn.style.transform = 'translate(0, 0)';
        });
    }
    
    // Initialize all
    function init() {
        initAOS();
        initParallax();
        animateCounters();
        initBannerHover();
        init3DTilt();
        initValueItemsAnimation();
        initMagneticButton();
        
        console.log('%c🚀 About Section Active!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 16px; padding: 10px; font-weight: bold;');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/* ========================================
   11. TESTIMONIALS SECTION
   ======================================== */
// Testimonials slider with infinite loop
(function() {
    const track = document.getElementById('testimonialsTrack');
    const container = document.getElementById('testimonialsTrackContainer');
    const prevBtn = document.getElementById('testimonialsNavPrev');
    const nextBtn = document.getElementById('testimonialsNavNext');
    const dotsContainer = document.getElementById('testimonialsDots');
    
    if (!track || !container) return;
    
    const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
    const cardWidth = originalCards[0]?.offsetWidth + 32;
    
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;
    let isTransitioning = false;
    
    function setupInfiniteLoop() {
        track.innerHTML = '';
        
        originalCards.slice(-2).forEach(card => {
            track.appendChild(card.cloneNode(true));
        });
        
        originalCards.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });
        
        originalCards.slice(0, 2).forEach(card => {
            track.appendChild(card.cloneNode(true));
        });
        
        currentIndex = 2;
        track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        originalCards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'testimonial-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i + 2));
            dotsContainer.appendChild(dot);
        });
    }
    
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        let dotIndex = (currentIndex - 2) % originalCards.length;
        if (dotIndex < 0) dotIndex += originalCards.length;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }
    
    function goToSlide(index, animate = true) {
        if (isTransitioning) return;
        
        currentIndex = index;
        const offset = -currentIndex * cardWidth;
        
        if (animate) {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
        
        if (animate) {
            isTransitioning = true;
            setTimeout(() => {
                handleInfiniteLoop();
                isTransitioning = false;
            }, 500);
        }
    }
    
    function handleInfiniteLoop() {
        if (currentIndex < 2) {
            currentIndex = originalCards.length + currentIndex;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        }
        
        if (currentIndex >= originalCards.length + 2) {
            currentIndex = 2 + (currentIndex - originalCards.length - 2);
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        }
        
        updateDots();
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex - 1);
    }
    
    function handleDragStart(e) {
        if (isTransitioning) return;
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = startX;
        track.style.transition = 'none';
        container.style.cursor = 'grabbing';
        stopAutoplay();
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        dragOffset = currentX - startX;
        const baseOffset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${baseOffset + dragOffset}px)`;
    }
    
    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.cursor = 'grab';
        
        const threshold = cardWidth / 4;
        if (dragOffset < -threshold) {
            nextSlide();
        } else if (dragOffset > threshold) {
            prevSlide();
        } else {
            goToSlide(currentIndex);
        }
        
        dragOffset = 0;
        startAutoplay();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });
    
    container.addEventListener('mousedown', handleDragStart);
    container.addEventListener('mousemove', handleDragMove);
    container.addEventListener('mouseup', handleDragEnd);
    container.addEventListener('mouseleave', handleDragEnd);
    
    container.addEventListener('touchstart', handleDragStart, { passive: false });
    container.addEventListener('touchmove', handleDragMove, { passive: false });
    container.addEventListener('touchend', handleDragEnd);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        }
        if (e.key === 'ArrowRight') {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        }
    });
    
    let autoplayInterval;
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    
    setupInfiniteLoop();
    createDots();
    updateDots();
    startAutoplay();
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardWidth = track.querySelector('.testimonial-card')?.offsetWidth + 32;
            if (Math.abs(newCardWidth - cardWidth) > 5) {
                location.reload();
            }
        }, 250);
    });
})();

// Testimonials reviews section (scrollable reviews)
(function() {
    const testimonials = [
        {name:"Sanidhya", date:"August 2024", rating:4, text:"Chandan and his team have been managing our multiple social media accounts and website projects for several clients. Their work quality is consistently amazing.", avatar:"https://randomuser.me/api/portraits/men/41.jpg"},
        {name:"Udit Singh", date:"July 2024", rating:5, text:"The project exceeded our expectations! Chandan and his team delivered exceptional results on time and maintained excellent communication throughout.", avatar:"https://randomuser.me/api/portraits/men/42.jpg"},
        {name:"Suhas", date:"June 2024", rating:5, text:"Working with ElitesDev was an exceptional experience from start to finish. Truly proud to have worked with such a talented team.", avatar:"https://randomuser.me/api/portraits/men/43.jpg"},
        {name:"Joseph", date:"May 2024", rating:5, text:"They delivered our e-commerce platform on schedule with all requested features. The ongoing support is excellent.", avatar:"https://randomuser.me/api/portraits/men/55.jpg"},
        {name:"Aneesh", date:"April 2024", rating:5, text:"The team at ElitesDev is simply fantastic! Their attention to detail and responsive communication made the process stress-free.", avatar:"https://randomuser.me/api/portraits/men/60.jpg"},
        {name:"Amit Jain", date:"March 2024", rating:4, text:"ElitesDev transformed our business website beautifully. Their technical and creative balance is remarkable.", avatar:"https://randomuser.me/api/portraits/men/70.jpg"}
    ];

    function starString(n) {
        return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
    }
    
    const reviewsContainer = document.getElementById('testimonialsReviewsContainer');
    const scrollContainer = document.querySelector('.testimonials-right');
    const scrollThumb = document.getElementById('testimonialsScrollThumb');

    function render() {
        if (!reviewsContainer) return;
        
        reviewsContainer.innerHTML = '';
        testimonials.forEach(t => {
            const card = document.createElement('article');
            card.className = 'testimonials-card';
            card.innerHTML = `
                <div class="testimonials-card-head">
                    <div class="testimonials-author">
                        <div class="testimonials-avatar"><img src="${t.avatar}" alt="${t.name}"/></div>
                        <div class="testimonials-meta">
                            <div class="testimonials-name">${t.name}</div>
                            <div class="testimonials-date">${t.date}</div>
                        </div>
                    </div>
                    <div class="testimonials-stars-inline">${starString(t.rating)}</div>
                </div>
                <div class="testimonials-text">${t.text}</div>
            `;
            reviewsContainer.appendChild(card);
        });
    }

    function updateScrollIndicator() {
        if (!scrollContainer || !scrollThumb) return;
        
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollTop = scrollContainer.scrollTop;
        
        const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
        const thumbTop = (scrollTop / scrollHeight) * clientHeight;
        
        scrollThumb.style.height = thumbHeight + 'px';
        scrollThumb.style.top = thumbTop + 'px';
    }

    render();

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateScrollIndicator);
        setTimeout(updateScrollIndicator, 100);
    }
})();


/* ========================================
   12. FAQ SECTION
   ======================================== */
// FAQ accordion toggle
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    allFaqItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    faqItem.classList.toggle('active');
}

// Enhanced FAQ toggle
function toggleFaqEnhanced(element) {
    const allCards = document.querySelectorAll('.faq-card');
    const currentCard = element;
    const isActive = currentCard.classList.contains('active');
    
    allCards.forEach((card, index) => {
        if (card !== currentCard && card.classList.contains('active')) {
            setTimeout(() => {
                card.classList.remove('active');
            }, index * 50);
        }
    });
    
    setTimeout(() => {
        currentCard.classList.toggle('active');
        
        if (!isActive && window.innerWidth < 768) {
            setTimeout(() => {
                currentCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }, 100);
}

// Animate FAQ cards on scroll
const faqObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.faq-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
            faqObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const faqGrid = document.querySelector('.faq-grid');
if (faqGrid) {
    faqObserver.observe(faqGrid);
}

// Keyboard navigation for FAQ
document.addEventListener('keydown', (e) => {
    const activeCard = document.querySelector('.faq-card.active');
    if (!activeCard) return;
    
    if (e.key === 'Escape') {
        activeCard.classList.remove('active');
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const allCards = Array.from(document.querySelectorAll('.faq-card'));
        const currentIndex = allCards.indexOf(activeCard);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % allCards.length;
        } else {
            nextIndex = (currentIndex - 1 + allCards.length) % allCards.length;
        }
        
        activeCard.classList.remove('active');
        setTimeout(() => {
            toggleFaqEnhanced(allCards[nextIndex]);
        }, 200);
    }
});

// Haptic feedback for mobile
function triggerHaptic() {
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

document.querySelectorAll('.faq-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.closest('a')) {
            triggerHaptic();
        }
    });
});

// Animate FAQ stats
const statsObservers = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.faq-stat-number');
            numbers.forEach(num => {
                const text = num.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                if (isNaN(value)) return;
                
                let count = 0;
                const increment = value / 60;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= value) {
                        num.textContent = value + suffix;
                        clearInterval(timer);
                    } else {
                        num.textContent = Math.floor(count) + suffix;
                    }
                }, 30);
            });
            statsObservers.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.faq-stats-row');
if (statsRow) {
    statsObservers.observe(statsRow);
}

// FAQ orbs parallax
let faqTicking = false;
function updateFaqOrbsParallax() {
    const scrolled = window.pageYOffset;
    const faqSection = document.querySelector('.faq-section-enhanced');
    
    if (!faqSection) return;
    
    const rect = faqSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        const orb1 = faqSection.querySelector('.faq-orb-1');
        const orb2 = faqSection.querySelector('.faq-orb-2');
        const orb3 = faqSection.querySelector('.faq-orb-3');
        
        const offset = (window.innerHeight - rect.top) * 0.5;
        
        if (orb1) orb1.style.transform = `translate(0, ${offset * 0.3}px)`;
        if (orb2) orb2.style.transform = `translate(0, ${-offset * 0.2}px)`;
        if (orb3) orb3.style.transform = `translate(0, ${offset * 0.25}px)`;
    }
    
    faqTicking = false;
}

window.addEventListener('scroll', () => {
    if (!faqTicking) {
        window.requestAnimationFrame(updateFaqOrbsParallax);
        faqTicking = true;
    }
}, { passive: true });

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

console.log('%c❓ FAQ Section Enhanced!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 16px; padding: 8px; font-weight: bold;');


/* ========================================
   13. BOOKING FORM SECTION
   ======================================== */
(function() {
    const form = document.getElementById('bookingFormRedesigned');
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const submitBtn = form?.querySelector('.submit-btn-redesigned');
    
    if (!form) return;
    
    // Character counter
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            charCount.textContent = length;
            
            const counter = charCount.parentElement;
            counter.classList.remove('warning', 'limit');
            
            if (length > 400) {
                counter.classList.add('warning');
            }
            if (length >= 500) {
                counter.classList.add('limit');
                textarea.value = textarea.value.substring(0, 500);
                charCount.textContent = 500;
            }
        });
    }
    
    // Form field animations
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!submitBtn) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (!data.fullName || !data.email || !data.service || !data.message) {
            alert('Please fill in all required fields');
            return;
        }
        
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.style.transform = 'scale(0.98)';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Form submitted:', data);
            
            submitBtn.querySelector('.btn-text').textContent = 'Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            setTimeout(() => {
                form.reset();
                if (charCount) charCount.textContent = '0';
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                submitBtn.style.transform = 'scale(1)';
            }, 3000);
            
        } catch (error) {
            submitBtn.querySelector('.btn-text').textContent = 'Error';
            submitBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                submitBtn.style.transform = 'scale(1)';
            }, 3000);
        }
    });
    
    // Animate form on scroll
    const formWrapper = document.querySelector('.booking-form-wrapper');
    const formObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                formObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    if (formWrapper) {
        formObserver.observe(formWrapper);
    }
    
    console.log('%c📝 Booking Form Enhanced!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 14px; padding: 6px; font-weight: bold;');
})();


/* ========================================
   14. FOOTER SECTION
   ======================================== */
// Newsletter subscription
const newsletterBtn = document.querySelector('footer button');
const newsletterInput = document.querySelector('footer input[type="email"]');

if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value;
        if (email && email.includes('@')) {
            newsletterBtn.textContent = 'Subscribed! ✓';
            newsletterBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            newsletterInput.value = '';
            
            setTimeout(() => {
                newsletterBtn.textContent = 'Subscribe';
                newsletterBtn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
            }, 3000);
        } else {
            newsletterInput.style.borderColor = '#EF4444';
            setTimeout(() => {
                newsletterInput.style.borderColor = 'rgba(255, 215, 0, 0.3)';
            }, 1000);
        }
    });
}

// Footer scroll animation
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.style.opacity = '0';
                footer.style.transform = 'translateY(50px)';
                setTimeout(() => {
                    footer.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    footer.style.opacity = '1';
                    footer.style.transform = 'translateY(0)';
                }, 100);
                footerObserver.unobserve(footer);
            }
        });
    }, { threshold: 0.1 });
    
    if (footer) footerObserver.observe(footer);
});


/* ========================================
   15. CONSOLE MESSAGES
   ======================================== */
console.log('%c🚀 Welcome to ElitesDev!', 'background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c✨ We build amazing digital experiences!', 'color: #FFD700; font-size: 14px;');

