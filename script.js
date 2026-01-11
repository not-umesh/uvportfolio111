/* ============================================
   UMESH VERMA PORTFOLIO - JAVASCRIPT
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initStarField();
    initTypingEffect();
    initNavbar();
    initScrollReveal();
    initSmoothScroll();
});

/* ============================================
   STAR FIELD ANIMATION
   ============================================ */
function initStarField() {
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Star properties
    const stars = [];
    const numStars = 200;
    const maxStarSize = 2;
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * maxStarSize,
            opacity: Math.random(),
            speed: Math.random() * 0.5 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005
        });
    }
    
    // Shooting stars
    const shootingStars = [];
    const maxShootingStars = 3;
    
    function createShootingStar() {
        if (shootingStars.length < maxShootingStars && Math.random() < 0.005) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: 0,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 10 + 5,
                opacity: 1
            });
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        stars.forEach(star => {
            // Twinkle effect
            star.opacity += star.twinkleSpeed;
            if (star.opacity <= 0.3 || star.opacity >= 1) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            // Move star slowly
            star.y += star.speed * 0.1;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        
        // Create and draw shooting stars
        createShootingStar();
        
        shootingStars.forEach((shootingStar, index) => {
            // Draw shooting star with trail
            const gradient = ctx.createLinearGradient(
                shootingStar.x, shootingStar.y,
                shootingStar.x - shootingStar.length, shootingStar.y - shootingStar.length * 0.5
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(
                shootingStar.x - shootingStar.length,
                shootingStar.y - shootingStar.length * 0.5
            );
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Move shooting star
            shootingStar.x += shootingStar.speed;
            shootingStar.y += shootingStar.speed * 0.5;
            shootingStar.opacity -= 0.01;
            
            // Remove if off screen or faded
            if (shootingStar.x > canvas.width || shootingStar.y > canvas.height || shootingStar.opacity <= 0) {
                shootingStars.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const typedText = document.getElementById('typed-text');
    const titles = [
        'AI/ML Enthusiast',
        'Web Developer',
        'Problem Solver',
        'Tech Explorer',
        'Code Craftsman'
    ];
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typedText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentTitle.length) {
            // Pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
}

/* ============================================
   NAVBAR FUNCTIONALITY
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
    // Elements to reveal
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .skill-category, .project-card, .contact-card'
    );
    
    // Add reveal class
    revealElements.forEach(el => el.classList.add('reveal'));
    
    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   EASTER EGG - KONAMI CODE
   ============================================ */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateRainbowMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateRainbowMode() {
    document.body.style.animation = 'rainbow 5s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Reset after 10 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */
console.log(`
%c👋 Hey there, curious developer!

%cWelcome to Umesh Verma's Portfolio
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%cThanks for checking out the code!
Feel free to reach out:
📧 umeshv642@gmail.com
💼 linkedin.com/in/uv-mv
🐙 github.com/Umesh-codes

%c🚀 Happy Coding!
`,
'color: #8b5cf6; font-size: 20px; font-weight: bold;',
'color: #06b6d4; font-size: 16px;',
'color: #a78bfa;',
'color: #a1a1aa; font-size: 12px;',
'color: #f472b6; font-size: 14px; font-weight: bold;'
);
