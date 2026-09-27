/**
 * ============================================================================
 * RESSHMA VP PORTFOLIO — 3D PERSPECTIVE CARD TILT ENGINE
 * Hardware-accelerated 3D mouse parallax tilt with dynamic specular glare
 * ============================================================================
 */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(element => {
      // Configuration settings
      const maxTilt = parseFloat(element.getAttribute('data-tilt-max')) || 12;
      const perspective = parseFloat(element.getAttribute('data-tilt-perspective')) || 1000;
      const scale = parseFloat(element.getAttribute('data-tilt-scale')) || 1.02;
      const speed = parseFloat(element.getAttribute('data-tilt-speed')) || 400;

      // Add dynamic specular glare element if not present
      let glare = element.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.position = 'absolute';
        glare.style.top = '0';
        glare.style.left = '0';
        glare.style.width = '100%';
        glare.style.height = '100%';
        glare.style.overflow = 'hidden';
        glare.style.pointerEvents = 'none';
        glare.style.borderRadius = 'inherit';
        glare.style.opacity = '0';
        glare.style.transition = `opacity ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
        glare.style.zIndex = '5';

        const glareInner = document.createElement('div');
        glareInner.className = 'tilt-glare-inner';
        glareInner.style.position = 'absolute';
        glareInner.style.top = '50%';
        glareInner.style.left = '50%';
        glareInner.style.pointerEvents = 'none';
        glareInner.style.backgroundImage = 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 80%)';
        glareInner.style.transform = 'translate(-50%, -50%)';
        glareInner.style.width = '200%';
        glareInner.style.height = '200%';

        glare.appendChild(glareInner);
        element.appendChild(glare);
      }

      let isHovered = false;

      element.addEventListener('mouseenter', () => {
        isHovered = true;
        element.style.transition = 'none';
        glare.style.opacity = '1';
      });

      element.addEventListener('mousemove', (e) => {
        if (!isHovered) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        element.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

        // Move glare relative to cursor
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        const glareInner = glare.querySelector('.tilt-glare-inner');
        if (glareInner) {
          glareInner.style.transform = `translate(-${100 - glareX}%, -${100 - glareY}%)`;
        }
      });

      element.addEventListener('mouseleave', () => {
        isHovered = false;
        element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
        element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        glare.style.opacity = '0';
      });
    });
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }

  // Expose function for dynamic elements
  window.reinitTilt = initTilt;
})();
