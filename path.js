// Duolingo-style bits: a lesson path of planets on the home page, a day streak, progress bars.
(function () {
  'use strict';
  const L = window.LPO; if (!L) return;
  const { $, $$, esc } = L;
  const DECKS = window.LPO_DECKS || [];
  const state = () => { try { return JSON.parse(localStorage.getItem('lpo_v1') || '{}'); } catch (e) { return {}; } };
  const solid = (S, d) => d.items.filter((_, i) => (S.boxes && S.boxes[d.id + ':' + i] || 0) >= 3).length;

  // ---- streak: consecutive days ending today ----
  function streak(S) {
    const days = new Set(S.days || []); let n = 0; const t = new Date();
    for (;;) { const k = t.toISOString().slice(0, 10); if (!days.has(k)) break; n++; t.setDate(t.getDate() - 1); }
    return n;
  }
  const HEART = '<svg viewBox="0 0 100 100"><path d="M50 86 C20 64 10 48 16 32 C22 16 44 16 50 32 C56 16 78 16 84 32 C90 48 80 64 50 86Z" fill="#ff7ac6" stroke="#2a1540" stroke-width="6" stroke-linejoin="round"/></svg>';
  const badge = $('#starBadge');
  if (badge) {
    const n = streak(state());
    badge.insertAdjacentHTML('afterend', `<div class="starbadge streak" title="Days in a row">${HEART}<span>${n} jour${n > 1 ? 's' : ''}</span></div>`);
  }

  // ---- lesson path on the home page ----
  const home = $('#view-home'); if (!home) return;
  const first = home.querySelector('.panel');
  const pathPanel = document.createElement('div'); pathPanel.className = 'panel pathpanel';
  first.parentNode.insertBefore(pathPanel, first.nextSibling);
  const offsets = [0, -70, -100, -70, 0, 70, 100, 70];
  function node(d, i, S) {
    const n = solid(S, d), tot = d.items.length, pct = tot ? n / tot : 0, done = n === tot && tot > 0;
    const r = 30, c = 2 * Math.PI * r;
    return `<div class="pnode ${done ? 'done' : ''}" style="translate:${offsets[i % offsets.length]}px 0">
      <button class="pbtn" data-path="${esc(d.id)}" style="--c:${d.planet.body};--r:${d.planet.ring}" aria-label="${esc(d.name)}">
        <svg viewBox="0 0 72 72" class="ring"><circle cx="36" cy="36" r="${r}" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/><circle cx="36" cy="36" r="${r}" fill="none" stroke="${d.planet.ring}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(pct * c).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 36 36)"/></svg>
        <span class="pball"></span>
      </button>
      <span class="plabel"><b>${esc(d.name)}</b><small>${n} sur ${tot}</small></span>
    </div>`;
  }
  function renderPath() {
    const S = state();
    const cur = DECKS.findIndex(d => solid(S, d) < d.items.length);
    pathPanel.innerHTML = `<h2>Ton parcours</h2><p class="small muted">Une planète à la fois. Trois bonnes réponses sur une carte et le mot est ancré.</p>
      <div class="path">${DECKS.map((d, i) => node(d, i, S)).join('')}
      <div class="pnode" style="translate:0 0"><button class="pbtn quiznode" data-go="quiz" aria-label="Quiz"><span class="pball"></span></button><span class="plabel"><b>Dix questions</b><small>toutes les planètes</small></span></div></div>`;
    const nodes = pathPanel.querySelectorAll('.pnode');
    if (cur >= 0 && nodes[cur]) { nodes[cur].classList.add('current'); nodes[cur].insertAdjacentHTML('afterbegin', '<span class="pstart">Commencer</span>'); }
  }
  pathPanel.addEventListener('click', e => {
    const b = e.target.closest('[data-path]'); if (!b) return;
    const go = document.querySelector('.tab[data-view="cards"]'); if (go) go.click();
    setTimeout(() => { const p = document.querySelector('#deckPlanets [data-deck="' + b.dataset.path + '"]'); if (p) p.click(); }, 60);
  });
  renderPath();

  // ---- progress bars in "Où tu en es" ----
  const prog = $('#progressPanel');
  function bars() {
    const S = state(); const p = prog.querySelector('p + p'); if (!p || prog.querySelector('.bars')) return;
    p.outerHTML = '<div class="bars">' + DECKS.map(d => { const n = solid(S, d), t = d.items.length; return `<div class="bar"><span>${esc(d.name)}</span><span class="track"><span class="fill" style="width:${t ? (n / t * 100).toFixed(0) : 0}%;background:${d.planet.ring}"></span></span><small>${n} sur ${t}</small></div>`; }).join('') + '</div>';
    renderPath();
  }
  if (prog) { new MutationObserver(bars).observe(prog, { childList: true }); bars(); }
})();
