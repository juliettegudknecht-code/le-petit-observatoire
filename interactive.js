// Extra interaction for Le Petit Observatoire: swipeable flashcards, quiz combos with confetti,
// and two more games (Construis la phrase, Les paires). Loaded after games.js; uses window.LPO.
(function () {
  'use strict';
  const L = window.LPO; if (!L) return;
  const { $, $$, esc, rnd, shuffle, speak, award, norm, SPK } = L;
  const COLORS = ['#ff7ac6', '#ffd98a', '#b48cff', '#7fd3ff', '#ffb6a8', '#4ccf8a'];

  // ---------- confetti ----------
  let canvas, ctx, parts = [], raf = 0;
  function confetti(n, x, y) {
    if (!canvas) { canvas = document.createElement('canvas'); canvas.className = 'confetti'; document.body.appendChild(canvas); ctx = canvas.getContext('2d'); }
    canvas.width = innerWidth; canvas.height = innerHeight;
    const cx = x == null ? innerWidth / 2 : x, cy = y == null ? innerHeight * 0.35 : y;
    for (let i = 0; i < (n || 60); i++) {
      const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
      parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: 4 + Math.random() * 5, c: rnd(COLORS), rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 70 + Math.random() * 40, shape: Math.random() < .25 ? 'star' : Math.random() < .3 ? 'heart' : 'rect' });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter(p => p.life > 0 && p.y < canvas.height + 20);
    for (const p of parts) {
      p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life / 25); ctx.fillStyle = p.c; ctx.strokeStyle = '#2a1540'; ctx.lineWidth = 1.5;
      if (p.shape === 'heart') { const r = p.r; ctx.beginPath(); ctx.moveTo(0, r); ctx.bezierCurveTo(-r * 1.4, -r * .2, -r * .6, -r * 1.2, 0, -r * .4); ctx.bezierCurveTo(r * .6, -r * 1.2, r * 1.4, -r * .2, 0, r); ctx.fill(); ctx.stroke(); }
      else if (p.shape === 'star') { ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? p.r * .45 : p.r; ctx.lineTo(Math.cos(k * Math.PI / 4) * rr, Math.sin(k * Math.PI / 4) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else { ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.strokeRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); }
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  L.confetti = confetti;

  // ---------- quiz combo ----------
  let combo = 0;
  L.onAnswer = (ok, el) => {
    if (!ok) { combo = 0; const b = $('#combo'); if (b) b.remove(); return; }
    combo++;
    if (combo < 2) return;
    let b = $('#combo');
    if (!b) { b = document.createElement('div'); b.id = 'combo'; b.className = 'combo'; ($('#quizArea .panel') || document.body).appendChild(b); }
    b.textContent = 'x' + combo; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    b.style.fontSize = Math.min(44, 22 + combo * 3) + 'px';
    if (combo === 3 || combo === 5 || combo >= 7) {
      const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      confetti(combo >= 7 ? 90 : 50, r ? r.left + r.width / 2 : null, r ? r.top : null);
      const fb = $('#fb .cheer'); if (fb) fb.textContent = (combo >= 7 ? 'Série de ' + combo + ' ! Imparable.' : combo === 5 ? 'Cinq de suite !' : 'Trois de suite !');
    }
  };
  L.onQuizStart = () => { combo = 0; };

  // ---------- swipe the flashcards ----------
  (function () {
    const area = $('#cardArea'); if (!area) return;
    let card = null, x0 = 0, y0 = 0, dx = 0, moved = false, badge = null;
    const hint = () => { const h = $('#card .hint'); if (h) h.textContent = 'tap to flip, swipe right if you knew it, left if not yet'; };
    new MutationObserver(hint).observe(area, { childList: true, subtree: false });
    area.addEventListener('pointerdown', e => {
      card = e.target.closest('#card'); if (!card || e.target.closest('button')) { card = null; return; }
      x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; card.setPointerCapture(e.pointerId); card.classList.add('dragging');
      badge = document.createElement('div'); badge.className = 'swipebadge'; card.parentNode.appendChild(badge);
    });
    area.addEventListener('pointermove', e => {
      if (!card) return; dx = e.clientX - x0; const dy = e.clientY - y0;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) moved = true;
      if (!moved) return;
      const flip = card.classList.contains('flip') ? 180 : 0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg) rotateY(${flip}deg)`;
      const k = Math.min(1, Math.abs(dx) / 110);
      badge.textContent = dx > 0 ? 'Je savais' : 'Pas encore'; badge.className = 'swipebadge ' + (dx > 0 ? 'yes' : 'no'); badge.style.opacity = k;
    });
    const end = e => {
      if (!card) return; const c = card; card = null; c.classList.remove('dragging');
      const b = badge; badge = null;
      if (moved && Math.abs(dx) > 100) {
        c.style.transition = 'transform .35s ease-in, opacity .35s'; c.style.transform = `translateX(${dx > 0 ? 600 : -600}px) rotate(${dx > 0 ? 30 : -30}deg)`; c.style.opacity = '0';
        const btn = $(dx > 0 ? '#knew' : '#notYet');
        setTimeout(() => { if (b) b.remove(); if (btn) btn.click(); }, 280);
      } else { c.style.transform = ''; if (b) b.remove(); }
      if (moved) { const stop = ev => { ev.stopPropagation(); ev.preventDefault(); }; c.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => c.removeEventListener('click', stop, { capture: true }), 50); }
    };
    area.addEventListener('pointerup', end); area.addEventListener('pointercancel', end);
    document.addEventListener('keydown', e => {
      if (!$('#card') || $('#view-cards').hidden || e.target.matches('input,textarea,select')) return;
      if (e.key === 'ArrowRight') { const b = $('#knew'); if (b) b.click(); }
      else if (e.key === 'ArrowLeft') { const b = $('#notYet'); if (b) b.click(); }
      else if (e.key === ' ') { e.preventDefault(); $('#card').classList.toggle('flip'); }
    });
  })();


  // ---------- desktop: sidebar wrapper + keyboard shortcuts ----------
  (function () {
    const top = document.querySelector('header.top'), tabs = document.getElementById('tabs');
    if (top && tabs && top.parentNode === tabs.parentNode) {
      const side = document.createElement('div'); side.className = 'side';
      top.parentNode.insertBefore(side, top); side.appendChild(top); side.appendChild(tabs);
      side.insertAdjacentHTML('beforeend', '<p class="kbd-hint"><kbd>1</kbd> à <kbd>6</kbd> pour les onglets, <kbd>1</kbd> à <kbd>4</kbd> pour répondre, <kbd>Entrée</kbd> pour la suite, <kbd>&larr;</kbd> <kbd>&rarr;</kbd> et <kbd>espace</kbd> sur les cartes.</p>');
    }
    const visible = el => el && !el.hidden && el.offsetParent !== null;
    document.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target && e.target.matches && e.target.matches('input,textarea,select,[contenteditable]')) return;
      const k = e.key;
      if (/^[1-9]$/.test(k)) {
        const opts = $$('.opt:not(:disabled), #chips .chip:not(:disabled), .wearbtn:not(:disabled), .shopitem:not(:disabled)').filter(visible);
        if (opts.length) { const o = opts[+k - 1]; if (o) { e.preventDefault(); o.click(); } return; }
        const tab = $$('.tab')[+k - 1]; if (tab) { e.preventDefault(); tab.click(); }
        return;
      }
      if (k === 'Enter') {
        const next = ['#nextQ', '#bNext', '#bCheck', '#startQuiz', '#again', '#againQ', '#bAgain', '#mAgain', '#verbNext', '#verbGo'].map(s => $(s)).find(visible);
        if (next) { e.preventDefault(); next.click(); }
      }
      if (k === 'Escape') { const q = ['#quitQuiz', '#bQuit', '#mQuit'].map(s => $(s)).find(visible); if (q) q.click(); }
    });
  })();

  // ---------- Construis la phrase ----------
  let build = null;
  function sentencePool() {
    const lvl = L.level();
    const fromItems = L.allItems().filter(it => it.lvl <= lvl).map(it => ({ fr: it.exFr, en: it.exEn }));
    const fromPhrases = window.LPO_PHRASES.filter(p => p[2] <= lvl).map(p => ({ fr: p[0], en: p[1] }));
    return fromItems.concat(fromPhrases).filter(s => { const n = s.fr.split(/\s+/).length; return n >= 4 && n <= 9; });
  }
  function buildStart() { build = { i: 0, n: 6, score: 0, pool: shuffle(sentencePool()) }; buildNext(); }
  function buildNext() {
    const area = $('#gameArea');
    if (build.i >= build.n) {
      area.innerHTML = `<div class="panel pink"><h2>${build.score} phrases sur ${build.n}</h2><p class="big">${build.score === build.n ? 'Toutes dans le bon ordre. Les mots te suivent, maintenant.' : build.score >= 4 ? 'Joli. Le français adore le petit mot au bon endroit.' : 'Pas facile, l\'ordre des mots. Les phrases du jour sont là pour ça.'}</p><div class="row"><button class="btn pink" id="bAgain">Encore six</button><button class="btn plain" id="bMenu">Autre jeu</button></div></div>`;
      if (build.score === build.n) confetti(100);
      $('#bAgain').onclick = buildStart; $('#bMenu').onclick = L.gamesMenu; return;
    }
    const s = build.pool[build.i % build.pool.length];
    const words = s.fr.split(/\s+/);
    let order = shuffle(words.map((w, k) => k)); if (order.every((v, k) => v === k)) order.reverse();
    const chosen = [];
    area.innerHTML = `<div class="panel"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Construis la phrase</h2><span class="small">${build.i + 1} sur ${build.n}</span></div>
      <p class="big" style="margin:8px 0 4px">${esc(s.en)}</p><p class="small muted">Tap the words in order. Tap a word in the sentence to send it back.</p>
      <div class="buildline" id="buildLine"><span class="placeholder">Ta phrase...</span></div>
      <div class="chips" id="chips">${order.map(k => `<button class="chip" data-k="${k}">${esc(words[k])}</button>`).join('')}</div>
      <div class="feedback" id="bfb"></div>
      <div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn sm plain" id="bQuit">Arrêter</button><div class="row"><button class="btn lilac" id="bCheck">Vérifier</button><button class="btn pink" id="bNext" hidden>Suivant</button></div></div></div>`;
    const line = $('#buildLine');
    const draw = () => { line.innerHTML = chosen.length ? chosen.map(k => `<button class="chip in" data-k="${k}">${esc(words[k])}</button>`).join('') : '<span class="placeholder">Ta phrase...</span>'; $$('#chips .chip').forEach(c => c.disabled = chosen.includes(+c.dataset.k)); };
    $('#chips').onclick = e => { const c = e.target.closest('.chip'); if (!c || c.disabled || $('#bNext').hidden === false) return; chosen.push(+c.dataset.k); draw(); };
    line.onclick = e => { const c = e.target.closest('.chip'); if (!c || $('#bNext').hidden === false) return; chosen.splice(chosen.indexOf(+c.dataset.k), 1); draw(); };
    $('#bQuit').onclick = L.gamesMenu;
    $('#bCheck').onclick = () => {
      const got = chosen.map(k => words[k]).join(' ');
      const ok = norm(got) === norm(s.fr);
      $$('#buildLine .chip').forEach(c => c.classList.add(ok ? 'right' : 'wrong'));
      if (ok) { build.score++; award($('#bCheck'), 1); }
      $('#bfb').innerHTML = `<span class="cheer">${ok ? rnd(window.LPO_CHEERS) : rnd(window.LPO_SOFT)}</span><div class="note">${esc(s.fr)} <button class="speak sm" id="bSay" aria-label="Écouter">${SPK}</button></div>`;
      $('#bSay').onclick = () => speak(s.fr); speak(s.fr);
      $('#bCheck').hidden = true; $('#bNext').hidden = false; $('#bNext').focus();
    };
    $('#bNext').onclick = () => { build.i++; buildNext(); };
    draw();
  }

  // ---------- Les paires (memory) ----------
  let mem = null;
  function memStart() {
    const lvl = L.level();
    const decks = window.LPO_DECKS;
    const deck = rnd(decks);
    let items = L.allItems().filter(it => it.deck.id === deck.id && it.lvl <= lvl);
    if (items.length < 6) items = L.allItems().filter(it => it.deck.id === deck.id);
    const pick = shuffle(items).slice(0, 6);
    const cards = shuffle(pick.flatMap(it => [{ id: it.id, side: 'fr', text: L.headword(it.fr) }, { id: it.id, side: 'en', text: it.en }]));
    mem = { deck, cards, open: [], found: 0, moves: 0, lock: false };
    const area = $('#gameArea');
    area.innerHTML = `<div class="panel"><div class="row" style="justify-content:space-between"><h2 style="margin:0">Les paires</h2><span class="small" id="memMoves">0 coups</span></div>
      <p class="small muted" style="margin:6px 0 10px">Planète ${esc(deck.name)}. Find each French word and its English twin.</p>
      <div class="memgrid" id="memGrid">${cards.map((c, k) => `<button class="mem" data-k="${k}" aria-label="carte"><span class="memface memback"></span><span class="memface memfront ${c.side}">${esc(c.text)}</span></button>`).join('')}</div>
      <div class="feedback" id="mfb"></div>
      <div class="row" style="margin-top:14px"><button class="btn sm plain" id="mQuit">Arrêter</button></div></div>`;
    $('#mQuit').onclick = L.gamesMenu;
    $('#memGrid').onclick = e => {
      const b = e.target.closest('.mem'); if (!b || mem.lock || b.classList.contains('up') || b.classList.contains('done')) return;
      b.classList.add('up'); mem.open.push(b);
      if (mem.open.length < 2) return;
      mem.moves++; $('#memMoves').textContent = mem.moves + ' coup' + (mem.moves > 1 ? 's' : '');
      const [a, c] = mem.open; const ca = mem.cards[+a.dataset.k], cc = mem.cards[+c.dataset.k];
      mem.open = [];
      if (ca.id === cc.id && ca.side !== cc.side) {
        a.classList.add('done'); c.classList.add('done'); mem.found++; award(c, 1); speak(ca.side === 'fr' ? ca.text : cc.text);
        if (mem.found === 6) {
          const msg = mem.moves <= 8 ? 'Mémoire d\'éléphant. Ou de pug.' : mem.moves <= 12 ? 'Bien joué, tout est apparié.' : 'Trouvé, et c\'est ce qui compte.';
          $('#mfb').innerHTML = `<span class="cheer">${esc(msg)}</span><div class="row" style="margin-top:10px"><button class="btn pink" id="mAgain">Encore une planète</button><button class="btn plain" id="mMenu">Autre jeu</button></div>`;
          confetti(80); $('#mAgain').onclick = memStart; $('#mMenu').onclick = L.gamesMenu;
        }
      } else {
        mem.lock = true; a.classList.add('nope'); c.classList.add('nope');
        setTimeout(() => { a.classList.remove('up', 'nope'); c.classList.remove('up', 'nope'); mem.lock = false; }, 750);
      }
    };
  }

  // ---------- add to the games menu ----------
  const baseMenu = L.gamesMenu;
  L.gamesMenu = function () {
    baseMenu();
    const list = $('#gameArea .gamelist'); if (!list) return;
    list.insertAdjacentHTML('beforeend', `
      <button class="game" id="gBuild"><div class="gpic"><svg viewBox="0 0 100 100"><rect x="8" y="30" width="36" height="20" rx="6" fill="#ffd98a" stroke="#2a1540" stroke-width="4"/><rect x="50" y="30" width="42" height="20" rx="6" fill="#ff7ac6" stroke="#2a1540" stroke-width="4"/><rect x="20" y="58" width="60" height="20" rx="6" fill="#b48cff" stroke="#2a1540" stroke-width="4"/></svg></div><div><span class="fr big">Construis la phrase</span><br>The words are scrambled. Tap them back into a real French sentence.</div></button>
      <button class="game" id="gMem"><div class="gpic"><svg viewBox="0 0 100 100"><rect x="10" y="14" width="34" height="34" rx="7" fill="#7fd3ff" stroke="#2a1540" stroke-width="4"/><rect x="56" y="14" width="34" height="34" rx="7" fill="#fff" stroke="#2a1540" stroke-width="4"/><rect x="10" y="56" width="34" height="34" rx="7" fill="#fff" stroke="#2a1540" stroke-width="4"/><rect x="56" y="56" width="34" height="34" rx="7" fill="#ffb6a8" stroke="#2a1540" stroke-width="4"/><path d="M50 4 L54 20 L70 24 L54 28 L50 44 L46 28 L30 24 L46 20 Z" fill="#ffd98a" stroke="#2a1540" stroke-width="3" stroke-linejoin="round"/></svg></div><div><span class="fr big">Les paires</span><br>Twelve cards face down, six French words and their English twins. Flip and match.</div></button>`);
    $('#gBuild').onclick = buildStart; $('#gMem').onclick = memStart;
  };
})();
