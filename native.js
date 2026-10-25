// Native extras for the iPhone app (Capacitor). Does nothing on the plain website.
(() => {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  document.body.classList.add('native');
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
