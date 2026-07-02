(() => {
  'use strict';

  const APP_VERSION = 'HTB_CONTROL_ROOM_PRO_V2_2026_07_02';
  const STORAGE_KEY = 'htbControlRoomProV2';
  const $ = (id) => document.getElementById(id);
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const weekKey = () => {
    const d = new Date();
    const first = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - first) / 86400000) + first.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
  };
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const minutesNow = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  };
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const defaultBig3 = [
    { id: uid(), text: 'Attend university seriously and revise one topic', done: false, type: 'study' },
    { id: uid(), text: 'Move one How This Began video forward', done: false, type: 'video' },
    { id: uid(), text: 'Sport + protect sleep + avoid distractions', done: false, type: 'health' },
  ];

  const defaultSocialRules = [
    { id: 'yt', text: 'YouTube: check analytics maximum 2 times, then improve one video idea', done: false, note: 'No refreshing every hour.' },
    { id: 'tk', text: 'TikTok: use only for clips and promotion', done: false, note: 'No endless For You scrolling.' },
    { id: 'x', text: 'X: research, creator networking, or post one useful idea', done: false, note: 'No drama, no arguments.' },
    { id: 'wa', text: 'WhatsApp: communication only', done: false, note: 'Avoid useless groups during deep work.' },
  ];

  const defaultProtection = [
    { id: 'alcohol', text: 'No alcohol today', done: false, note: '90-day clean focus challenge.' },
    { id: 'girls', text: 'No chasing girls or late-night emotional chats', done: false, note: 'Respect people, but protect your mission.' },
    { id: 'peer', text: 'No peer pressure decision', done: false, note: 'Do not follow the crowd.' },
    { id: 'scroll', text: 'No random scrolling', done: false, note: 'Open app before opening feeds.' },
    { id: 'sleep', text: 'Phone away before sleep', done: false, note: 'Protect 11:00 PM sleep.' },
  ];

  const videoSteps = [
    { id: 'research', label: 'Research', note: 'Facts + sources' },
    { id: 'hook', label: 'Hook + Title', note: 'First 15 seconds' },
    { id: 'script', label: 'Script', note: 'Simple global English' },
    { id: 'voice', label: 'Voice-over', note: 'Clean serious narration' },
    { id: 'visuals', label: 'Visuals', note: 'Footage + AI images' },
    { id: 'edit', label: 'Edit + subtitles', note: 'CapCut polish' },
    { id: 'thumb', label: 'Thumbnail + SEO', note: 'Clickable but true' },
    { id: 'publish', label: 'Publish / schedule', note: '2 videos every week' },
  ];

  const agendaTemplates = {
    class: [
      ['05:00', 'Wake up + prayer', 'Start clean. No phone scrolling.', 'soul'],
      ['05:15', 'Plan day + light reading', 'Choose Big 3 and review class tasks.', 'plan'],
      ['05:40', 'Sport', 'Constant discipline before the world distracts you.', 'health'],
      ['06:25', 'Prepare for university', 'Shower, breakfast, bag, move early.', 'life'],
      ['08:00', 'Morning class', 'Focus. Ask or write what you do not understand.', 'class'],
      ['12:30', 'Lunch + reset', 'Eat, rest, avoid useless groups.', 'reset'],
      ['14:00', 'Afternoon class', 'If cancelled, press recovered time plan.', 'class'],
      ['17:30', 'University revision', 'Assignments, notes, or exam preparation.', 'study'],
      ['19:00', 'How This Began / coding block', 'Script, edit, research, or build project.', 'create'],
      ['20:45', 'Social media with purpose', 'Post/research only. No random scrolling.', 'social'],
      ['21:30', 'Review + prepare tomorrow', 'Save review and set tomorrow’s first action.', 'review'],
      ['22:30', 'Phone away', 'No girls drama, no scrolling, no alcohol plan.', 'discipline'],
      ['23:00', 'Sleep', 'Your 5 AM future starts here.', 'sleep'],
    ],
    holiday: [
      ['05:00', 'Wake up + prayer', 'Keep same identity even in holiday.', 'soul'],
      ['05:40', 'Sport', 'Stay strong and clear.', 'health'],
      ['06:40', 'Coding deep work', 'Build portfolio/project skill.', 'coding'],
      ['09:00', 'University revision', 'Do not forget class knowledge.', 'study'],
      ['11:00', 'How This Began research/script', 'Batch one strong video.', 'create'],
      ['13:00', 'Lunch + recovery', 'Quiet reset. No useless hangouts.', 'reset'],
      ['14:30', 'Video editing / visuals', 'CapCut, subtitles, thumbnail, footage.', 'edit'],
      ['17:00', 'Outdoor walk or sport light', 'Introvert recharge without laziness.', 'health'],
      ['19:00', 'Upload / clips / social promotion', 'YT, TikTok, X with purpose.', 'social'],
      ['21:00', 'Reading + review', 'Prepare tomorrow. Protect mission.', 'review'],
      ['23:00', 'Sleep', 'No late-night chats.', 'sleep'],
    ],
    deep: [
      ['05:00', 'Wake up + prayer', 'Start without negotiation.', 'soul'],
      ['05:40', 'Sport', 'Constant discipline.', 'health'],
      ['06:40', 'Deep work block 1', 'Coding or difficult university topic.', 'coding'],
      ['09:00', 'Deep work block 2', 'How This Began script/research.', 'create'],
      ['11:30', 'Admin + food', 'Small tasks only.', 'life'],
      ['13:00', 'Deep work block 3', 'Editing, visuals, or project building.', 'edit'],
      ['16:00', 'Revision / learning', 'Keep university protected.', 'study'],
      ['18:30', 'Social media promotion', 'Post, reply, then leave.', 'social'],
      ['20:00', 'Light creative work', 'Ideas, titles, thumbnails.', 'create'],
      ['21:30', 'Review + plan tomorrow', 'Win the day on paper.', 'review'],
      ['23:00', 'Sleep', 'Protect energy.', 'sleep'],
    ],
  };

  const recoveredPlan = [
    ['14:00', 'Eat + 15 min rest', 'Reset first. Do not open TikTok.'],
    ['14:20', '50 min university revision', 'Use the class gap to strengthen weak topic.'],
    ['15:20', '50 min HTB production', 'Write hook/script or generate visuals.'],
    ['16:20', '30 min coding practice', 'Small project progress only.'],
    ['16:55', 'Prepare evening plan', 'Return to normal routine without scrolling.'],
  ];

  const state = loadState();
  let deferredInstallPrompt = null;
  let timer = { total: 25 * 60, left: 25 * 60, running: false, interval: null };
  let toastTimer = null;

  function loadState() {
    const fallback = { version: APP_VERSION, days: {}, settings: { mode: 'class' }, ideas: [], streak: 0, lastCompletedDate: '' };
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === 'object' ? { ...fallback, ...parsed } : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getDay() {
    const key = todayKey();
    if (!state.days[key]) {
      state.days[key] = {
        big3: structuredCloneSafe(defaultBig3),
        social: structuredCloneSafe(defaultSocialRules),
        protection: structuredCloneSafe(defaultProtection),
        video: {},
        completedAgenda: {},
        focusMinutes: 0,
        review: '',
        notified: {},
        finished: false,
      };
      saveState();
    }
    return state.days[key];
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3600);
  }

  function setMode(mode) {
    state.settings.mode = mode;
    saveState();
    document.querySelectorAll('.mode-tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
    const notes = {
      class: '8:00–12:30 class, 14:00–17:00 class if lecture exists.',
      holiday: 'Holiday does not mean lazy: coding, videos, sport, revision, quiet growth.',
      deep: 'No class or light class: protect long focus blocks and produce real output.',
    };
    $('modeBadge').textContent = mode === 'class' ? 'Class Day' : mode === 'holiday' ? 'Holiday Mode' : 'Deep Work';
    $('modeNote').textContent = notes[mode];
    $('classCancelledBtn').style.display = mode === 'class' ? 'block' : 'none';
    renderAgenda();
    updateScore();
  }

  function renderBig3() {
    const day = getDay();
    $('big3List').innerHTML = day.big3.map((item) => checkMarkup(item, 'big3')).join('');
    $('big3Progress').textContent = `${day.big3.filter((x) => x.done).length}/${day.big3.length}`;
  }

  function renderSocial() {
    const day = getDay();
    $('socialRules').innerHTML = day.social.map((item) => checkMarkup(item, 'social')).join('');
  }

  function renderProtection() {
    const day = getDay();
    $('protectionList').innerHTML = day.protection.map((item) => checkMarkup(item, 'protection')).join('');
    $('protectionScore').textContent = `${day.protection.filter((x) => x.done).length}/${day.protection.length}`;
  }

  function checkMarkup(item, group) {
    const note = item.note ? `<small>${escapeHTML(item.note)}</small>` : '';
    const deleteButton = group === 'big3' ? `<button class="delete-mini" data-delete="${escapeHTML(item.id)}" type="button">×</button>` : '<span></span>';
    return `<label class="check-item ${item.done ? 'done' : ''}">
      <input type="checkbox" data-group="${group}" data-id="${escapeHTML(item.id)}" ${item.done ? 'checked' : ''} />
      <span>${escapeHTML(item.text)}${note}</span>
      ${deleteButton}
    </label>`;
  }

  function renderAgenda() {
    const day = getDay();
    const agenda = agendaTemplates[state.settings.mode] || agendaTemplates.class;
    const now = minutesNow();
    $('agendaList').innerHTML = agenda.map(([time, title, desc, tag]) => {
      const start = toMinutes(time);
      const isCurrent = now >= start && now < start + 45;
      const done = !!day.completedAgenda[time];
      return `<div class="agenda-item ${isCurrent ? 'current' : ''}">
        <div class="agenda-time">${time}</div>
        <label class="agenda-main">
          <input type="checkbox" data-agenda-time="${time}" ${done ? 'checked' : ''} aria-label="Mark ${escapeHTML(title)} done" />
          <span class="agenda-title">${escapeHTML(title)}</span>
          <span class="agenda-desc">${escapeHTML(desc)}</span>
        </label>
        <span class="agenda-tag">${escapeHTML(tag)}</span>
      </div>`;
    }).join('');
    updateNextAction();
  }

  function renderRecoveredPlan() {
    $('recoveredPlan').innerHTML = recoveredPlan.map(([time, title, desc]) => `<div class="agenda-item current">
      <div class="agenda-time">${time}</div>
      <div><div class="agenda-title">${escapeHTML(title)}</div><div class="agenda-desc">${escapeHTML(desc)}</div></div>
      <span class="agenda-tag">save time</span>
    </div>`).join('');
  }

  function renderVideoSteps() {
    const day = getDay();
    $('videoSteps').innerHTML = videoSteps.map((step) => `<label class="step-card ${day.video[step.id] ? 'done' : ''}">
      <input type="checkbox" data-video-step="${step.id}" ${day.video[step.id] ? 'checked' : ''} />
      <strong>${escapeHTML(step.label)}</strong>
      <span>${escapeHTML(step.note)}</span>
    </label>`).join('');
    const week = weekKey();
    const publishedThisWeek = Object.values(state.days).filter((d) => d.week === week).reduce((count, d) => count + (d.video?.publish ? 1 : 0), 0);
    // Weekly target: publish or schedule two strong How This Began videos.
    $('videoProgress').textContent = `${Math.min(publishedThisWeek, 2)}/2`;
    renderIdeas();
  }

  function renderIdeas() {
    const latest = state.ideas.slice(-5).reverse();
    $('savedIdeas').innerHTML = latest.map((idea) => `<div class="idea">${escapeHTML(idea.text)} <small>• ${escapeHTML(idea.date)}</small></div>`).join('');
  }

  function updateScore() {
    const day = getDay();
    const all = [
      ...day.big3,
      ...day.social,
      ...day.protection,
      ...videoSteps.map((s) => ({ done: !!day.video[s.id] })),
      ...Object.values(day.completedAgenda).map((done) => ({ done })),
    ];
    const done = all.filter((item) => item.done).length;
    const total = Math.max(all.length, 1);
    const score = Math.round((done / total) * 100);
    $('scoreText').textContent = `${score}%`;
    $('scoreRing').style.setProperty('--score', score);
    $('scoreSubtext').textContent = `${done} done • ${total - done} left`;
    $('disciplineValue').textContent = `${score}%`;
    $('focusValue').textContent = String(day.focusMinutes || 0);
    $('big3Progress').textContent = `${day.big3.filter((x) => x.done).length}/${day.big3.length}`;
    $('protectionScore').textContent = `${day.protection.filter((x) => x.done).length}/${day.protection.length}`;
  }

  function updateNextAction() {
    const agenda = agendaTemplates[state.settings.mode] || agendaTemplates.class;
    const now = minutesNow();
    const next = agenda.find(([time]) => toMinutes(time) >= now) || agenda[0];
    $('nextAction').textContent = next ? `Next action: ${next[0]} — ${next[1]}` : 'Next action: review your day';
  }

  function renderStats() {
    const day = getDay();
    $('todayLabel').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    $('focusToday').textContent = `${day.focusMinutes || 0} min today`;
    $('streakValue').textContent = String(state.streak || 0);
    $('reviewText').value = day.review || '';
  }

  function startNotificationLoop() {
    setInterval(() => {
      const day = getDay();
      const agenda = agendaTemplates[state.settings.mode] || agendaTemplates.class;
      const now = minutesNow();
      for (const [time, title, desc] of agenda) {
        const start = toMinutes(time);
        const key = `${todayKey()}-${time}`;
        const beforeKey = `${key}-before`;
        if (now === start - 10 && !day.notified[beforeKey]) {
          notify(`In 10 minutes: ${title}`, desc);
          day.notified[beforeKey] = true;
          saveState();
        }
        if (now === start && !day.notified[key]) {
          notify(`Start now: ${title}`, desc);
          day.notified[key] = true;
          saveState();
        }
      }
      renderAgenda();
    }, 30000);
  }

  async function notify(title, body) {
    if (!('Notification' in window)) {
      toast('This browser does not support notifications.');
      return;
    }
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg?.showNotification) {
        await reg.showNotification(title, { body, icon: 'icon-192.png', badge: 'badge-72.png', tag: 'htb-control-room' });
      } else {
        new Notification(title, { body, icon: 'icon-192.png' });
      }
    }
  }

  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('service-worker.js');
        $('pwaStatus').textContent = 'PWA ready';
        return reg;
      } catch (error) {
        $('pwaStatus').textContent = 'SW failed';
        console.warn('Service worker registration failed:', error);
      }
    } else {
      $('pwaStatus').textContent = 'No SW';
    }
    return null;
  }

  function initInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $('installBtn').hidden = false;
    });
    $('installBtn').addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        toast('Open this site in Chrome/Edge and use browser menu → Install app.');
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
    });
  }

  function initTimer() {
    const updateDisplay = () => {
      const m = Math.floor(timer.left / 60).toString().padStart(2, '0');
      const s = Math.floor(timer.left % 60).toString().padStart(2, '0');
      $('timerDisplay').textContent = `${m}:${s}`;
    };
    const resetFromSelect = () => {
      timer.total = Number($('focusMinutes').value) * 60;
      timer.left = timer.total;
      timer.running = false;
      clearInterval(timer.interval);
      updateDisplay();
    };
    $('focusMinutes').addEventListener('change', resetFromSelect);
    $('startTimerBtn').addEventListener('click', () => {
      if (timer.running) return;
      timer.running = true;
      const task = $('focusTask').value.trim() || 'Focus sprint';
      toast(`Started: ${task}`);
      timer.interval = setInterval(() => {
        timer.left -= 1;
        updateDisplay();
        if (timer.left <= 0) {
          clearInterval(timer.interval);
          timer.running = false;
          const day = getDay();
          day.focusMinutes = (day.focusMinutes || 0) + Math.round(timer.total / 60);
          saveState();
          renderStats();
          updateScore();
          notify('Focus sprint complete', task);
          resetFromSelect();
        }
      }, 1000);
    });
    $('pauseTimerBtn').addEventListener('click', () => {
      timer.running = false;
      clearInterval(timer.interval);
      toast('Timer paused.');
    });
    $('resetTimerBtn').addEventListener('click', resetFromSelect);
    resetFromSelect();
  }

  function bindEvents() {
    document.querySelectorAll('.mode-tab').forEach((btn) => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
    $('resetDayBtn').addEventListener('click', () => {
      if (!confirm('Reset today data?')) return;
      delete state.days[todayKey()];
      saveState();
      renderAll();
      toast('Today reset.');
    });
    $('addBig3Btn').addEventListener('click', () => {
      const input = $('big3Input');
      const text = input.value.trim();
      if (!text) return;
      const day = getDay();
      day.big3.push({ id: uid(), text, done: false, type: 'custom' });
      input.value = '';
      saveState();
      renderAll();
    });
    document.addEventListener('change', (event) => {
      const el = event.target;
      const day = getDay();
      if (el.matches('input[data-group]')) {
        const group = el.dataset.group;
        const item = day[group]?.find((x) => x.id === el.dataset.id);
        if (item) item.done = el.checked;
        saveState();
        renderAll();
      }
      if (el.matches('input[data-video-step]')) {
        day.video[el.dataset.videoStep] = el.checked;
        day.week = weekKey();
        saveState();
        renderAll();
      }
      if (el.matches('input[data-agenda-time]')) {
        day.completedAgenda[el.dataset.agendaTime] = el.checked;
        saveState();
        updateScore();
      }
    });
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-delete]');
      if (!btn) return;
      const day = getDay();
      day.big3 = day.big3.filter((item) => item.id !== btn.dataset.delete);
      saveState();
      renderAll();
    });
    $('classCancelledBtn').addEventListener('click', () => {
      renderRecoveredPlan();
      $('recoveredPanel').hidden = false;
      $('recoveredPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      notify('Recovered time plan ready', 'Your afternoon class was cancelled. Use this time well.');
    });
    $('closeRecoveredBtn').addEventListener('click', () => $('recoveredPanel').hidden = true);
    $('notifyBtn').addEventListener('click', async () => {
      await notify('HTB notifications enabled', 'Your control room can now remind you while the browser allows it.');
      toast(`Notification permission: ${Notification.permission}`);
    });
    $('testNotificationBtn').addEventListener('click', () => notify('Test notification', 'If you see this, local notification works.'));
    $('enablePushBtn').addEventListener('click', async () => {
      if (window.enableHTBPush) {
        const token = await window.enableHTBPush();
        $('pushTokenBox').value = token || 'No token. Check Firebase config and browser console.';
      } else {
        toast('FCM module not ready. Check fcm-config.js.');
      }
    });
    $('saveVideoIdeaBtn').addEventListener('click', () => {
      const text = $('videoTitleInput').value.trim();
      if (!text) return;
      state.ideas.push({ id: uid(), text, date: todayKey() });
      $('videoTitleInput').value = '';
      saveState();
      renderIdeas();
      toast('Video idea saved.');
    });
    $('loadHolidayBtn').addEventListener('click', () => setMode('holiday'));
    $('saveReviewBtn').addEventListener('click', () => {
      const day = getDay();
      day.review = $('reviewText').value.trim();
      day.finished = true;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      if (state.lastCompletedDate !== todayKey()) {
        state.streak = state.lastCompletedDate === yKey ? (state.streak || 0) + 1 : 1;
        state.lastCompletedDate = todayKey();
      }
      saveState();
      renderAll();
      toast('Daily review saved. Keep going.');
    });
    $('exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `htb-control-room-${todayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function renderAll() {
    renderBig3();
    renderSocial();
    renderProtection();
    renderAgenda();
    renderVideoSteps();
    renderStats();
    updateScore();
  }

  async function boot() {
    $('installBtn').hidden = true;
    await registerServiceWorker();
    initInstallPrompt();
    bindEvents();
    initTimer();
    setMode(state.settings.mode || 'class');
    renderAll();
    startNotificationLoop();
    if (!localStorage.getItem('htbV2Seen')) {
      localStorage.setItem('htbV2Seen', 'yes');
      toast('New colors loaded: Midnight Navy + Emerald + Gold.');
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
