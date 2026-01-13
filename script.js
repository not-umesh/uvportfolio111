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
    scene.fog = new THREE.Fog(0x0a0a0f, 10, 35);

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
    const loader = new THREE.GLTFLoader();

    console.log('🏍️ Loading Apache bike model...');

    loader.load(
        'apache-bike-model.glb',
        (gltf) => {
            console.log('✅ Model loaded!');
            bikeModel = gltf.scene;

            // Color palette
            const colors = [
                { wire: 0xff3333, base: 0x330000, name: 'Red' },      // Red
                { wire: 0xffd700, base: 0x332200, name: 'Gold' },     // Gold
                { wire: 0xaa00ff, base: 0x1a0033, name: 'Purple' },   // Purple
                { wire: 0x00d4ff, base: 0x001a33, name: 'Blue' },     // Light Blue
                { wire: 0x00ff88, base: 0x001a0d, name: 'Cyan' }      // Cyan
            ];

            let meshIndex = 0;

            bikeModel.traverse((child) => {
                if (child.isMesh) {
                    // Cycle through colors - change color every few meshes
                    const colorIndex = Math.floor(meshIndex / 5) % colors.length;
                    const { wire, base, name } = colors[colorIndex];

                    console.log(`Mesh ${meshIndex}: ${name}`);

                    // Apply holographic material
                    child.material = new THREE.MeshStandardMaterial({
                        color: base,
                        metalness: 0.9,
                        roughness: 0.1,
                        transparent: true,
                        opacity: 0.08,
                        emissive: new THREE.Color(wire),
                        emissiveIntensity: 0.15
                    });

                    // Apply wireframe
                    const wireGeo = new THREE.EdgesGeometry(child.geometry);
                    const wireMat = new THREE.LineBasicMaterial({
                        color: wire,
                        transparent: true,
                        opacity: 0.5
                    });
                    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
                    child.add(wireframe);

                    meshIndex++;
                }
            });

            console.log(`✅ Applied colors to ${meshIndex} meshes`);

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

    // SPACE - STARFIELD BACKGROUND
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Distribute stars in a sphere around the scene
        const radius = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);

        // Various star colors (white, blue, bronze)
        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
            starColors[i3] = 1; starColors[i3 + 1] = 1; starColors[i3 + 2] = 1; // White
        } else if (colorChoice < 0.8) {
            starColors[i3] = 0; starColors[i3 + 1] = 0.7; starColors[i3 + 2] = 1; // Blue
        } else {
            starColors[i3] = 0.8; starColors[i3 + 1] = 0.5; starColors[i3 + 2] = 0.2; // Bronze
        }
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // PLANETS - Floating spheres
    const planets = [];
    for (let i = 0; i < 3; i++) {
        const planetSize = 0.4 + Math.random() * 0.3;
        const planetGeo = new THREE.SphereGeometry(planetSize, 16, 16);
        const planetMat = new THREE.MeshStandardMaterial({
            color: i === 0 ? bronzeColor : (i === 1 ? cyanGlow : redAccent),
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.4,
            emissive: i === 0 ? bronzeColor : (i === 1 ? cyanGlow : redAccent),
            emissiveIntensity: 0.3
        });
        const planet = new THREE.Mesh(planetGeo, planetMat);

        // Add rings to some planets
        if (i === 1) {
            const ringGeo = new THREE.TorusGeometry(planetSize * 1.5, 0.02, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: cyanGlow,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2 + 0.3;
            planet.add(ring);
        }

        planet.position.set(
            -6 + i * 5,
            1 + Math.random() * 2,
            -8 - Math.random() * 4
        );

        planet.userData.rotSpeed = 0.001 + Math.random() * 0.002;
        planet.userData.floatSpeed = 0.3 + Math.random() * 0.3;
        planets.push(planet);
        scene.add(planet);
    }

    // ASTEROID BELT - Floating rocks
    const asteroids = [];
    for (let i = 0; i < 15; i++) {
        const asteroidSize = 0.08 + Math.random() * 0.12;
        const asteroidGeo = new THREE.DodecahedronGeometry(asteroidSize, 0);
        const asteroidMat = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);

        // Position in a belt around the bike
        const angle = (i / 15) * Math.PI * 2;
        const distance = 4 + Math.random() * 2;
        asteroid.position.set(
            Math.cos(angle) * distance,
            -0.5 + Math.random() * 3,
            Math.sin(angle) * distance - 2
        );

        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        asteroid.userData.rotSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };

        asteroids.push(asteroid);
        scene.add(asteroid);
    }

    // NEBULA PARTICLES - Colorful space dust
    const nebulaCount = 300;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        nebulaPositions[i3] = (Math.random() - 0.5) * 25;
        nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 12;
        nebulaPositions[i3 + 2] = (Math.random() - 0.5) * 15;

        // Purple, cyan, bronze nebula colors
        const colorPick = Math.random();
        if (colorPick < 0.33) {
            nebulaColors[i3] = 0.5; nebulaColors[i3 + 1] = 0; nebulaColors[i3 + 2] = 1; // Purple
        } else if (colorPick < 0.66) {
            nebulaColors[i3] = 0; nebulaColors[i3 + 1] = 1; nebulaColors[i3 + 2] = 1; // Cyan
        } else {
            nebulaColors[i3] = 1; nebulaColors[i3 + 1] = 0.6; nebulaColors[i3 + 2] = 0; // Orange
        }
    }

    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebula);

    // GLOWING ORBS - Energy spheres
    const orbs = [];
    for (let i = 0; i < 4; i++) {
        const orbGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const orbMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? cyanGlow : bronzeColor,
            transparent: true,
            opacity: 0.5
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);

        orb.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6,
            -3 - Math.random() * 3
        );

        // Add glow
        const glowGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? cyanGlow : bronzeColor,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        orb.add(glow);

        orb.userData.floatSpeed = 0.4 + Math.random() * 0.4;
        orbs.push(orb);
        scene.add(orb);
    }

    // MINIMAL PARTICLES - Subtle sparkle
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 18;
        positions[i3 + 1] = (Math.random() - 0.5) * 6;
        positions[i3 + 2] = (Math.random() - 0.5) * 8;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.025,
        color: bronzeColor,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // GEOMETRIC ACCENT SHAPES - Minimal modern feel
    const geometries = [];
    for (let i = 0; i < 4; i++) {
        const size = 0.25 + Math.random() * 0.15;
        const geo = new THREE.OctahedronGeometry(size, 0);
        const mat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? bronzeColor : redAccent,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 5,
            -2 - Math.random() * 3
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mesh.userData.rotSpeed = {
            x: (Math.random() - 0.5) * 0.008,
            y: (Math.random() - 0.5) * 0.008
        };
        geometries.push(mesh);
        scene.add(mesh);
    }

    // SINGLE ACCENT RING - Depth element
    const accentRingGeo = new THREE.TorusGeometry(2.8, 0.05, 6, 24);
    const accentRingMat = new THREE.MeshBasicMaterial({
        color: cyanGlow,
        transparent: true,
        opacity: 0.18,
        wireframe: true
    });
    const accentRing = new THREE.Mesh(accentRingGeo, accentRingMat);
    accentRing.position.set(2, 0, -3.5);
    accentRing.rotation.x = Math.PI / 2;
    scene.add(accentRing);

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

            // Pulsing glow intensity - dim and bright
            const glowPulse = 0.2 + Math.sin(elapsed * 1.5) * 0.15; // 0.05 to 0.35

            // Apply to all bike meshes
            bikeModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Smoothly change color
                    child.material.emissive.copy(mixedColor);

                    // Pulse glow intensity
                    child.material.emissiveIntensity = glowPulse;

                    // Pulse opacity slightly
                    child.material.opacity = 0.08 + Math.sin(elapsed * 1.2) * 0.03;

                    // Pulse wireframe
                    if (child.children[0] && child.children[0].material) {
                        child.children[0].material.color.copy(mixedColor);
                        child.children[0].material.opacity = 0.5 + Math.sin(elapsed * 2) * 0.2;
                    }
                }
            });
        }

        // Subtle particle movement
        particles.rotation.y = elapsed * 0.02;

        // Animate stars - slow rotation
        stars.rotation.y = elapsed * 0.01;
        stars.rotation.x = Math.sin(elapsed * 0.05) * 0.1;

        // Animate planets
        planets.forEach((planet, i) => {
            planet.rotation.y += planet.userData.rotSpeed;
            planet.position.y += Math.sin(elapsed * planet.userData.floatSpeed + i) * 0.003;
        });

        // Animate asteroids
        asteroids.forEach((asteroid) => {
            asteroid.rotation.x += asteroid.userData.rotSpeed.x;
            asteroid.rotation.y += asteroid.userData.rotSpeed.y;
            asteroid.rotation.z += asteroid.userData.rotSpeed.z;
        });

        // Animate nebula particles
        nebula.rotation.y = elapsed * 0.015;
        nebula.rotation.x = Math.sin(elapsed * 0.08) * 0.05;

        // Animate orbs - floating and pulsing
        orbs.forEach((orb, i) => {
            orb.position.y += Math.sin(elapsed * orb.userData.floatSpeed + i) * 0.005;
            const scale = 1 + Math.sin(elapsed * 2 + i) * 0.1;
            orb.scale.set(scale, scale, scale);
            orb.children[0].material.opacity = 0.2 + Math.sin(elapsed * 3 + i) * 0.1;
        });

        // Animate geometries
        geometries.forEach((geo) => {
            geo.rotation.x += geo.userData.rotSpeed.x;
            geo.rotation.y += geo.userData.rotSpeed.y;
        });

        // Animate accent ring
        accentRing.rotation.z = elapsed * 0.25;
        accentRing.scale.set(
            1 + Math.sin(elapsed * 0.8) * 0.04,
            1 + Math.sin(elapsed * 0.8) * 0.04,
            1
        );

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
