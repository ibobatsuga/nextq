/**
 * NextQ — Sistem Antrean Mandiri Terpadu Klinik Gading
 * Offline-first PWA with Web Audio API chime, Web Speech API TTS,
 * BroadcastChannel cross-tab synchronization & Thermal Receipt Printing.
 */

(function () {
  'use strict';

  // --- CONFIG & CONSTANTS ---
  const STORAGE_KEY = 'nextq_klinik_gading_v1';
  const CHANNEL_NAME = 'nextq_broadcast_channel';

  const POLI_CONFIG = {
    A: {
      code: 'A',
      name: 'Poli Umum',
      loket: 'Loket 1 / Ruang 101',
      doctor: 'Dr. Hendra Prasetyo',
      desc: 'Pemeriksaan dokter umum, keluhan demam, flu, tensi & surat sehat.',
      iconClass: 'icon-a',
      badgeClass: 'badge-a',
      color: '#0f766e',
      iconSvg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
    },
    B: {
      code: 'B',
      name: 'Poli Gigi & Mulut',
      loket: 'Loket 2 / Ruang 102',
      doctor: 'Drg. Ratna Anindita',
      desc: 'Perawatan gigi berlubang, pembersihan karang, pencabutan & orto.',
      iconClass: 'icon-b',
      badgeClass: 'badge-b',
      color: '#0284c7',
      iconSvg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>'
    },
    C: {
      code: 'C',
      name: 'Poli KIA & Anak',
      loket: 'Loket 3 / Ruang 103',
      doctor: 'Bidan Siti Sarah, S.Tr.Keb',
      desc: 'Pemeriksaan ibu hamil, imunisasi balita, KB & tumbuh kembang anak.',
      iconClass: 'icon-c',
      badgeClass: 'badge-c',
      color: '#d97706',
      iconSvg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 7v5l3 3"/></svg>'
    },
    D: {
      code: 'D',
      name: 'Farmasi & Apotek',
      loket: 'Loket 4 / Ruang Apotek',
      doctor: 'Apt. Farhan Maulana, S.Farm',
      desc: 'Pengambilan resep obat, konsultasi farmasi & vitamin kesehatan.',
      iconClass: 'icon-d',
      badgeClass: 'badge-d',
      color: '#4f46e5',
      iconSvg: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>'
    }
  };

  // --- INITIAL DATA SEED ---
  const DEFAULT_STATE = {
    date: new Date().toISOString().slice(0, 10),
    counters: {
      A: { code: 'A', currentNumber: 'A-012', currentPatient: 'Bpk. Ahmad Junaedi', servingId: 12, lastCalledAt: '11:42' },
      B: { code: 'B', currentNumber: 'B-005', currentPatient: 'Ibu Kusmartini', servingId: 5, lastCalledAt: '11:35' },
      C: { code: 'C', currentNumber: 'C-003', currentPatient: 'Anak Rafa Azka', servingId: 3, lastCalledAt: '11:20' },
      D: { code: 'D', currentNumber: 'D-009', currentPatient: 'Sdr. Dimas Wahyu', servingId: 9, lastCalledAt: '11:45' }
    },
    lastHeroCall: {
      ticketNumber: 'D-009',
      serviceCode: 'D',
      serviceName: 'Farmasi & Apotek',
      loket: 'Loket 4 / Ruang Apotek',
      patientName: 'Sdr. Dimas Wahyu',
      calledAt: '11:45'
    },
    tickets: [
      { id: 1, number: 'A-001', code: 'A', name: 'Bpk. Supriyanto', category: 'Umum', status: 'completed', createdAt: '08:05', calledAt: '08:15' },
      { id: 2, number: 'A-002', code: 'A', name: 'Ibu Sri Rahayu', category: 'BPJS', status: 'completed', createdAt: '08:10', calledAt: '08:30' },
      { id: 12, number: 'A-012', code: 'A', name: 'Bpk. Ahmad Junaedi', category: 'Umum', status: 'serving', createdAt: '11:25', calledAt: '11:42' },
      { id: 13, number: 'A-013', code: 'A', name: 'Ibu Ningsih', category: 'BPJS', status: 'waiting', createdAt: '11:30', calledAt: null },
      { id: 14, number: 'A-014', code: 'A', name: 'Bpk. Teguh Handoko', category: 'Umum', status: 'waiting', createdAt: '11:35', calledAt: null },
      { id: 15, number: 'A-015', code: 'A', name: 'Sdr. Gilang Ramadhan', category: 'Umum', status: 'waiting', createdAt: '11:40', calledAt: null },

      { id: 5, number: 'B-005', code: 'B', name: 'Ibu Kusmartini', category: 'Umum', status: 'serving', createdAt: '11:15', calledAt: '11:35' },
      { id: 6, number: 'B-006', code: 'B', name: 'Bpk. Haryono', category: 'BPJS', status: 'waiting', createdAt: '11:32', calledAt: null },
      { id: 7, number: 'B-007', code: 'B', name: 'Sdri. Cindy Aurelia', category: 'Asuransi', status: 'waiting', createdAt: '11:41', calledAt: null },

      { id: 3, number: 'C-003', code: 'C', name: 'Anak Rafa Azka', category: 'Umum', status: 'serving', createdAt: '11:00', calledAt: '11:20' },
      { id: 4, number: 'C-004', code: 'C', name: 'Balita Arkananta', category: 'BPJS', status: 'waiting', createdAt: '11:34', calledAt: null },

      { id: 8, number: 'D-008', code: 'D', name: 'Bpk. Joko Purnomo', category: 'Umum', status: 'completed', createdAt: '11:10', calledAt: '11:25' },
      { id: 9, number: 'D-009', code: 'D', name: 'Sdr. Dimas Wahyu', category: 'Umum', status: 'serving', createdAt: '11:20', calledAt: '11:45' },
      { id: 10, number: 'D-010', code: 'D', name: 'Ibu Endang Lestari', category: 'BPJS', status: 'waiting', createdAt: '11:38', calledAt: null },
      { id: 11, number: 'D-011', code: 'D', name: 'Bpk. Bambang M', category: 'Prioritas / Lansia', status: 'waiting', createdAt: '11:44', calledAt: null }
    ]
  };

  // --- STATE CONTAINER ---
  let appState = loadState();
  let selectedOperatorPoli = 'A';
  let audioEnabled = true;
  let broadcast = null;

  try {
    if ('BroadcastChannel' in window) {
      broadcast = new BroadcastChannel(CHANNEL_NAME);
      broadcast.onmessage = function (event) {
        if (event.data && event.data.type === 'STATE_UPDATED') {
          appState = loadState();
          renderAll();
          if (event.data.audioCall) {
            playDingDongAndSpeak(event.data.audioCall);
          }
        }
      };
    }
  } catch (err) {
    console.warn('BroadcastChannel not supported:', err);
  }

  // Also listen for storage event for cross-tab sync fallback
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      appState = loadState();
      renderAll();
    }
  });

  // --- LOCAL STORAGE HELPERS ---
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(raw);
      // Daily reset check
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date !== today) {
        parsed.date = today;
      }
      return parsed;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function saveState(broadcastAudioCall = null) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      if (broadcast) {
        broadcast.postMessage({
          type: 'STATE_UPDATED',
          audioCall: broadcastAudioCall
        });
      }
    } catch (e) {
      console.error('Save state failed:', e);
    }
  }

  // --- SYNTHESIZED SOUND & SPEECH (WEB AUDIO API + WEB SPEECH) ---
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Beautiful modern 2-tone chime (554.37Hz C#5 then 440Hz A4)
  function playAirportChime() {
    if (!audioEnabled) return Promise.resolve();
    try {
      initAudioContext();
      if (!audioCtx) return Promise.resolve();

      return new Promise((resolve) => {
        const now = audioCtx.currentTime;

        // Tone 1: 554.37 Hz (C#5)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(554.37, now);
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.7);

        // Tone 2: 440 Hz (A4)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440.0, now + 0.35);
        gain2.gain.setValueAtTime(0, now + 0.35);
        gain2.gain.linearRampToValueAtTime(0.45, now + 0.4);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.35);
        osc2.stop(now + 1.25);

        setTimeout(resolve, 1100);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
      return Promise.resolve();
    }
  }

  // Indonesian Text-to-Speech Converter
  function speakIndonesianCall(ticketNumber, serviceName, loket) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Format number to natural speech: e.g. "A-012" -> "A, kosong satu dua"
    const parts = ticketNumber.split('-');
    const letter = parts[0] || '';
    const digits = (parts[1] || '').split('').map(d => {
      switch (d) {
        case '0': return 'kosong';
        case '1': return 'satu';
        case '2': return 'dua';
        case '3': return 'tiga';
        case '4': return 'empat';
        case '5': return 'lima';
        case '6': return 'enam';
        case '7': return 'tujuh';
        case '8': return 'delapan';
        case '9': return 'sembilan';
        default: return d;
      }
    }).join(' ');

    const speechText = `Nomor antrean ${letter}, ${digits}. Silakan menuju ke ${serviceName}, ${loket}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Clear and measured pace
    utterance.pitch = 1.05;

    // Pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(v => v.lang && (v.lang.includes('id') || v.lang.includes('ID')));
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  function playDingDongAndSpeak(callInfo) {
    initAudioContext();
    playAirportChime().then(() => {
      speakIndonesianCall(callInfo.ticketNumber, callInfo.serviceName, callInfo.loket);
    });
  }

  // --- CLOCK & TIMERS ---
  function updateClocks() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const headerClock = document.getElementById('headerClock');
    if (headerClock) headerClock.textContent = timeStr;

    const displayBigTime = document.getElementById('displayBigTime');
    if (displayBigTime) displayBigTime.textContent = timeStr.replace(' WIB', '');

    const displayBigDate = document.getElementById('displayBigDate');
    if (displayBigDate) displayBigDate.textContent = dateStr;
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // --- NAVIGATION TAB SWITCHING ---
  function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const viewId = tab.getAttribute('data-view');
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));

        const target = document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1));
        if (target) {
          target.classList.add('active');
        }
      });
    });

    // Audio Toggle
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioLabel = document.getElementById('audioLabel');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        initAudioContext();
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          audioToggleBtn.classList.add('audio-on');
          audioLabel.textContent = 'Audio Aktif';
          playAirportChime();
        } else {
          audioToggleBtn.classList.remove('audio-on');
          audioLabel.textContent = 'Audio Mute';
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
      });
      // Start enabled
      audioToggleBtn.classList.add('audio-on');
    }

    // Fullscreen Toggle on Display Board
    const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
    if (btnToggleFullscreen) {
      btnToggleFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.warn('Fullscreen error:', err);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }
  }

  // --- RENDER 1: KIOS MANDIRI (Ambil Tiket) ---
  function renderKiosk() {
    const grid = document.getElementById('kioskServiceGrid');
    if (!grid) return;

    let html = '';
    Object.keys(POLI_CONFIG).forEach(code => {
      const cfg = POLI_CONFIG[code];
      const waitingCount = appState.tickets.filter(t => t.code === code && t.status === 'waiting').length;
      const currentTicket = appState.counters[code]?.currentNumber || '---';

      html += `
        <div class="service-card" data-code="${code}">
          <div class="service-card-badge ${cfg.badgeClass}">${code}</div>
          <div>
            <div class="service-icon-wrap ${cfg.iconClass}">
              ${cfg.iconSvg}
            </div>
            <div class="service-info">
              <h3>${cfg.name}</h3>
              <p>${cfg.desc}</p>
            </div>
          </div>

          <div>
            <div class="service-stats-pill">
              <span>Sedang Dilayani: <strong>${currentTicket}</strong></span>
              <span>Menunggu: <strong>${waitingCount}</strong></span>
            </div>
            <button type="button" class="btn-service-take" data-take="${code}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              <span>Ambil Nomor ${code}</span>
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Attach click handlers
    grid.querySelectorAll('.btn-service-take').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.getAttribute('data-take');
        generateTicket(code);
      });
    });

    grid.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const code = card.getAttribute('data-code');
        generateTicket(code);
      });
    });
  }

  // Generate new ticket
  function generateTicket(code) {
    initAudioContext();

    const nameInput = document.getElementById('patientNameInput');
    const phoneInput = document.getElementById('patientPhoneInput');
    const catSelect = document.getElementById('patientCategorySelect');

    const patientName = (nameInput && nameInput.value.trim()) || 'Pasien Umum ' + code;
    const category = (catSelect && catSelect.value) || 'Umum';

    // Find next sequence number for this poli today
    const ticketsForPoli = appState.tickets.filter(t => t.code === code);
    let maxSeq = 0;
    ticketsForPoli.forEach(t => {
      const numPart = parseInt(t.number.split('-')[1], 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    });

    const nextSeq = maxSeq + 1;
    const seqPadded = String(nextSeq).padStart(3, '0');
    const ticketNumber = `${code}-${seqPadded}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const fullDateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Count how many are waiting ahead
    const aheadCount = appState.tickets.filter(t => t.code === code && t.status === 'waiting').length;

    const newTicket = {
      id: Date.now(),
      number: ticketNumber,
      code: code,
      name: patientName,
      category: category,
      status: 'waiting',
      createdAt: timeStr,
      calledAt: null
    };

    appState.tickets.push(newTicket);
    saveState();
    renderAll();

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';

    // Show Printable Thermal Ticket Modal
    showTicketModal(newTicket, aheadCount, fullDateStr);
  }

  // --- MODAL TIKET CETAK (Thermal) ---
  function showTicketModal(ticket, aheadCount, fullDateStr) {
    const modal = document.getElementById('ticketModal');
    const cfg = POLI_CONFIG[ticket.code] || {};

    document.getElementById('ticketServiceDisplay').textContent = cfg.name || 'POLI';
    document.getElementById('ticketNumberDisplay').textContent = ticket.number;
    document.getElementById('ticketPatientDisplay').textContent = ticket.name;
    document.getElementById('ticketCategoryDisplay').textContent = ticket.category;
    document.getElementById('ticketTimeDisplay').textContent = `${fullDateStr} ${ticket.createdAt}`;
    document.getElementById('ticketAheadDisplay').textContent = `${aheadCount} Pasien Menunggu`;
    document.getElementById('ticketCodeDisplay').textContent = `KG-${ticket.number}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

    if (modal) {
      modal.hidden = false;
    }
  }

  function initTicketModal() {
    const modal = document.getElementById('ticketModal');
    const closeBtn = document.getElementById('btnCloseTicketModal');
    const doneBtn = document.getElementById('btnDoneTicket');
    const printBtn = document.getElementById('btnPrintTicket');

    const closeModal = () => {
      if (modal) modal.hidden = true;
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  // --- RENDER 2: LAYAR DISPLAY TV ---
  function renderDisplay() {
    // Hero Board
    const heroNum = document.getElementById('heroNumberDisplay');
    const heroDest = document.getElementById('heroDestDisplay');
    const heroPatient = document.getElementById('heroPatientDisplay');
    const heroTime = document.getElementById('heroCallingTimestamp');

    if (appState.lastHeroCall) {
      if (heroNum) heroNum.textContent = appState.lastHeroCall.ticketNumber;
      if (heroDest) heroDest.textContent = `${appState.lastHeroCall.serviceName} (${appState.lastHeroCall.loket})`;
      if (heroPatient) heroPatient.textContent = `Pasien: ${appState.lastHeroCall.patientName}`;
      if (heroTime) heroTime.textContent = `Panggilan Pukul: ${appState.lastHeroCall.calledAt} WIB`;
    }

    // 4 Counter Grid
    const counterGrid = document.getElementById('displayCounterGrid');
    if (!counterGrid) return;

    let html = '';
    Object.keys(POLI_CONFIG).forEach(code => {
      const cfg = POLI_CONFIG[code];
      const counter = appState.counters[code] || {};
      const waitingCount = appState.tickets.filter(t => t.code === code && t.status === 'waiting').length;
      const isActive = appState.lastHeroCall && appState.lastHeroCall.serviceCode === code;

      html += `
        <div class="display-counter-card ${isActive ? 'is-active-counter' : ''}">
          <div class="counter-header-tag">${cfg.loket}</div>
          <div class="counter-name">${cfg.name}</div>
          <div class="counter-num-box">
            <span class="counter-num-label">Sedang Dilayani</span>
            <div class="counter-num-val">${counter.currentNumber || '---'}</div>
          </div>
          <div class="counter-wait-badge">Antrean Menunggu: <strong>${waitingCount}</strong></div>
        </div>
      `;
    });

    counterGrid.innerHTML = html;
  }

  // --- RENDER 3: MEJA PETUGAS & DOKTER ---
  function initOperatorSelect() {
    const sel = document.getElementById('operatorPoliSelect');
    if (!sel) return;

    let html = '';
    Object.keys(POLI_CONFIG).forEach(code => {
      const cfg = POLI_CONFIG[code];
      html += `<option value="${code}" ${code === selectedOperatorPoli ? 'selected' : ''}>${cfg.name} (${cfg.loket})</option>`;
    });
    sel.innerHTML = html;

    sel.addEventListener('change', () => {
      selectedOperatorPoli = sel.value;
      renderOperator();
    });
  }

  function renderOperator() {
    const cfg = POLI_CONFIG[selectedOperatorPoli] || POLI_CONFIG.A;
    const docLabel = document.getElementById('operatorCurrentDoctor');
    if (docLabel) {
      docLabel.textContent = `Petugas: ${cfg.doctor} (${cfg.name})`;
    }

    const counter = appState.counters[selectedOperatorPoli] || {};
    const opServingNumber = document.getElementById('opServingNumber');
    const opServingName = document.getElementById('opServingName');
    const opServingMeta = document.getElementById('opServingMeta');

    const servingTicket = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'serving');

    if (servingTicket) {
      if (opServingNumber) opServingNumber.textContent = servingTicket.number;
      if (opServingName) opServingName.textContent = servingTicket.name;
      if (opServingMeta) opServingMeta.textContent = `Kategori: ${servingTicket.category} • Dipanggil: ${servingTicket.calledAt || '-'}`;
    } else {
      if (opServingNumber) opServingNumber.textContent = '---';
      if (opServingName) opServingName.textContent = 'Tidak ada pasien yang sedang dilayani';
      if (opServingMeta) opServingMeta.textContent = 'Silakan tekan tombol "Panggil Berikutnya" di bawah.';
    }

    // Queue List Menunggu
    const waitingTickets = appState.tickets.filter(t => t.code === selectedOperatorPoli && t.status === 'waiting');
    const opQueueCount = document.getElementById('opQueueCount');
    const opQueuePoliName = document.getElementById('opQueuePoliName');
    const opQueueList = document.getElementById('opQueueList');

    if (opQueueCount) opQueueCount.textContent = waitingTickets.length;
    if (opQueuePoliName) opQueuePoliName.textContent = cfg.name;

    if (opQueueList) {
      if (waitingTickets.length === 0) {
        opQueueList.innerHTML = '<div class="empty-state">Tidak ada pasien yang menunggu di poli ini.</div>';
      } else {
        opQueueList.innerHTML = waitingTickets.map(t => `
          <div class="queue-item">
            <div class="q-left">
              <span class="q-num">${t.number}</span>
              <div>
                <div class="q-name">${t.name}</div>
                <div class="q-sub">${t.category} • Ambil: ${t.createdAt}</div>
              </div>
            </div>
            <button type="button" class="q-call-btn" data-call-id="${t.id}">Panggil</button>
          </div>
        `).join('');

        opQueueList.querySelectorAll('.q-call-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-call-id'));
            callSpecificTicket(id);
          });
        });
      }
    }
  }

  // Operator Actions
  function callNextTicket() {
    initAudioContext();
    const waiting = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'waiting');
    if (!waiting) {
      alert(`Tidak ada antrean menunggu untuk ${POLI_CONFIG[selectedOperatorPoli].name}.`);
      return;
    }

    // Mark current serving as completed if exists
    const currentServing = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'serving');
    if (currentServing) {
      currentServing.status = 'completed';
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    waiting.status = 'serving';
    waiting.calledAt = timeStr;

    const cfg = POLI_CONFIG[selectedOperatorPoli];
    appState.counters[selectedOperatorPoli] = {
      code: selectedOperatorPoli,
      currentNumber: waiting.number,
      currentPatient: waiting.name,
      servingId: waiting.id,
      lastCalledAt: timeStr
    };

    appState.lastHeroCall = {
      ticketNumber: waiting.number,
      serviceCode: selectedOperatorPoli,
      serviceName: cfg.name,
      loket: cfg.loket,
      patientName: waiting.name,
      calledAt: timeStr
    };

    saveState(appState.lastHeroCall);
    renderAll();
    playDingDongAndSpeak(appState.lastHeroCall);
  }

  function callSpecificTicket(ticketId) {
    initAudioContext();
    const ticket = appState.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Mark current serving as completed
    const currentServing = appState.tickets.find(t => t.code === ticket.code && t.status === 'serving');
    if (currentServing && currentServing.id !== ticketId) {
      currentServing.status = 'completed';
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    ticket.status = 'serving';
    ticket.calledAt = timeStr;

    const cfg = POLI_CONFIG[ticket.code];
    appState.counters[ticket.code] = {
      code: ticket.code,
      currentNumber: ticket.number,
      currentPatient: ticket.name,
      servingId: ticket.id,
      lastCalledAt: timeStr
    };

    appState.lastHeroCall = {
      ticketNumber: ticket.number,
      serviceCode: ticket.code,
      serviceName: cfg.name,
      loket: cfg.loket,
      patientName: ticket.name,
      calledAt: timeStr
    };

    saveState(appState.lastHeroCall);
    renderAll();
    playDingDongAndSpeak(appState.lastHeroCall);
  }

  function recallCurrentTicket() {
    initAudioContext();
    const servingTicket = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'serving');
    if (!servingTicket) {
      alert('Tidak ada pasien yang sedang aktif dilayani untuk dipanggil ulang.');
      return;
    }

    const cfg = POLI_CONFIG[selectedOperatorPoli];
    const callInfo = {
      ticketNumber: servingTicket.number,
      serviceCode: selectedOperatorPoli,
      serviceName: cfg.name,
      loket: cfg.loket,
      patientName: servingTicket.name,
      calledAt: servingTicket.calledAt || 'Sekarang'
    };

    appState.lastHeroCall = callInfo;
    saveState(callInfo);
    renderDisplay();
    playDingDongAndSpeak(callInfo);
  }

  function finishCurrentTicket() {
    const servingTicket = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'serving');
    if (!servingTicket) {
      alert('Tidak ada pasien yang sedang dilayani saat ini.');
      return;
    }

    servingTicket.status = 'completed';
    if (appState.counters[selectedOperatorPoli]) {
      appState.counters[selectedOperatorPoli].currentNumber = '---';
      appState.counters[selectedOperatorPoli].currentPatient = '-';
      appState.counters[selectedOperatorPoli].servingId = null;
    }

    saveState();
    renderAll();
  }

  function skipCurrentTicket() {
    const servingTicket = appState.tickets.find(t => t.code === selectedOperatorPoli && t.status === 'serving');
    if (!servingTicket) {
      alert('Tidak ada pasien yang sedang dilayani untuk dilewati.');
      return;
    }

    if (confirm(`Lewati antrean ${servingTicket.number} (${servingTicket.name})? Status akan ditandai Terlewat/Absen.`)) {
      servingTicket.status = 'skipped';
      if (appState.counters[selectedOperatorPoli]) {
        appState.counters[selectedOperatorPoli].currentNumber = '---';
        appState.counters[selectedOperatorPoli].currentPatient = '-';
        appState.counters[selectedOperatorPoli].servingId = null;
      }
      saveState();
      renderAll();
    }
  }

  function addManualPatient() {
    const input = document.getElementById('manualPatientName');
    const name = input ? input.value.trim() : '';
    if (!name) {
      alert('Masukkan nama pasien terlebih dahulu.');
      return;
    }

    const code = selectedOperatorPoli;
    const ticketsForPoli = appState.tickets.filter(t => t.code === code);
    let maxSeq = 0;
    ticketsForPoli.forEach(t => {
      const numPart = parseInt(t.number.split('-')[1], 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    });

    const nextSeq = maxSeq + 1;
    const ticketNumber = `${code}-${String(nextSeq).padStart(3, '0')}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    appState.tickets.push({
      id: Date.now(),
      number: ticketNumber,
      code: code,
      name: name,
      category: 'Walk-in Petugas',
      status: 'waiting',
      createdAt: timeStr,
      calledAt: null
    });

    if (input) input.value = '';
    saveState();
    renderAll();
  }

  function initOperatorControls() {
    const btnNext = document.getElementById('btnOpNext');
    const btnRecall = document.getElementById('btnOpRecall');
    const btnFinish = document.getElementById('btnOpFinish');
    const btnSkip = document.getElementById('btnOpSkip');
    const btnManual = document.getElementById('btnManualAdd');

    if (btnNext) btnNext.addEventListener('click', callNextTicket);
    if (btnRecall) btnRecall.addEventListener('click', recallCurrentTicket);
    if (btnFinish) btnFinish.addEventListener('click', finishCurrentTicket);
    if (btnSkip) btnSkip.addEventListener('click', skipCurrentTicket);
    if (btnManual) btnManual.addEventListener('click', addManualPatient);
  }

  // --- RENDER 4: STATISTIK & REKAP ---
  function renderAnalytics() {
    const total = appState.tickets.length;
    const completed = appState.tickets.filter(t => t.status === 'completed').length;
    const waiting = appState.tickets.filter(t => t.status === 'waiting').length;
    const skipped = appState.tickets.filter(t => t.status === 'skipped').length;

    const statTotalTickets = document.getElementById('statTotalTickets');
    const statCompleted = document.getElementById('statCompleted');
    const statCompletedPct = document.getElementById('statCompletedPct');
    const statWaiting = document.getElementById('statWaiting');
    const statSkipped = document.getElementById('statSkipped');

    if (statTotalTickets) statTotalTickets.textContent = total;
    if (statCompleted) statCompleted.textContent = completed;
    if (statCompletedPct) {
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      statCompletedPct.textContent = `${pct}% tingkat penyelesaian`;
    }
    if (statWaiting) statWaiting.textContent = waiting;
    if (statSkipped) statSkipped.textContent = skipped;

    // History Table
    const filterSelect = document.getElementById('filterPoliHistory');
    const filterCode = filterSelect ? filterSelect.value : 'ALL';
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    let filtered = appState.tickets.slice().reverse();
    if (filterCode !== 'ALL') {
      filtered = filtered.filter(t => t.code === filterCode);
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">Belum ada riwayat antrean untuk filter ini.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const cfg = POLI_CONFIG[t.code] || {};
      let statusBadge = '';
      if (t.status === 'waiting') statusBadge = '<span class="badge-status status-waiting">Menunggu</span>';
      else if (t.status === 'serving') statusBadge = '<span class="badge-status status-serving">Sedang Dilayani</span>';
      else if (t.status === 'completed') statusBadge = '<span class="badge-status status-completed">Selesai</span>';
      else if (t.status === 'skipped') statusBadge = '<span class="badge-status status-skipped">Dilewati</span>';

      return `
        <tr>
          <td><strong>${t.number}</strong></td>
          <td>${cfg.name || t.code}</td>
          <td>${t.name}</td>
          <td>${t.category}</td>
          <td>${t.createdAt}</td>
          <td>${t.calledAt || '-'}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  function initAnalyticsControls() {
    const filterSelect = document.getElementById('filterPoliHistory');
    if (filterSelect) {
      filterSelect.addEventListener('change', renderAnalytics);
    }

    // Export CSV
    const btnExport = document.getElementById('btnExportCsv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const headers = ['No Tiket', 'Poli', 'Nama Pasien', 'Kategori', 'Waktu Ambil', 'Waktu Panggil', 'Status'];
        const rows = appState.tickets.map(t => {
          const cfg = POLI_CONFIG[t.code] || {};
          return [
            `"${t.number}"`,
            `"${cfg.name || t.code}"`,
            `"${t.name.replace(/"/g, '""')}"`,
            `"${t.category}"`,
            `"${t.createdAt}"`,
            `"${t.calledAt || '-'}"`,
            `"${t.status}"`
          ].join(',');
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `NextQ_Antrean_Klinik_Gading_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Reset All Data
    const btnResetAll = document.getElementById('btnResetAll');
    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => {
        if (confirm('Yakin ingin mereset seluruh antrean hari ini? Nomor antrean akan dimulai kembali dari 001.')) {
          appState = {
            date: new Date().toISOString().slice(0, 10),
            counters: {
              A: { code: 'A', currentNumber: '---', currentPatient: '-', servingId: null, lastCalledAt: null },
              B: { code: 'B', currentNumber: '---', currentPatient: '-', servingId: null, lastCalledAt: null },
              C: { code: 'C', currentNumber: '---', currentPatient: '-', servingId: null, lastCalledAt: null },
              D: { code: 'D', currentNumber: '---', currentPatient: '-', servingId: null, lastCalledAt: null }
            },
            lastHeroCall: {
              ticketNumber: '---',
              serviceCode: 'A',
              serviceName: 'Belum Ada Panggilan',
              loket: '-',
              patientName: '-',
              calledAt: '-'
            },
            tickets: []
          };
          saveState();
          renderAll();
          alert('Antrean berhasil direset.');
        }
      });
    }
  }

  // --- UNLOCK AUDIO ON USER TOUCH / CLICK ---
  window.addEventListener('click', function unlockAudio() {
    initAudioContext();
  }, { once: true });

  // --- RENDER MASTER DISPATCHER ---
  function renderAll() {
    renderKiosk();
    renderDisplay();
    renderOperator();
    renderAnalytics();
  }

  // --- PWA SERVICE WORKER REGISTRATION ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('NextQ ServiceWorker registered with scope:', reg.scope);
      }).catch(err => {
        console.warn('NextQ ServiceWorker registration failed:', err);
      });
    });
  }

  // --- BOOTSTRAP ---
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTicketModal();
    initOperatorSelect();
    initOperatorControls();
    initAnalyticsControls();
    renderAll();
  });

})();
