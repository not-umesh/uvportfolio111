/* ============================================
   UMESH VERMA PORTFOLIO - HOLOGRAPHIC TVS APACHE THEME
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    initTypingEffect();
    initNavbar();
    initSmoothScrollAnimations();
    initSmoothScroll();
});

/* ============================================
   THREE.JS - HOLOGRAPHIC APACHE LOGO SCENE
   ============================================ */
function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 5, 25);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Apache-inspired colors: Bronze, Red, Black
    const bronzeColor = 0xcd7f32;
    const redAccent = 0xff3333;
    const neonBlue = 0x00ffff;

    // Lighting - Holographic style
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const spotLight1 = new THREE.SpotLight(bronzeColor, 2);
    spotLight1.position.set(5, 5, 5);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(redAccent, 1.5);
    spotLight2.position.set(-5, -3, 3);
    scene.add(spotLight2);

    // HOLOGRAPHIC LOGO - Stylized "A" for Apache
    const logoGroup = new THREE.Group();

    // Create Apache "A" shape with holographic wireframe
    const aShape = new THREE.Shape();
    aShape.moveTo(-1, 0);
    aShape.lineTo(0, 2);
    aShape.lineTo(1, 0);
    aShape.lineTo(0.6, 0);
    aShape.lineTo(0, 1.2);
    aShape.lineTo(-0.6, 0);
    aShape.closePath();

    // Horizontal bar of A
    aShape.moveTo(-0.4, 0.8);
    aShape.lineTo(0.4, 0.8);
    aShape.lineTo(0.4, 1.0);
    aShape.lineTo(-0.4, 1.0);
    aShape.closePath();

    // Extrude settings for 3D effect
    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
    };

    const logoGeometry = new THREE.ExtrudeGeometry(aShape, extrudeSettings);

    // Holographic material
    const logoMaterial = new THREE.MeshStandardMaterial({
        color: bronzeColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: bronzeColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85
    });

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.position.set(0, 0, -0.15);
    logoGroup.add(logoMesh);

    // Wireframe outline for holographic effect
    const wireframeGeo = new THREE.EdgesGeometry(logoGeometry);
    const wireframeMat = new THREE.LineBasicMaterial({
        color: neonBlue,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframe.position.copy(logoMesh.position);
    logoGroup.add(wireframe);

    logoGroup.position.set(2, 0.5, 0);
    logoGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(logoGroup);

    // HOLOGRAPHIC RINGS - Speed/motion effect
    const rings = [];
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(1.5 + i * 0.3, 0.02, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? bronzeColor : redAccent,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(2, 0.5, -2 - i * 0.5);
        ring.rotation.x = Math.PI / 2;
        rings.push(ring);
        scene.add(ring);
    }

    // PARTICLE GRID - Holographic scan effect
    const gridParticles = new THREE.Group();
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Color mixing - bronze and red
        const mixRatio = Math.random();
        if (mixRatio > 0.7) {
            colors[i3] = 1.0; // R
            colors[i3 + 1] = 0.2; // G
            colors[i3 + 2] = 0.2; // B
        } else {
            colors[i3] = 0.8; // R
            colors[i3 + 1] = 0.5; // G
            colors[i3 + 2] = 0.2; // B
        }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // HOLOGRAPHIC HEXAGONS - Tech pattern
    const hexagons = [];
    for (let i = 0; i < 12; i++) {
        const hexGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 6);
        const hexMat = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? bronzeColor : (i % 3 === 1 ? redAccent : neonBlue),
            transparent: true,
            opacity: 0.25,
            wireframe: true
        });
        const hex = new THREE.Mesh(hexGeo, hexMat);
        hex.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5 - 3
        );
        hex.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
        hex.userData.rotSpeed = Math.random() * 0.02;
        hexagons.push(hex);
        scene.add(hex);
    }

    // SCAN LINES - Hologram effect
    const scanLines = [];
    for (let i = 0; i < 3; i++) {
        const lineGeo = new THREE.PlaneGeometry(30, 0.05);
        const lineMat = new THREE.MeshBasicMaterial({
            color: neonBlue,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.y = -5 + i * 2;
        line.userData.direction = 1;
        scanLines.push(line);
        scene.add(line);
    }

    // CURSOR TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

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

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth interpolation
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Rotate logo with cursor
        logoGroup.rotation.y = elapsed * 0.3 + mouseX * 0.5;
        logoGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.1 + mouseY * 0.3;
        logoGroup.position.y = 0.5 + Math.sin(elapsed) * 0.1;

        // Pulse logo glow
        logoMaterial.emissiveIntensity = 0.5 + Math.sin(elapsed * 2) * 0.2;
        wireframeMat.opacity = 0.6 + Math.sin(elapsed * 3) * 0.2;

        // Animate rings - moving towards camera
        rings.forEach((ring, i) => {
            ring.position.z += 0.02;
            ring.scale.set(1 + Math.sin(elapsed + i) * 0.1, 1 + Math.sin(elapsed + i) * 0.1, 1);

            if (ring.position.z > 2) {
                ring.position.z = -4;
            }

            ring.material.opacity = 0.2 + Math.sin(elapsed * 2 + i) * 0.1;
        });

        // Animate particles
        const posAttr = particles.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const y = posAttr.getY(i);
            posAttr.setY(i, y + Math.sin(elapsed + i * 0.01) * 0.01);
        }
        posAttr.needsUpdate = true;
        particles.rotation.y = elapsed * 0.05;

        // Rotate hexagons
        hexagons.forEach((hex) => {
            hex.rotation.z += hex.userData.rotSpeed;
            hex.position.x += Math.sin(elapsed + hex.position.y) * 0.002;
        });

        // Animate scan lines
        scanLines.forEach((line) => {
            line.position.y += line.userData.direction * 0.03;
            if (line.position.y > 5) line.userData.direction = -1;
            if (line.position.y < -5) line.userData.direction = 1;
            line.material.opacity = 0.2 + Math.sin(elapsed * 2) * 0.1;
        });

        // Camera movement
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(logoGroup.position);

        // Animate lights
        spotLight1.position.x = Math.cos(elapsed * 0.5) * 5;
        spotLight1.position.z = Math.sin(elapsed * 0.5) * 5;

        spotLight2.position.x = Math.sin(elapsed * 0.7) * -5;
        spotLight2.position.y = Math.cos(elapsed * 0.6) * 3;

        renderer.render(scene, camera);
    }

    animate();

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
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 100;

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
