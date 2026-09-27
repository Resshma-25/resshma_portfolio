/**
 * ============================================================================
 * RESSHMA VP PORTFOLIO — 3D GRAPHICS ENGINE (Three.js)
 * 1. Global Interactive Neural Constellation Background with Dynamic Theme Color Morphing
 * 2. Hero Interactive 3D AI Holographic Core with Orbiting Cyber Rings
 * ============================================================================
 */

(function () {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. 3D features will be disabled.');
    return;
  }

  // Theme Color Palettes
  const THEME_PALETTES = {
    aurora: {
      c1: new THREE.Color(0x00f5a0), // Emerald
      c2: new THREE.Color(0x8b5cf6), // Nebula Purple
      c3: new THREE.Color(0x00d9f5), // Celestial Cyan
      bgFog: 0x030712
    },
    cyber: {
      c1: new THREE.Color(0x00f0ff), // Electric Cyan
      c2: new THREE.Color(0xff007f), // Hot Pink / Magenta
      c3: new THREE.Color(0x7000ff), // Electric Violet
      bgFog: 0x08031a
    },
    solar: {
      c1: new THREE.Color(0xffb703), // Solar Gold
      c2: new THREE.Color(0xfb8500), // Amber Flare
      c3: new THREE.Color(0xf72585), // Crimson
      bgFog: 0x0d0c13
    },
    titanium: {
      c1: new THREE.Color(0x38bdf8), // Glacier Sky
      c2: new THREE.Color(0x818cf8), // Indigo Ice
      c3: new THREE.Color(0xc084fc), // Cool Lavender
      bgFog: 0x0b1329
    }
  };

  let currentTheme = document.documentElement.getAttribute('data-theme') || 'aurora';
  let activePalette = THEME_PALETTES[currentTheme] || THEME_PALETTES.aurora;

  /* ==========================================================================
     1. GLOBAL 3D BACKGROUND NEURAL MATRIX
     ========================================================================== */
  const bgCanvas = document.getElementById('bg-canvas');
  let updateBgColorsFunc = null;

  if (bgCanvas) {
    initBackgroundMatrix(bgCanvas);
  }

  function initBackgroundMatrix(canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(activePalette.bgFog, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 70 : 160;
    const maxDistance = isMobile ? 120 : 150;
    const bounds = 800;

    const particlesData = [];
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * bounds - bounds / 2;
      const y = Math.random() * bounds - bounds / 2;
      const z = Math.random() * bounds - bounds / 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = i % 3 === 0 ? activePalette.c1 : (i % 3 === 1 ? activePalette.c2 : activePalette.c3);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      particlesData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.45,
          (Math.random() - 0.5) * 0.45,
          (Math.random() - 0.5) * 0.45
        ),
        numConnections: 0
      });
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createGlowTexture();
    const pointMat = new THREE.PointsMaterial({
      size: isMobile ? 7 : 9,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(pointGeo, pointMat);
    scene.add(pointCloud);

    // Connecting lines
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    const lineColors = new Float32Array(particleCount * particleCount * 3);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // Theme color morphing handler
    updateBgColorsFunc = function (newPalette) {
      scene.fog.color.setHex(newPalette.bgFog);
      const colArr = pointGeo.attributes.color.array;
      for (let i = 0; i < particleCount; i++) {
        const mc = i % 3 === 0 ? newPalette.c1 : (i % 3 === 1 ? newPalette.c2 : newPalette.c3);
        colArr[i * 3] = mc.r;
        colArr[i * 3 + 1] = mc.g;
        colArr[i * 3 + 2] = mc.b;
      }
      pointGeo.attributes.color.needsUpdate = true;
    };

    // Mouse coordinates tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    window.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.4;
    });

    let scrollY = 0;
    window.addEventListener('scroll', function () {
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      targetCameraX += (mouseX - targetCameraX) * 0.035;
      targetCameraY += (-mouseY - targetCameraY) * 0.035;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY - (scrollY * 0.15);
      camera.lookAt(scene.position);

      pointCloud.rotation.y += 0.0006;
      linesMesh.rotation.y += 0.0006;

      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }

      const posArray = pointGeo.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const pData = particlesData[i];

        posArray[i * 3] += pData.velocity.x;
        posArray[i * 3 + 1] += pData.velocity.y;
        posArray[i * 3 + 2] += pData.velocity.z;

        if (posArray[i * 3] < -bounds / 2 || posArray[i * 3] > bounds / 2) pData.velocity.x = -pData.velocity.x;
        if (posArray[i * 3 + 1] < -bounds / 2 || posArray[i * 3 + 1] > bounds / 2) pData.velocity.y = -pData.velocity.y;
        if (posArray[i * 3 + 2] < -bounds / 2 || posArray[i * 3 + 2] > bounds / 2) pData.velocity.z = -pData.velocity.z;

        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = (1.0 - dist / maxDistance) * 0.45;

            linePositions[vertexpos++] = posArray[i * 3];
            linePositions[vertexpos++] = posArray[i * 3 + 1];
            linePositions[vertexpos++] = posArray[i * 3 + 2];

            linePositions[vertexpos++] = posArray[j * 3];
            linePositions[vertexpos++] = posArray[j * 3 + 1];
            linePositions[vertexpos++] = posArray[j * 3 + 2];

            lineColors[colorpos++] = activePalette.c1.r * alpha;
            lineColors[colorpos++] = activePalette.c1.g * alpha;
            lineColors[colorpos++] = activePalette.c1.b * alpha;

            lineColors[colorpos++] = activePalette.c2.r * alpha;
            lineColors[colorpos++] = activePalette.c2.g * alpha;
            lineColors[colorpos++] = activePalette.c2.b * alpha;

            numConnected++;
          }
        }
      }

      pointGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, numConnected * 2);

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 245, 160, 0.85)');
    grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  /* ==========================================================================
     2. HERO 3D HOLOGRAPHIC AI CORE WITH INTERACTIVE ROTATION
     ========================================================================== */
  const heroContainer = document.getElementById('hero-3d-canvas-container');
  let updateHeroColorsFunc = null;

  if (heroContainer) {
    initHeroCore(heroContainer);
  }

  function initHeroCore(container) {
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Glowing Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(4.5, 3);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: activePalette.c1,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Solid inner core
    const innerCoreGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: activePalette.c2,
      transparent: true,
      opacity: 0.65
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    // 2. Outer Wireframe Polyhedron
    const outerGeo = new THREE.DodecahedronGeometry(6.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: activePalette.c3,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 3. Cybernetic Gimbal Orbit Rings
    const ring1Geo = new THREE.TorusGeometry(7.8, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: activePalette.c1,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(8.8, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: activePalette.c2,
      transparent: true,
      opacity: 0.6
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(9.6, 0.03, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: activePalette.c3,
      transparent: true,
      opacity: 0.5
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 2.5;
    coreGroup.add(ring3);

    // 4. Orbiting Satellites
    const satellites = [];
    const satCount = 8;
    for (let i = 0; i < satCount; i++) {
      const satGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? activePalette.c1 : activePalette.c3,
        transparent: true,
        opacity: 0.95
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      coreGroup.add(sat);

      satellites.push({
        mesh: sat,
        mat: satMat,
        angle: (i / satCount) * Math.PI * 2,
        radius: 7.5 + (i % 3) * 1.2,
        speed: 0.015 + (i % 2) * 0.01,
        orbitTilt: (i * 0.4)
      });
    }

    // Hero Core Theme Update Function
    updateHeroColorsFunc = function (newPalette) {
      nucleusMat.color.copy(newPalette.c1);
      innerCoreMat.color.copy(newPalette.c2);
      outerMat.color.copy(newPalette.c3);
      ring1Mat.color.copy(newPalette.c1);
      ring2Mat.color.copy(newPalette.c2);
      ring3Mat.color.copy(newPalette.c3);
      satellites.forEach((sat, i) => {
        sat.mat.color.copy(i % 2 === 0 ? newPalette.c1 : newPalette.c3);
      });
    };

    // Drag behavior
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.003, y: 0.005 };

    const domElement = renderer.domElement;

    domElement.addEventListener('mousedown', function (e) {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      coreGroup.rotation.y += deltaX * 0.007;
      coreGroup.rotation.x += deltaY * 0.007;

      rotationVelocity.y = deltaX * 0.002;
      rotationVelocity.x = deltaY * 0.002;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch
    domElement.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      coreGroup.rotation.y += deltaX * 0.007;
      coreGroup.rotation.x += deltaY * 0.007;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Render Animation Loop
    let clock = new THREE.Clock();

    function renderHero() {
      requestAnimationFrame(renderHero);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        coreGroup.rotation.y += rotationVelocity.y;
        coreGroup.rotation.x += rotationVelocity.x;

        rotationVelocity.y += (0.004 - rotationVelocity.y) * 0.02;
        rotationVelocity.x += (0.002 - rotationVelocity.x) * 0.02;
      }

      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.01;
      ring3.rotation.y += 0.007;

      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      nucleusMesh.scale.set(pulse, pulse, pulse);
      innerCoreMesh.scale.set(1 + Math.cos(elapsedTime * 3) * 0.08, 1 + Math.cos(elapsedTime * 3) * 0.08, 1 + Math.cos(elapsedTime * 3) * 0.08);

      satellites.forEach(sat => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle) * Math.cos(sat.orbitTilt) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * Math.sin(sat.orbitTilt) * sat.radius;
      });

      renderer.render(scene, camera);
    }

    renderHero();

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);
  }

  // Global Theme Switcher for Three.js
  window.update3DTheme = function (themeName) {
    const palette = THEME_PALETTES[themeName];
    if (!palette) return;

    activePalette = palette;
    if (updateBgColorsFunc) updateBgColorsFunc(palette);
    if (updateHeroColorsFunc) updateHeroColorsFunc(palette);
  };
})();
