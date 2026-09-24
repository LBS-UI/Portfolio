/* ===== Lumiber Studios — Main Script ===== */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const loader = document.getElementById('loader');
  const progressFill = document.getElementById('progress-fill');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderText = document.getElementById('loader-text');
  const changelogModal = document.getElementById('changelog-modal');
  const particlesCanvas = document.getElementById('particles-canvas');
  const cursorGlow = document.getElementById('cursor-glow');
  const musicToggle = document.getElementById('music-toggle');
  const musicPanel = document.getElementById('music-panel');
  const playPauseBtn = document.getElementById('play-pause');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const lumiOrb = document.getElementById('lumi-orb');
  const lumiPanel = document.getElementById('lumi-panel');
  const lumiMessages = document.getElementById('lumi-messages');
  const startTourBtn = document.getElementById('start-tour');
  const exploreSelfBtn = document.getElementById('explore-self');
  const disableLumiBtn = document.getElementById('disable-lumi');
  const lumiClose = document.getElementById('lumi-close');
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.nav');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // ---------- State ----------
  let audioCtx = null;
  let ambientNodes = [];
  let isPlaying = false;
  let isMuted = false;
  let masterGain = null;
  let lumiDisabled = localStorage.getItem('lumiDisabled') === 'true';
  let musicEnabled = false;

  // ---------- Loader Sequence ----------
  const loaderMessages = [
    'Initializing Lumiber Studios...',
    'Loading Creative Systems...',
    'Calibrating Visual Engine...',
    'Awakening Lumi...',
    'Welcome.'
  ];

  function runLoader() {
    let progress = 0;
    let msgIndex = 0;
    const duration = 2800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      progressFill.style.width = progress + '%';
      loaderPercent.textContent = progress + '%';

      const targetMsg = Math.min(
        loaderMessages.length - 1,
        Math.floor((progress / 100) * loaderMessages.length)
      );
      if (targetMsg !== msgIndex) {
        msgIndex = targetMsg;
        loaderText.textContent = loaderMessages[msgIndex];
      }

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          loader.classList.add('fade-out');
          setTimeout(() => {
            loader.remove();
            document.body.style.cursor = 'none';
            showChangelogIfNeeded();
            initParticles();
            initScrollAnimations();
            if (!lumiDisabled) {
              setTimeout(() => openLumiGreeting(), 1200);
            }
          }, 800);
        }, 400);
      }
    }
    requestAnimationFrame(tick);
  }

  // ---------- Changelog ----------
  function showChangelogIfNeeded() {
    if (localStorage.getItem('changelogSeen') === 'true') return;
    changelogModal.classList.remove('hidden');
  }

  function closeChangelog() {
    changelogModal.classList.add('hidden');
    localStorage.setItem('changelogSeen', 'true');
  }

  document.getElementById('close-changelog')?.addEventListener('click', closeChangelog);
  document.getElementById('close-changelog-2')?.addEventListener('click', closeChangelog);
  document.getElementById('view-updates')?.addEventListener('click', () => {
    closeChangelog();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ---------- Particles ----------
  function initParticles() {
    const canvas = particlesCanvas;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.35,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.38 + 0.12,
        pulse: Math.random() * Math.PI * 2
      };
    }

    function init() {
      resize();
      const count = Math.min(90, Math.floor((w * h) / 14000));
      particles = Array.from({ length: count }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${a})`;
        ctx.fill();
      }

      // subtle connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.09 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      init();
    });

    init();
    draw();
  }

  // ---------- Custom Cursor ----------
  function initCursor() {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    // hover enlarge on interactive
    document.querySelectorAll('a, button, .project-card, .service-card, .lumi-orb').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '44px';
        cursorGlow.style.height = '44px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, transparent 70%)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '20px';
        cursorGlow.style.height = '20px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)';
      });
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ---------- Ambient Music (Web Audio synthesis) ----------
  function createAmbient() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = parseFloat(volumeSlider.value);
    masterGain.connect(audioCtx.destination);

    // soft pads / drones
    const freqs = [110, 164.81, 220, 277.18, 329.63]; // A2, E3, A3, C#4, E4
    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      filter.type = 'lowpass';
      filter.frequency.value = 800 + i * 100;
      filter.Q.value = 0.7;

      gain.gain.value = 0.04 + (i * 0.008);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      ambientNodes.push({ osc, gain, filter });
    });

    // gentle LFO on filter for movement
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    ambientNodes.forEach(n => {
      lfoGain.connect(n.filter.frequency);
    });
    lfo.start();
    ambientNodes.push({ osc: lfo, gain: lfoGain });
  }

  function startMusic() {
    createAmbient();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(parseFloat(volumeSlider.value), audioCtx.currentTime + 1.8);
    isPlaying = true;
    playPauseBtn.textContent = '❚❚';
    musicToggle.classList.add('active');
    musicToggle.querySelector('.music-label').textContent = 'Ambient Mode On';
    musicPanel.classList.remove('hidden');
  }

  function stopMusic() {
    if (!masterGain) return;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
    isPlaying = false;
    playPauseBtn.textContent = '▶';
    musicToggle.classList.remove('active');
    musicToggle.querySelector('.music-label').textContent = 'Enable Ambient Mode';
  }

  function toggleMusic() {
    if (!musicEnabled) {
      musicEnabled = true;
      startMusic();
    } else if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) stopMusic();
    else startMusic();
  });

  volumeSlider.addEventListener('input', () => {
    if (masterGain && !isMuted) {
      masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value), audioCtx.currentTime);
    }
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (masterGain) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : parseFloat(volumeSlider.value), audioCtx.currentTime);
    }
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  // ---------- Lumi AI ----------
  const tourSteps = [
    { sel: '#hero', msg: 'This is our cinematic hero — the first impression of every visitor.' },
    { sel: '#about', msg: 'Here you can discover our mission, vision, and core values.' },
    { sel: '#services', msg: 'We offer web development, multimedia, AI solutions, and creative technology.' },
    { sel: '#portfolio', msg: 'Browse selected projects. Use the filters to explore by category.' },
    { sel: '#contact', msg: 'Ready to collaborate? Send us a transmission from the contact form.' }
  ];

  function openLumiGreeting() {
    if (lumiDisabled) return;
    lumiPanel.classList.remove('hidden');
  }

  function setLumiMessage(text) {
    lumiMessages.innerHTML = `<div class="lumi-msg">${text}</div>`;
  }

  lumiOrb.addEventListener('click', () => {
    if (lumiDisabled) return;
    lumiPanel.classList.toggle('hidden');
  });

  lumiClose.addEventListener('click', () => {
    lumiPanel.classList.add('hidden');
  });

  startTourBtn.addEventListener('click', () => {
    lumiPanel.classList.add('hidden');
    runTour(0);
  });

  exploreSelfBtn.addEventListener('click', () => {
    setLumiMessage('Enjoy exploring Lumiber Studios at your own pace. I\'m here if you need me.');
    setTimeout(() => lumiPanel.classList.add('hidden'), 2200);
  });

  disableLumiBtn.addEventListener('click', () => {
    lumiDisabled = true;
    localStorage.setItem('lumiDisabled', 'true');
    lumiPanel.classList.add('hidden');
    document.getElementById('lumi').style.display = 'none';
  });

  function runTour(index) {
    if (index >= tourSteps.length) {
      setLumiMessage('Tour complete! Feel free to explore further or send us a message.');
      lumiPanel.classList.remove('hidden');
      return;
    }
    const step = tourSteps[index];
    const el = document.querySelector(step.sel);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setLumiMessage(step.msg);
      lumiPanel.classList.remove('hidden');
      setTimeout(() => {
        lumiPanel.classList.add('hidden');
        setTimeout(() => runTour(index + 1), 600);
      }, 3200);
    }
  }

  // ---------- Portfolio Filters ----------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        }
      });
    });
  });

  // ---------- Contact Form ----------
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    toast.textContent = `Transmission received, ${name || 'creator'}. We'll be in touch soon.`;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    contactForm.reset();
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3500);
  });

  // ---------- Header scroll ----------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // ---------- Mobile nav ----------
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ---------- Scroll Animations ----------
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }

  // ---------- Subtle hover sound (optional, very soft) ----------
  // Using Web Audio for a tiny click/hover chirp if music context exists
  function playHoverChirp() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.value = 880;
    osc.type = 'sine';
    g.gain.value = 0.015;
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.stop(audioCtx.currentTime + 0.09);
  }

  document.querySelectorAll('.btn, .filter-btn, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isPlaying) playHoverChirp();
    });
  });

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    runLoader();
    initCursor();

    // restore Lumi disabled state
    if (lumiDisabled) {
      document.getElementById('lumi').style.display = 'none';
    }
  });

})();
