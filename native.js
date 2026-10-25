// Native extras for the iPhone app (Capacitor). Does nothing on the plain website.
(() => {
  const C = window.Capacitor;
  const isNative = !!(C && C.isNativePlatform && C.isNativePlatform());
  const standalone = window.matchMedia && (matchMedia('(display-mode: standalone)').matches || navigator.standalone);
  if (!isNative && !standalone) return;
  document.body.classList.add('native');

  // app chrome: icons in the tab bar, a compact top bar on inner screens, the big header on Accueil only
  const ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    cards: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="13" height="16" rx="2.5" fill="currentColor"/><rect x="9" y="2.5" width="12" height="15" rx="2.5" fill="currentColor" opacity=".5"/></svg>',
    quiz: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="currentColor"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.2" fill="#fff"/></svg>',
    verbs: '<svg viewBox="0 0 24 24"><path d="M4 5h16M4 10h10M4 15h16M4 20h8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    phrases: '<svg viewBox="0 0 24 24"><path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
    games: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5.5" fill="currentColor"/><path d="M7 10.5v4M5 12.5h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="11.5" r="1.3" fill="#fff"/><circle cx="18.5" cy="14" r="1.3" fill="#fff"/></svg>'
  };
  document.querySelectorAll('.tab').forEach(t => { const v = t.dataset.view; if (ICONS[v]) t.insertAdjacentHTML('afterbegin', ICONS[v]); });
  const bar = document.createElement('div'); bar.className = 'appbar'; bar.innerHTML = '<span class="appbar-title"></span>';
  document.body.appendChild(bar);
  const titleOf = () => { const t = document.querySelector('.tab.on'); return t ? t.textContent.trim() : ''; };
  const syncView = () => { const t = document.querySelector('.tab.on'); const home = !t || t.dataset.view === 'home'; document.body.classList.toggle('home', home); bar.querySelector('.appbar-title').textContent = home ? '' : titleOf(); };
  new MutationObserver(syncView).observe(document.getElementById('tabs'), { attributes: true, subtree: true, attributeFilter: ['class'] });
  syncView();
  // home hero: one big Continuer button that opens the next planet on the path
  const top = document.querySelector('header.top');
  if (top) {
    const cta = document.createElement('button'); cta.className = 'btn pink cta'; cta.textContent = 'Continuer';
    top.insertAdjacentElement('afterend', cta);
    cta.onclick = () => { const n = document.querySelector('.pnode.current .pbtn') || document.querySelector('.pbtn[data-path]'); if (n) n.click(); else document.querySelector('.tab[data-view="quiz"]').click(); };
  }
  if (!isNative) return;
  const plugin = name => { try { return C.registerPlugin(name); } catch (e) { return null; } };
  const Haptics = plugin('Haptics'), StatusBar = plugin('StatusBar'), Notes = plugin('LocalNotifications');
  const quiet = p => { if (p && p.catch) p.catch(() => {}); };

  // Light text on the purple status bar, no pinch zoom inside the app
  if (StatusBar) quiet(StatusBar.setStyle({ style: 'LIGHT' }));
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.content = 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';

  // Haptics: a soft tap when stars are earned, a buzz on a wrong pick
  if (Haptics && window.LPO) {
    const award = window.LPO.award;
    window.LPO.award = (el, n) => { quiet(Haptics.notification({ type: 'SUCCESS' })); return award(el, n); };
    document.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      setTimeout(() => { if (b.classList.contains('wrong')) quiet(Haptics.notification({ type: 'ERROR' })); }, 0);
    });
  }

  // Daily reminder (phone only). Settings live in their own localStorage key.
  if (!Notes) return;
  const KEY = 'lpo_reminder';
  let R = { on: false, hour: 19, minute: 0 };
  try { Object.assign(R, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const saveR = () => { try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) {} };
  const LINES = [
    'Cosmo t’attend. Cinq minutes de français ?',
    'Un petit tour dans l’observatoire ce soir ?',
    'Ta série d’étoiles a besoin de toi.',
    'Allez, dix questions et c’est fait.'
  ];
  const schedule = async () => {
    await Notes.cancel({ notifications: [{ id: 1 }] });
    if (!R.on) return;
    const perm = await Notes.requestPermissions();
    if (perm.display !== 'granted') { R.on = false; saveR(); render(); return; }
    await Notes.schedule({ notifications: [{
      id: 1, title: 'Le Petit Observatoire',
      body: LINES[Math.floor(Math.random() * LINES.length)],
      schedule: { on: { hour: R.hour, minute: R.minute }, allowWhileIdle: true }
    }] });
  };
  const pad = n => String(n).padStart(2, '0');
  const panel = document.getElementById('levels');
  if (!panel) return;
  const row = document.createElement('div');
  row.className = 'reminder';
  row.innerHTML = '<h2>Rappel quotidien</h2><div class="reminderRow"><button class="btn plain" id="remToggle"></button><input type="time" id="remTime" aria-label="Heure du rappel"></div><p class="small">A little nudge on your phone once a day. Pick the time, and turn it off whenever you like.</p>';
  panel.parentNode.appendChild(row);
  const tog = row.querySelector('#remToggle'), time = row.querySelector('#remTime');
  function render() {
    tog.textContent = R.on ? 'Rappel : oui' : 'Rappel : non';
    tog.classList.toggle('on', R.on);
    time.value = pad(R.hour) + ':' + pad(R.minute);
  }
  tog.onclick = () => { R.on = !R.on; saveR(); render(); quiet(schedule()); };
  time.onchange = () => { const [h, m] = time.value.split(':').map(Number); if (!isNaN(h)) { R.hour = h; R.minute = m || 0; saveR(); quiet(schedule()); } };
  render();
  if (R.on) quiet(schedule());
})();
