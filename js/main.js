/**
 * ============================================================================
 * RESSHMA VP PORTFOLIO — CORE APPLICATION CONTROLLER
 * Navigation, Theme Switcher, Modals, Certificate Viewer, Resume, AI Lab, Email
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initTypewriter();
    initMobileNav();
    initActiveNavScroll();
    initStatCounters();
    initSkillsFilter();
    initProjectsFilter();
    initProjectModals();
    initCertificateModal();
    initResumeModal();
    initOncoPredictLab();
    initRagLab();
    initCopyButtons();
    initContactForm();
  });

  /* ==========================================================================
     1. THEME SWITCHER
     ========================================================================== */
  function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-btn');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOpts = document.querySelectorAll('.theme-opt');

    // Load saved theme or default to aurora
    const savedTheme = localStorage.getItem('rvp_theme') || 'aurora';
    applyTheme(savedTheme, false);

    if (themeBtn && themeDropdown) {
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        themeDropdown.classList.remove('active');
      });

      themeOpts.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetTheme = opt.getAttribute('data-set-theme');
          applyTheme(targetTheme, true);
          themeDropdown.classList.remove('active');
        });
      });
    }

    function applyTheme(themeName, notify) {
      document.documentElement.setAttribute('data-theme', themeName);
      document.body.className = `theme-${themeName}`;
      localStorage.setItem('rvp_theme', themeName);

      themeOpts.forEach(opt => {
        if (opt.getAttribute('data-set-theme') === themeName) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });

      // Update 3D scene colors if Three.js module is present
      if (typeof window.update3DTheme === 'function') {
        window.update3DTheme(themeName);
      }

      if (notify) {
        const themeLabels = {
          aurora: 'Aurora Emerald',
          cyber: 'Cyber Neon',
          solar: 'Solar Gold',
          titanium: 'Titanium Ice'
        };
        showToast(`Theme updated to ${themeLabels[themeName] || themeName}`);
      }
    }
  }

  /* ==========================================================================
     2. HERO TYPEWRITER EFFECT
     ========================================================================== */
  function initTypewriter() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    const phrases = [
      'Data Science Undergraduate',
      'Machine Learning Engineer',
      'Full-Stack AI Platform Builder',
      'RAG & NLP Specialist',
      'Certified Power BI Data Analyst'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  /* ==========================================================================
     3. MOBILE NAVIGATION
     ========================================================================== */
  function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     4. ACTIVE NAVIGATION LINK ON SCROLL
     ========================================================================== */
  function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.pageYOffset + 220;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     5. STAT COUNTERS ANIMATION ON SCROLL
     ========================================================================== */
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = (target * easeOut).toFixed(decimals);

              counter.textContent = currentVal + (decimals === 0 && target >= 5 ? '+' : '');

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toFixed(decimals) + (decimals === 0 && target >= 5 ? '+' : '');
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);
  }

  /* ==========================================================================
     6. SKILLS FILTERING
     ========================================================================== */
  function initSkillsFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ==========================================================================
     7. PROJECTS FILTERING
     ========================================================================== */
  function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-pfilter');

        projectCards.forEach(card => {
          const pcat = card.getAttribute('data-pcat') || '';
          if (filter === 'all' || pcat.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ==========================================================================
     8. PROJECT ARCHITECTURE & DETAILS MODAL
     ========================================================================== */
  const projectData = {
    agrisense: {
      type: 'Full-Stack AI Platform',
      title: 'AGRISENSE AI — Full-Stack AI Agriculture Platform',
      description: 'An end-to-end intelligent agricultural decision platform engineered to empower farmers with automated crop advisory, weather forecasts, commodity market prices, government subsidy schemes, and an interactive multilingual chatbot powered by the Gemini AI API.',
      architecture: `[ Vue.js Frontend (Vercel) ]
             ↕ REST APIs & WebSockets
[ FastAPI Python Backend (Render) ]
             ↕               ↕
[ Railway MySQL ]   [ Google Gemini AI API ]
             ↕               ↕
[ Real-Time Weather & Government Agronomy APIs ]`,
      highlights: [
        'Secure token-based authentication and user profiles for regional farmers.',
        'Multilingual conversational assistant powered by Google Gemini API for regional dialect questions.',
        'Dynamic ML-based crop suitability recommendations based on N-P-K soil metrics and weather inputs.',
        'Fully deployed across Vercel (Frontend), Render (FastAPI Backend), and Railway (Managed MySQL).'
      ],
      techStack: ['Python', 'FastAPI', 'Vue.js', 'MySQL', 'Gemini AI API', 'Git', 'GitHub', 'Vercel', 'Render', 'Railway']
    },
    mediguard: {
      type: 'AI Healthcare Platform',
      title: 'MEDI GUARD AI — AI Powered Medication Safety System',
      description: 'A clinical safety assistant designed to prevent adverse drug events and improve patient adherence. Users capture or upload pharmaceutical packaging; the system runs computer vision preprocessing and extracts text via OCR, feeding it to Llama 3.2 for dosage extraction, drug-interaction detection, and patient-tailored alert schedules.',
      architecture: `[ React.js Web Client ]
             ↕ Image Upload & Telemetry
[ FastAPI Microservice ]
             ↕
[ OpenCV Preprocessing (Grayscale, Adaptive Threshold, Denoise) ]
             ↕
[ Tesseract OCR (Character Recognition & Spatial Bounding Boxes) ]
             ↕
[ Llama 3.2 LLM (Structured JSON Extraction & Drug Interaction Graph) ]`,
      highlights: [
        'Image filtering pipeline using OpenCV to handle curved pill bottles and skewed prescription labels.',
        'Fine-tuned OCR and prompt structuring with Llama 3.2 to normalize chemical names and contraindications.',
        'Patient-specific medication tracking, dosage countdowns, and real-time dangerous drug-drug interaction alerts.'
      ],
      techStack: ['React.js', 'FastAPI', 'Python', 'Tesseract OCR', 'OpenCV', 'Llama 3.2', 'AI/LLM']
    },
    oncopredict: {
      type: 'Supervised ML System',
      title: 'ONCOPREDICT SYSTEM — Breast Tumor Classification',
      description: 'A clinical diagnostic predictive machine learning application that classifies breast tumors as benign or malignant based on cell nucleus morphological features. Implements data preprocessing, outlier removal, feature correlation analysis, and model performance benchmarking.',
      architecture: `[ Wisconsin Diagnostic Dataset (30 Numerical Cell Nuclei Features) ]
             ↕
[ Data Cleaning, Standardization (StandardScaler) & Feature Selection ]
             ↕
[ Scikit-Learn Supervised Classification Models (Logistic Reg / Random Forest) ]
             ↕
[ Model Validation (Confusion Matrix, Precision/Recall, ROC-AUC) ]
             ↕
[ Interactive Streamlit Web Interface for Oncologists ]`,
      highlights: [
        'Executed exploratory data analysis (EDA) to determine highest variance cell morphological metrics.',
        'Achieved high diagnostic accuracy on classification metrics to minimize false negatives.',
        'Built an intuitive real-time Streamlit dashboard allowing healthcare specialists to input cell measurements and receive instant probabilistic classifications.'
      ],
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Streamlit']
    },
    intellirag: {
      type: 'Generative AI & Information Retrieval',
      title: 'IntelliRAG — PDF Question Answering System',
      description: 'A production-grade Retrieval-Augmented Generation (RAG) system enabling contextual querying over multi-page technical and medical PDF documentation without hallucination.',
      architecture: `[ Uploaded PDF Documents ]
             ↕
[ PDF Text Extraction & Recursive Character Text Chunking ]
             ↕
[ Semantic Dense Vector Embeddings Generation ]
             ↕
[ FAISS Vector Indexing & Inverted File Similarity Search ]
             ↕
[ Context Injection & Query Augmentation ]
             ↕
[ Large Language Model Response Synthesis ]`,
      highlights: [
        'Implemented recursive document chunking with 200-character overlap to preserve semantic context across boundaries.',
        'Constructed FAISS vector store with cosine similarity index for sub-millisecond retrieval across thousands of document chunks.',
        'Engineered defensive system prompts to ground LLM answers strictly within retrieved contexts, eliminating hallucinations.'
      ],
      techStack: ['Python', 'RAG', 'LLM', 'FAISS', 'Embeddings', 'NLP', 'PDF Processing']
    },
    coldchain: {
      type: 'IoT & Embedded Systems',
      title: 'Smart Cold Chain Logistics Box with Temperature Control',
      description: 'An IoT hardware-cloud solution designed for refrigerated supply chains (vaccines, perishable pharmaceuticals, biologics). Uses ESP32 running FreeRTOS for sensor reading, automated thermoelectric cooling regulation, GPS tracking, and MQTT event streaming to a PostgreSQL and React monitoring center.',
      architecture: `[ ESP32 Microcontroller + FreeRTOS Multi-Tasking ]
             ↕ Sensors: DS18B20, DHT22, Reed Switch (Door), GPS
[ Automated Relay / PWM Thermoelectric Cooler ]
             ↕ WiFi / Cellular MQTT Telemetry
[ MQTT Broker & PostgreSQL Time-Series Database ]
             ↕
[ React Web Dashboard with Real-Time Thermal Alerts ]`,
      highlights: [
        'FreeRTOS task scheduling ensuring hard real-time temperature sensing and PWM cooler PID adjustment.',
        'Instant MQTT alert dispatch upon temperature threshold excursions or unauthorized door open events.',
        'Comprehensive historical transit logs with GPS coordinates in PostgreSQL.'
      ],
      techStack: ['ESP32', 'FreeRTOS', 'DS18B20', 'DHT22', 'MQTT', 'PostgreSQL', 'React']
    },
    kafka: {
      type: 'Big Data & Real-Time Streaming',
      title: 'Real-Time Data Streaming & Analytics System (Kafka Simulation)',
      description: 'A high-throughput simulated transaction streaming engine demonstrating how enterprise banking architectures detect fraudulent transactions and compute running aggregate sales metrics in real time.',
      architecture: `[ Synthetic Transaction Generator (High Velocity JSON Stream) ]
             ↕
[ Kafka Event Producer & Topic Partitioning ]
             ↕
[ Stream Consumers: Fraud Detection Heuristic Rules & Aggregators ]
             ↕
[ Matplotlib / Streaming Dashboards & Metrics Logging ]`,
      highlights: [
        'Simulated millions of concurrent transaction events with randomized geographical anomalies.',
        'Dynamic rule evaluation detecting sudden velocity spikes, duplicate card charges, and location hops.',
        'Live statistical trend visualizations and alerting.'
      ],
      techStack: ['Python', 'Kafka Simulation', 'JSON', 'Matplotlib', 'Stream Analytics']
    },
    ipc: {
      type: 'Systems & Networking',
      title: 'Socket-Based Inter-Process Communication Tool',
      description: 'A robust low-level networking utility providing bidirectional client-server message and data interchange over TCP sockets, engineered with multi-threading and graceful socket teardown.',
      architecture: `[ Python Client Applications ]
             ↕ TCP / IP Sockets (IPv4)
[ Multithreaded TCP Server Listener ]
             ↕ Worker Thread Pool
[ Packet Framing, Serialization & Safe Connection Pool Management ]`,
      highlights: [
        'Concurrent handling of simultaneous client socket channels using Python threading.',
        'Framed binary packet protocol preventing partial-read data corruption.',
        'Fault-tolerant connection recycling with heartbeat ping/pong monitoring.'
      ],
      techStack: ['Python', 'Socket Programming', 'TCP/IP', 'Threading']
    },
    events: {
      type: 'Enterprise Java Application',
      title: 'Event Management & Automated Ticketing System',
      description: 'A console enterprise application built with Java OOP principles and JDBC connectivity to a relational MySQL database for managing events, automated seat allocation, and attendee billing.',
      architecture: `[ Java Console Interactive User Interface ]
             ↕ OOP Service & DAO Layer
[ JDBC Connector Driver ]
             ↕ SQL Transactions (ACID)
[ Relational MySQL Database (Events, Venues, Attendees, Bookings) ]`,
      highlights: [
        'Normalized relational database schema enforcing referential integrity and zero over-booking.',
        'Object-Oriented architecture applying Singleton, Factory, and DAO design patterns.',
        'Automated revenue tracking and ticket inventory updates within transactional boundaries.'
      ],
      techStack: ['Java', 'MySQL', 'JDBC', 'OOPs', 'SQL Transactions']
    }
  };

  function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const openBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal || !modalBody || !modalClose) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute('data-project');
        const proj = projectData[projectId];
        if (!proj) return;

        modalBody.innerHTML = `
          <div class="modal-header-section">
            <div class="modal-proj-type"><i class="fa-solid fa-code-branch"></i> ${proj.type}</div>
            <h2 class="modal-proj-title">${proj.title}</h2>
          </div>

          <p class="modal-desc" style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">
            ${proj.description}
          </p>

          <div class="modal-section-title"><i class="fa-solid fa-network-wired"></i> System Architecture Flow</div>
          <pre class="modal-arch-flow">${proj.architecture}</pre>

          <div class="modal-section-title"><i class="fa-solid fa-star"></i> Key Engineering Highlights</div>
          <ul style="list-style: none; margin-bottom: 1.5rem;">
            ${proj.highlights.map(h => `<li style="position: relative; padding-left: 1.5rem; margin-bottom: 0.6rem; color: var(--text-secondary);"><span style="position: absolute; left: 0; color: var(--accent-cyan);">▹</span>${h}</li>`).join('')}
          </ul>

          <div class="modal-section-title"><i class="fa-solid fa-layer-group"></i> Technologies & Tools Applied</div>
          <div class="modal-tech-list">
            ${proj.techStack.map(t => `<span class="tech-tag" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${t}</span>`).join('')}
          </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     9. CERTIFICATE PREVIEW MODAL
     ========================================================================== */
  function initCertificateModal() {
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalClose = document.getElementById('cert-modal-close');
    const certImgWraps = document.querySelectorAll('.cert-img-wrapper');

    if (!certModal || !certModalImg || !certModalClose) return;

    certImgWraps.forEach(wrap => {
      wrap.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgSrc = wrap.getAttribute('data-cert-img');
        const imgTitle = wrap.getAttribute('data-cert-title') || 'Certificate View';

        certModalImg.src = imgSrc;
        certModalTitle.textContent = imgTitle;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    certModalClose.addEventListener('click', closeCertModal);
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
      }
    });

    function closeCertModal() {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     10. IN-PAGE RESUME PREVIEW MODAL
     ========================================================================== */
  function initResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const openResumeBtns = document.querySelectorAll('.open-resume-modal-btn');

    if (!resumeModal || !resumeModalClose) return;

    openResumeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    resumeModalClose.addEventListener('click', closeResumeModal);
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeResumeModal();
      }
    });

    function closeResumeModal() {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     11. INTERACTIVE AI LAB: ONCOPREDICT SIMULATOR
     ========================================================================== */
  function initOncoPredictLab() {
    const radiusSlider = document.getElementById('radius-slider');
    const textureSlider = document.getElementById('texture-slider');
    const perimeterSlider = document.getElementById('perimeter-slider');
    const smoothnessSlider = document.getElementById('smoothness-slider');

    const radiusVal = document.getElementById('radius-val');
    const textureVal = document.getElementById('texture-val');
    const perimeterVal = document.getElementById('perimeter-val');
    const smoothnessVal = document.getElementById('smoothness-val');

    const predBox = document.getElementById('prediction-box');
    const predLabel = document.getElementById('pred-result-label');
    const predIcon = document.getElementById('pred-icon');
    const probPercentage = document.getElementById('malignancy-percentage');
    const probBarFill = document.getElementById('prob-bar-fill');

    if (!radiusSlider || !predBox) return;

    function calculateInference() {
      const radius = parseFloat(radiusSlider.value);
      const texture = parseFloat(textureSlider.value);
      const perimeter = parseFloat(perimeterSlider.value);
      const smoothness = parseFloat(smoothnessSlider.value);

      radiusVal.textContent = radius.toFixed(1);
      textureVal.textContent = texture.toFixed(1);
      perimeterVal.textContent = perimeter.toFixed(1);
      smoothnessVal.textContent = smoothness.toFixed(3);

      const z = -11.5 + (radius * 0.38) + (texture * 0.14) + (perimeter * 0.038) + (smoothness * 35.0) - 8.5;
      const probability = 1 / (1 + Math.exp(-z));
      const percentage = (probability * 100).toFixed(1);

      probPercentage.textContent = `${percentage}%`;
      probBarFill.style.width = `${percentage}%`;

      if (probability >= 0.5) {
        predBox.classList.add('malignant');
        predLabel.textContent = 'MALIGNANT CELL PROFILE';
        predLabel.className = 'pred-label malignant';
        predIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      } else {
        predBox.classList.remove('malignant');
        predLabel.textContent = 'BENIGN CELL PROFILE';
        predLabel.className = 'pred-label benign';
        predIcon.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
      }
    }

    [radiusSlider, textureSlider, perimeterSlider, smoothnessSlider].forEach(slider => {
      slider.addEventListener('input', calculateInference);
    });

    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        if (preset === 'benign') {
          radiusSlider.value = 11.2;
          textureSlider.value = 14.8;
          perimeterSlider.value = 72.5;
          smoothnessSlider.value = 0.082;
        } else if (preset === 'malignant') {
          radiusSlider.value = 21.4;
          textureSlider.value = 27.2;
          perimeterSlider.value = 142.0;
          smoothnessSlider.value = 0.125;
        }
        calculateInference();
        showToast(`Loaded ${preset.toUpperCase()} clinical sample parameters.`);
      });
    });

    calculateInference();
  }

  /* ==========================================================================
     12. INTERACTIVE AI LAB: INTELLIRAG VECTOR SEARCH
     ========================================================================== */
  function initRagLab() {
    const labTabs = document.querySelectorAll('.lab-tab');
    const labContents = document.querySelectorAll('.lab-content');

    labTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        labTabs.forEach(t => t.classList.remove('active'));
        labContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetTabId = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) targetContent.classList.add('active');
      });
    });

    const searchInput = document.getElementById('rag-query-input');
    const searchBtn = document.getElementById('rag-search-btn');
    const chunkList = document.getElementById('chunk-list');
    const synthesisBox = document.getElementById('synthesis-box');
    const samplePills = document.querySelectorAll('.sample-query-pill');

    if (!searchInput || !searchBtn || !chunkList || !synthesisBox) return;

    const knowledgeBase = [
      {
        doc: 'ColdChain_Logistics_SOP_v2.pdf (p. 4)',
        tags: ['cold-chain', 'vaccine', 'temperature', 'thresholds', 'storage', 'esp32'],
        text: 'Standard operating regulations for critical biologics mandate storage between 2.0°C and 8.0°C. If ambient telemetry logged via DS18B20 exceeds 8.0°C for greater than 15 consecutive minutes, automated MQTT priority-1 dispatch alerts are broadcasted.',
        similarity: 0.942
      },
      {
        doc: 'AgriSense_Agronomy_Model_Spec.pdf (p. 11)',
        tags: ['agrisense', 'soil', 'loamy', 'crop', 'recommendation', 'yield', 'gemini'],
        text: 'For loamy soils with pH between 6.0 and 7.2 with high organic nitrogen levels, the AgriSense predictive model suggests cotton, wheat, or legumes. Gemini AI combines this with 14-day localized precipitation forecasts to generate sowing timing.',
        similarity: 0.915
      },
      {
        doc: 'MediGuard_Clinical_Safety_Manual.pdf (p. 7)',
        tags: ['drug', 'safety', 'anticoagulant', 'medication', 'precautions', 'alerts'],
        text: 'Patients administered anticoagulant agents (e.g. Warfarin, Apixaban) require strict monitoring for NSAID contraindications (e.g. Ibuprofen, Naproxen). MediGuard flags this combination as HIGH SEVERITY due to elevated gastrointestinal hemorrhage risk.',
        similarity: 0.898
      },
      {
        doc: 'OncoPredict_Diagnostic_Whitepaper.pdf (p. 2)',
        tags: ['oncology', 'breast', 'tumor', 'biopsy', 'cell', 'malignancy'],
        text: 'Cell nucleus contour irregularities, specifically Mean Perimeter exceeding 115mm and Smoothness above 0.118, demonstrate a 92.4% statistical correlation with malignant invasive ductal carcinoma.',
        similarity: 0.785
      }
    ];

    function executeRagSearch() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      const scoredChunks = knowledgeBase.map(item => {
        let matches = 0;
        item.tags.forEach(tag => {
          if (query.includes(tag)) matches += 1;
        });
        const dynamicScore = Math.min(0.985, (item.similarity * 0.7) + (matches * 0.12));
        return { ...item, score: dynamicScore };
      }).sort((a, b) => b.score - a.score);

      chunkList.innerHTML = scoredChunks.slice(0, 3).map(chunk => `
        <div class="chunk-card">
          <div class="chunk-header">
            <span class="chunk-doc"><i class="fa-regular fa-file-lines"></i> ${chunk.doc}</span>
            <span class="chunk-score"><i class="fa-solid fa-chart-line"></i> ${(chunk.score * 100).toFixed(1)}% Match</span>
          </div>
          <p class="chunk-text">${chunk.text}</p>
        </div>
      `).join('');

      const topChunk = scoredChunks[0];
      synthesisBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.85rem; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.8rem;">
          <i class="fa-solid fa-sparkles"></i> Synthesized with RAG Context Injection
        </div>
        <p>
          Based on the retrieved context from <strong>${topChunk.doc}</strong>, 
          the system determines that: <em>"${topChunk.text.substring(0, 180)}..."</em>
        </p>
        <p style="margin-top: 0.85rem;">
          The relevant parameters have been validated with high confidence score of <strong>${(topChunk.score * 100).toFixed(1)}%</strong> cosine similarity in the vector index.
        </p>
        <div class="synthesis-sources">
          <strong>Grounding Source:</strong> ${topChunk.doc}
        </div>
      `;

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.75 }
        });
      }

      showToast('RAG Vector search completed!');
    }

    searchBtn.addEventListener('click', executeRagSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeRagSearch();
    });

    samplePills.forEach(pill => {
      pill.addEventListener('click', () => {
        searchInput.value = pill.getAttribute('data-query');
        executeRagSearch();
      });
    });

    executeRagSearch();
  }

  /* ==========================================================================
     13. COPY BUTTONS & TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy]');

    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          const icon = btn.querySelector('i');
          if (icon) {
            const originalClass = icon.className;
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
              icon.className = originalClass;
            }, 1800);
          }
        }).catch(err => {
          console.error('Clipboard copy failed:', err);
        });
      });
    });
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan);"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  /* ==========================================================================
     14. WORKING CONTACT & COLLABORATE EMAIL DISPATCH
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status');
    const postSubmitBox = document.getElementById('post-submit-options');
    const btnGmailCompose = document.getElementById('btn-gmail-compose');
    const btnCopyDraft = document.getElementById('btn-copy-draft');

    if (!form || !submitBtn || !statusMsg) return;

    let latestDraftText = '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        statusMsg.textContent = 'Please fill out all required fields.';
        statusMsg.className = 'form-status-msg error';
        return;
      }

      const recipient = 'resshu2@gmail.com';
      const mailSubject = `[Portfolio Collaboration] ${subject} - from ${name}`;
      const mailBody = `Hi Resshma,\n\nI am contacting you through your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nLooking forward to hearing from you.`;
      latestDraftText = mailBody;

      // Construct mailto and webmail URLs
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

      // Update Gmail Compose button link
      if (btnGmailCompose) {
        btnGmailCompose.href = gmailUrl;
      }

      // Display sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Preparing Email Dispatch...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message via Email</span> <i class="fa-solid fa-paper-plane"></i>';

        statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Email draft ready! Attempting to launch your email client...`;
        statusMsg.className = 'form-status-msg success';

        if (postSubmitBox) {
          postSubmitBox.style.display = 'block';
        }

        // Trigger native email client
        window.location.href = mailtoUrl;

        // Confetti celebration
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        showToast('Email client triggered!');
      }, 700);
    });

    // Copy Draft Text Button
    if (btnCopyDraft) {
      btnCopyDraft.addEventListener('click', () => {
        if (!latestDraftText) return;
        navigator.clipboard.writeText(latestDraftText).then(() => {
          showToast('Draft message copied to clipboard!');
        });
      });
    }
  }
})();
