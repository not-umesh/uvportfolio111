/* ============================================
   UMESH VERMA PORTFOLIO - 3D BIKE MODEL (CLEAN)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');
    init3DScene();
    initTypingEffect();
    initNavbar();
    initSmoothScrollAnimations();
    initSmoothScroll();
});

/* ============================================
   THREE.JS - HOLOGRAPHIC APACHE BIKE
   ============================================ */
function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found!');
        return;
    }

    console.log('✅ Canvas container found');

    // Scene
    const scene = new THREE.Scene();
    // Removed thick fog for a clearer, sharper aesthetic

    // Camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(4, 2, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    console.log('✅ Three.js scene created');

    // Apache-inspired colors
    const bronzeColor = 0xcd7f32;
    const redAccent = 0xff3333;
    const cyanGlow = 0x00ffff;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(bronzeColor, 0.7);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(redAccent, 2, 20);
    rimLight.position.set(0, 2, -5);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(cyanGlow, 1.5, 15);
    accentLight.position.set(-3, 1, 3);
    scene.add(accentLight);

    // Load TVS Apache Bike Model
    let bikeModel = null;
    let sharedMaterials = [];
    const loader = new THREE.GLTFLoader();

    console.log('🏍️ Loading Apache bike model...');

    // Load model directly from GitHub Raw (Verified working with CORS)
    const modelUrl = 'https://raw.githubusercontent.com/not-umesh/uvportfolio111/main/apache-bike-model.glb';
    console.log('🔄 Loading model from cloud:', modelUrl);

    loader.load(
        modelUrl,
        (gltf) => {
            console.log('✅ Model loaded from cloud!');
            bikeModel = gltf.scene;

            // Color palette
            const colors = [
                { wire: 0xff3333, base: 0x330000, name: 'Red' },      // Red
                { wire: 0xffd700, base: 0x332200, name: 'Gold' },     // Gold
                { wire: 0xaa00ff, base: 0x1a0033, name: 'Purple' },   // Purple
                { wire: 0x00d4ff, base: 0x001a33, name: 'Blue' },     // Light Blue
                { wire: 0x00ff88, base: 0x001a0d, name: 'Cyan' }      // Cyan
            ];

            // Create shared materials to drastically reduce draw calls and memory
            sharedMaterials = colors.map(c => ({
                base: new THREE.MeshStandardMaterial({
                    color: c.base,
                    metalness: 0.9,
                    roughness: 0.1,
                    transparent: true,
                    opacity: 0.3,
                    emissive: new THREE.Color(c.wire),
                    emissiveIntensity: 1.0
                }),
                wire: new THREE.LineBasicMaterial({
                    color: c.wire,
                    transparent: true,
                    opacity: 0.8
                })
            }));

            let meshIndex = 0;

            bikeModel.traverse((child) => {
                if (child.isMesh) {
                    // Cycle through colors
                    const colorIndex = Math.floor(meshIndex / 5) % colors.length;
                    const mats = sharedMaterials[colorIndex];

                    // Apply shared material
                    child.material = mats.base;

                    // Apply shared wireframe material
                    const wireGeo = new THREE.EdgesGeometry(child.geometry);
                    const wireframe = new THREE.LineSegments(wireGeo, mats.wire);
                    child.add(wireframe);

                    meshIndex++;
                }
            });

            console.log(`✅ Applied shared materials to ${meshIndex} meshes`);

            // Position bike - bigger, centered, front-facing
            bikeModel.scale.set(5.5, 5.5, 5.5); // Larger
            bikeModel.position.set(0, 0, 0); // Centered
            bikeModel.rotation.y = 0; // Front-facing (headlight toward camera)

            scene.add(bikeModel);
            console.log('✅ Bike added to scene');
        },
        (xhr) => {
            if (xhr.total > 0) {
                console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
            }
        },
        (error) => {
            console.error('❌ Failed to load:', error);
        }
    );

    // === NEW ATTRACTIVE BACKGROUND: CYBERPUNK/SYNTHWAVE THEME ===

    // 1. Moving Grid Floor
    const gridHelper = new THREE.GridHelper(60, 60, cyanGlow, 0x1a1a2e);
    gridHelper.position.y = -2.5;
    gridHelper.material.opacity = 0.4;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 2. High-Tech Glowing Data Particles
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorOptions = [cyanGlow, redAccent, bronzeColor, 0xaa00ff];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePos[i3] = (Math.random() - 0.5) * 40; // x spread
        particlePos[i3 + 1] = (Math.random() - 0.5) * 30; // y spread
        particlePos[i3 + 2] = (Math.random() - 0.5) * 40; // z spread

        const c = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
        particleColors[i3] = c.r;
        particleColors[i3 + 1] = c.g;
        particleColors[i3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // CURSOR TRACKING
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const onMouseMove = (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouchMove = (e) => {
        if (e.touches.length > 0) {
            targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);

    // DOUBLE-CLICK EASTER EGG - Click on canvas to reveal message
    const codingMessages = [
        "🏍️ Umesh.ride() executed successfully!",
        "console.log('This is Umesh\\'s Apache!');",
        "// Built with ❤️ by Umesh Verma",
        "git commit -m 'Umesh owns this beast'",
        "class Apache extends UmeshBike { }",
        "const owner = 'Umesh'; // No bugs here!",
        "npm install umesh-apache-rtr-160",
        "sudo chown umesh:dev /bike/apache",
        "while(true) { umesh.ride(apache); }",
        "/* Powered by Umesh's Code Engine */"
    ];

    // Create message display element - small and subtle
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,20,40,0.5);
        backdrop-filter: blur(10px);
        color: #00ffff;
        font-family: 'Space Grotesk', monospace;
        font-size: 0.9rem;
        padding: 12px 25px;
        border-radius: 8px;
        border: 1px solid rgba(0,255,255,0.3);
        box-shadow: 0 0 15px rgba(0,255,255,0.2);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
    `;
    document.body.appendChild(messageDiv);

    let messageTimeout;

    // Double-click ONLY on bike area shows easter egg
    const canvasContainer = document.getElementById('canvas-container');
    console.log('Canvas container found:', canvasContainer);

    if (canvasContainer) {
        canvasContainer.addEventListener('dblclick', () => {
            alert('Double-click detected! Easter egg triggered!');

            // Show random coding message
            const randomMessage = codingMessages[Math.floor(Math.random() * codingMessages.length)];
            messageDiv.textContent = randomMessage;
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translate(-50%, -50%) scale(1)';

            // Hide after 2 seconds
            clearTimeout(messageTimeout);
            messageTimeout = setTimeout(() => {
                messageDiv.style.opacity = '0';
            }, 2000);
        });
    } else {
        console.error('Canvas container not found!');
    }

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Animate bike
        if (bikeModel) {
            bikeModel.rotation.y = elapsed * 0.12; // Slow rotation
            bikeModel.position.y = Math.sin(elapsed * 0.7) * 0.12; // Gentle float around center
            bikeModel.rotation.x = mouseY * 0.12;
            bikeModel.rotation.z = -mouseX * 0.06;

            // Color palette for smooth transitions
            const colorPalette = [
                0xff3333, // Red
                0xffd700, // Gold
                0xaa00ff, // Purple
                0x00d4ff, // Cyan
                0x00ff88, // Green
                0xff6600  // Orange
            ];

            // Slow color cycling - 10 seconds per full cycle
            const colorCycleSpeed = 0.1;
            const colorIndex = (elapsed * colorCycleSpeed) % colorPalette.length;
            const currentColorIdx = Math.floor(colorIndex);
            const nextColorIdx = (currentColorIdx + 1) % colorPalette.length;
            const mixAmount = colorIndex - currentColorIdx;

            // Interpolate between current and next color
            const currentColor = new THREE.Color(colorPalette[currentColorIdx]);
            const nextColor = new THREE.Color(colorPalette[nextColorIdx]);
            const mixedColor = currentColor.clone().lerp(nextColor, mixAmount);

            // Pulse glow intensity
            const glowPulse = 0.2 + Math.sin(elapsed * 1.5) * 0.15; // 0.05 to 0.35

            // Apply updates to the 5 shared materials instead of traversing all meshes
            sharedMaterials.forEach(mats => {
                // Smoothly change color
                mats.base.emissive.copy(mixedColor);
                // Pulse glow intensity
                mats.base.emissiveIntensity = glowPulse;
                // Pulse opacity slightly
                mats.base.opacity = 0.08 + Math.sin(elapsed * 1.2) * 0.03;

                // Pulse wireframe
                mats.wire.color.copy(mixedColor);
                mats.wire.opacity = 0.5 + Math.sin(elapsed * 2) * 0.2;
            });
        } // Closing brace for if(bikeModel)

        // Animate Grid - moving forward effect
        gridHelper.position.z = (elapsed * 2) % 1;

        // Animate new data particles
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

        // Camera movement
        camera.position.x = 4 + mouseX * 1.5;
        camera.position.y = 2 + mouseY * 1.2;
        camera.lookAt(0.5, 0, 0);

        // Animate lights
        rimLight.position.x = Math.sin(elapsed * 0.5) * 3;
        rimLight.intensity = 2 + Math.sin(elapsed * 2) * 0.4;
        accentLight.position.z = Math.cos(elapsed * 0.7) * 3;

        renderer.render(scene, camera);
    }

    animate();
    console.log('✅ Animation loop started');

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

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
