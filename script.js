/* ============================================
   UMESH VERMA PORTFOLIO - 3D BIKE MODEL (CLEAN)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');
    initTypingEffect();
    initNavbar();
    initSmoothScrollAnimations();
    initSmoothScroll();

    // Hide Spline Watermark
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const interval = setInterval(() => {
            const logo = splineViewer.shadowRoot ? splineViewer.shadowRoot.querySelector('#logo') : null;
            if (logo) {
                logo.remove();
                clearInterval(interval);
            }
        }, 100);
        setTimeout(() => clearInterval(interval), 10000); // safety fallback
    }
});

/* ============================================
   GSAP SMOOTH SCROLL ANIMATIONS
   ============================================ */
function initSmoothScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.defaults({
        toggleActions: "play none none reverse",
        start: "top 85%"
    });

    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: { trigger: header }
            }
        );
    });

    gsap.fromTo(".about-img-wrapper",
        { x: -60, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: "#about", start: "top 75%" }
        }
    );

    gsap.fromTo(".about-text",
        { x: 60, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15,
            scrollTrigger: { trigger: "#about", start: "top 75%" }
        }
    );

    gsap.fromTo(".skill-category",
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.15,
            scrollTrigger: { trigger: "#skills", start: "top 75%" }
        }
    );

    gsap.fromTo(".project-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
            y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: "#projects", start: "top 75%" }
        }
    );

    gsap.fromTo(".contact-card",
        { y: 30, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1,
            scrollTrigger: { trigger: "#contact", start: "top 80%" }
        }
    );
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;

    const titles = ['AI Engineer', 'Web Developer', 'Problem Solver', 'Tech Explorer'];
    let titleIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            typedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            typedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 800);
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                const offset = 70;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}
