(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const DECKS = window.LPO_DECKS, VERBS = window.LPO_VERBS, GRAMMAR = window.LPO_GRAMMAR, PHRASES = window.LPO_PHRASES;
  const PERSONS = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];

  // ---------- state ----------
  const KEY = 'lpo_v1';
  let S = { stars: 0, boxes: {}, quiz: [], level: 2, station: 'indila', radioOpen: false, days: [] };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = new Date().toISOString().slice(0, 10);
  if (!S.days.includes(today)) { S.days.push(today); S.days = S.days.slice(-400); save(); }

  // ---------- helpers ----------
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = s => String(s).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').replace(/\s*([?!.,;:])\s*$/g, '').replace(/[.!?]+$/, '').trim();
  const headword = fr => fr.replace(/\s*\((m|f|m\/f)\)\s*$/, '').trim();
  const bare = fr => headword(fr).split(',')[0].replace(/^(le |la |les |l'|un |une |des )/i, '').trim();
  const seed = n => { let x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const allItems = () => DECKS.flatMap(d => d.items.map((it, i) => ({ deck: d, i, id: d.id + ':' + i, fr: it[0], en: it[1], exFr: it[2], exEn: it[3], lvl: it[4] })));
  const byLevel = items => { const f = items.filter(it => it.lvl <= S.level); return f.length >= 8 ? f : items; };
  const SPK = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#2a1540"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#2a1540" stroke-width="2.2" stroke-linecap="round"/></svg>';
  const STAR = '<svg viewBox="0 0 100 100"><path d="M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40 Z" fill="#ffd98a" stroke="#2a1540" stroke-width="6" stroke-linejoin="round"/></svg>';
  const ROCKET = '<svg viewBox="0 0 40 40"><path d="M8 32 l6 -6" stroke="#ffb6a8" stroke-width="5" stroke-linecap="round"/><path d="M12 28 C10 18 18 8 32 8 C32 22 22 30 12 28 Z" fill="#fff" stroke="#2a1540" stroke-width="3" stroke-linejoin="round"/><circle cx="23" cy="17" r="4" fill="#7fd3ff" stroke="#2a1540" stroke-width="2.5"/><path d="M14 20 l-6 2 4 4 M20 26 l-2 6 4 -4" fill="#ff7ac6" stroke="#2a1540" stroke-width="2.5" stroke-linejoin="round"/></svg>';

  // ---------- speech ----------
  let voice = null;
  function pickVoice() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
    voice = vs.find(v => /Amélie|Amelie|Thomas|Audrey|Google français/i.test(v.name)) || vs.find(v => /fr-FR/i.test(v.lang)) || vs[0] || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\((m|f|m\/f)\)/g, ''));
    u.lang = 'fr-FR'; u.rate = 0.9; if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  const canSpeak = () => !!window.speechSynthesis;

  // ---------- sky and stars ----------
  const sky = $('#sky');
  function renderSky() {
    const W = window.innerWidth, H = window.innerHeight;
    let out = '';
    for (let i = 0; i < 70; i++) {
      const x = seed(i) * W, y = seed(i + 1000) * H, r = 0.8 + seed(i + 2000) * 1.6;
      out += `<circle class="twinkle" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" style="animation-delay:${(-seed(i + 3000) * 3).toFixed(1)}s"/>`;
    }
    const n = Math.min(S.stars, 300);
    for (let i = 0; i < n; i++) {
      const x = 20 + seed(i + 5000) * (W - 40), y = 20 + seed(i + 6000) * (H - 40), s = 5 + seed(i + 7000) * 7;
      const c = ['#ffd98a', '#ff7ac6', '#fff', '#b48cff'][i % 4];
      out += `<path class="twinkle" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(s / 50).toFixed(3)})" d="M0 -50 L10 -10 L50 0 L10 10 L0 50 L-10 10 L-50 0 L-10 -10 Z" fill="${c}" style="animation-delay:${(-seed(i + 8000) * 3).toFixed(1)}s"/>`;
    }
    sky.innerHTML = out;
    $('#starCount').textContent = S.stars;
  }
  window.addEventListener('resize', renderSky);

  function award(fromEl, n) {
    n = n || 1;
    const badge = $('#starBadge').getBoundingClientRect();
    const from = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    for (let k = 0; k < n; k++) {
      const el = document.createElement('div');
      el.className = 'fly'; el.innerHTML = STAR;
      el.style.left = (from.left + from.width / 2 - 13 + k * 10) + 'px'; el.style.top = (from.top + from.height / 2 - 13) + 'px';
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.left = (badge.left + 12) + 'px'; el.style.top = (badge.top + 6) + 'px'; el.style.transform = 'rotate(360deg) scale(.6)';
      }));
      setTimeout(() => el.remove(), 1000);
    }
    setTimeout(() => { S.stars += n; save(); renderSky(); renderHome(); }, 850);
  }

  // ---------- views ----------
  function show(view) {
    $$('section[id^=view-]').forEach(s => s.hidden = s.id !== 'view-' + view);
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') renderHome();
    if (view === 'cards') renderDecks();
    if (view === 'quiz' && !quiz) quizSetup();
    if (view === 'verbs') verbNew();
    if (view === 'phrases') renderPhrases();
    if (view === 'games' && window.LPO.gamesMenu) window.LPO.gamesMenu();
  }
  $('#tabs').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) show(t.dataset.view); });
  document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) show(g.dataset.go); });

  // ---------- characters ----------
  function talk(id, lines) {
    const b = $(id); const line = rnd(lines);
    b.textContent = line; b.classList.add('show'); speak(line);
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 2600);
  }
  $('#charC').addEventListener('click', () => talk('#bubbleC', window.LPO_COSMO_SAYS));
  $('#charJ').addEventListener('click', () => talk('#bubbleJ', window.LPO_JULIETTE_SAYS));

  // ---------- home ----------
  function renderHome() {
    const h = new Date().getHours();
    $('#greeting').textContent = (h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir') + ', Juliette.';
    const d = new Date();
    let dl = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    dl = dl.charAt(0).toUpperCase() + dl.slice(1);
    $('#dateLine').textContent = "Aujourd'hui, c'est " + dl + '.';
    const s = S.stars;
    $('#starLine').textContent = s === 0 ? "Ton ciel est encore vide. Chaque bonne réponse y ajoute une étoile."
      : `Tu as ${s} étoile${s > 1 ? 's' : ''} dans ton ciel. ${s < 20 ? 'Ça commence à briller.' : s < 100 ? 'Ça ressemble déjà à une constellation.' : 'Hubble serait jaloux.'}`;
    // word of the day
    const items = allItems().filter(it => it.lvl <= S.level);
    const dayN = Math.floor(Date.now() / 86400000);
    const w = items[dayN % items.length];
    $('#wodFr').textContent = w.fr; $('#wodEn').textContent = w.en;
    $('#wodEx').innerHTML = esc(w.exFr) + '<br><span class="en">' + esc(w.exEn) + '</span>';
    $('#wodSpeak').onclick = () => speak(headword(w.fr) + '. ' + w.exFr);
    $$('#levels .btn').forEach(b => b.classList.toggle('on', +b.dataset.lvl === S.level));
    // progress
    const solid = DECKS.map(d => { const n = d.items.filter((_, i) => (S.boxes[d.id + ':' + i] || 0) >= 3).length; return `${d.name} : ${n} sur ${d.items.length}`; });
    const best = S.quiz.length ? Math.max(...S.quiz.map(q => q.score)) : null;
    $('#progressPanel').innerHTML = `<h2>Où tu en es</h2>
      <p>Mots bien ancrés par planète (trois bonnes réponses d'affilée sur une carte) :</p>
      <p>${solid.join('<br>')}</p>
      <p>${S.quiz.length ? `Quiz faits : ${S.quiz.length}. Meilleur score : ${best} sur 10.` : 'Pas encore de quiz. Dix questions, ça prend cinq minutes.'}</p>
      <p class="small muted">Jours passés ici : ${S.days.length}. Pas de pression, les étoiles ne s'éteignent jamais.</p>
      <button class="btn sm plain" id="resetBtn">Tout remettre à zéro</button>`;
    $('#resetBtn').onclick = () => { if (confirm('Tout effacer ? Les étoiles aussi.')) { S = { stars: 0, boxes: {}, quiz: [], level: 2, station: S.station, radioOpen: S.radioOpen, days: [today] }; save(); renderSky(); renderHome(); } };
  }
  $('#levels').addEventListener('click', e => { const b = e.target.closest('[data-lvl]'); if (!b) return; S.level = +b.dataset.lvl; save(); renderHome(); });

  // ---------- planets ----------
  function planetSVG(p, i) {
    return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="${p.ring}" stroke-width="7" transform="rotate(-18 50 52)"/>
      <circle cx="50" cy="50" r="30" fill="${p.body}" stroke="#2a1540" stroke-width="3.5"/>
      <circle cx="${38 + (i % 3) * 6}" cy="42" r="6" fill="${p.spots}"/><circle cx="60" cy="58" r="4" fill="${p.spots}"/><circle cx="44" cy="62" r="2.5" fill="${p.spots}"/>
      <path d="M4 52 a46 12 0 0 0 92 0" fill="none" stroke="${p.ring}" stroke-width="7" transform="rotate(-18 50 52)" stroke-linecap="round"/>
      <path d="M43 52 c3 4 11 4 14 0" fill="none" stroke="#2a1540" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="42" cy="46" r="2" fill="#2a1540"/><circle cx="58" cy="46" r="2" fill="#2a1540"/></svg>`;
  }
  function planetsHTML(sel, withAll) {
    let h = DECKS.map((d, i) => `<button class="planet ${sel === d.id ? 'on' : ''}" data-deck="${d.id}">${planetSVG(d.planet, i)}${esc(d.name)}<span class="sub">${esc(d.en)}</span></button>`).join('');
    if (withAll) h += `<button class="planet ${sel === 'all' ? 'on' : ''}" data-deck="all"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#ffd98a" stroke="#2a1540" stroke-width="3.5"/><path d="M50 14 l5 15 15 5 -15 5 -5 15 -5 -15 -15 -5 15 -5z" fill="#fff" stroke="#2a1540" stroke-width="2.5" transform="translate(0 16)"/></svg>Toutes<span class="sub">everything</span></button>`;
    return h;
  }

  // ---------- flashcards ----------
  let deck = null, queue = [], cur = null, dir = 'fr';
  function renderDecks() { $('#deckPlanets').innerHTML = planetsHTML(deck && deck.id, false); if (!deck) $('#cardArea').innerHTML = ''; }
  $('#deckPlanets').addEventListener('click', e => { const b = e.target.closest('[data-deck]'); if (!b) return; startDeck(DECKS.find(d => d.id === b.dataset.deck)); });
  function startDeck(d) {
    deck = d; renderDecks();
    const items = byLevel(allItems().filter(it => it.deck.id === d.id));
    queue = shuffle(items).sort((a, b) => (S.boxes[a.id] || 0) - (S.boxes[b.id] || 0));
    nextCard();
  }
  function nextCard() {
    if (!queue.length) { $('#cardArea').innerHTML = `<div class="panel"><h2>Planète terminée.</h2><p>Tu as fait le tour de ${esc(deck.name)}. Reviens demain ou choisis une autre planète.</p><button class="btn pink" id="again">Encore un tour</button></div>`; $('#again').onclick = () => startDeck(deck); return; }
    cur = queue.shift();
    const solid = deck.items.filter((_, i) => (S.boxes[deck.id + ':' + i] || 0) >= 3).length;
    const front = dir === 'fr' ? cur.fr : cur.en, back = dir === 'fr' ? cur.en : cur.fr;
    $('#cardArea').innerHTML = `<div class="panel soft">
      <div class="row" style="justify-content:space-between;margin-bottom:12px">
        <span>${esc(deck.blurb)} ${solid} sur ${deck.items.length} bien ancrés.</span>
        <button class="btn sm plain" id="dirBtn">${dir === 'fr' ? 'Montrer l\'anglais d\'abord' : 'Montrer le français d\'abord'}</button>
      </div>
      <div class="scene"><div class="card" id="card">
        <div class="face front"><div class="word">${esc(front)}</div><div class="hint">tap to flip</div></div>
        <div class="face back"><div class="word">${esc(back)}</div><div class="ex">${esc(cur.exFr)}<br><span class="en">${esc(cur.exEn)}</span></div></div>
      </div></div>
      <div class="cardbtns">
        <button class="speak" id="cardSpeak" aria-label="Écouter">${SPK}</button>
        <button class="btn bad" id="notYet">Pas encore</button>
        <button class="btn good" id="knew">Je savais</button>
      </div></div>`;
    $('#card').onclick = () => $('#card').classList.toggle('flip');
    $('#cardSpeak').onclick = e => { e.stopPropagation(); speak(headword(cur.fr) + '. ' + cur.exFr); };
    $('#dirBtn').onclick = () => { dir = dir === 'fr' ? 'en' : 'fr'; queue.unshift(cur); nextCard(); };
    $('#knew').onclick = e => { S.boxes[cur.id] = Math.min(4, (S.boxes[cur.id] || 0) + 1); save(); award(e.target, 1); nextCard(); };
    $('#notYet').onclick = () => { S.boxes[cur.id] = 0; save(); queue.splice(Math.min(3, queue.length), 0, cur); nextCard(); };
  }

  // ---------- quiz ----------
  let quiz = null;
  function quizSetup(sel) {
    quiz = null;
    $('#quizArea').innerHTML = `<div class="panel"><h2>Dix questions, une planète</h2>
      <div class="planets" id="quizPlanets">${planetsHTML(sel || 'all', true)}</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn pink" id="startQuiz">C'est parti</button></div></div>`;
    let chosen = sel || 'all';
    $('#quizPlanets').addEventListener('click', e => { const b = e.target.closest('[data-deck]'); if (!b) return; chosen = b.dataset.deck; $$('#quizPlanets .planet').forEach(p => p.classList.toggle('on', p.dataset.deck === chosen)); });
    $('#startQuiz').onclick = () => startQuiz(chosen);
  }
  function startQuiz(deckId) {
    const pool = byLevel(allItems().filter(it => deckId === 'all' || it.deck.id === it.deck.id && (deckId === 'all' || it.deck.id === deckId)));
    const gram = shuffle(GRAMMAR.filter(g => g.lvl <= S.level));
    let types = ['mcfe', 'mcef', 'type', 'listen', 'gram', 'mcfe', 'type', 'gram', 'mcef', 'gram'];
    if (!canSpeak()) types = types.map(t => t === 'listen' ? 'mcfe' : t);
    const items = shuffle(pool);
    const qs = shuffle(types).map((t, i) => {
      if (t === 'gram') { const g = gram[i % gram.length]; const opts = shuffle(g.o.map((o, k) => ({ o, ok: k === g.a }))); return { t, g, opts }; }
      const it = items[i % items.length];
      const others = shuffle(pool.filter(x => x.id !== it.id)).slice(0, 3);
      const opts = shuffle([it].concat(others).map(x => ({ o: t === 'mcfe' || t === 'listen' ? x.en : x.fr, ok: x.id === it.id })));
      return { t, it, opts };
    });
    quiz = { deckId, qs, i: 0, score: 0, results: [] };
    renderQ();
  }
  function renderQ() {
    const q = quiz.qs[quiz.i];
    const dots = quiz.qs.map((_, k) => `<span class="dot ${quiz.results[k] === true ? 'done' : quiz.results[k] === false ? 'miss' : ''}" style="left:calc(14px + ${k / 9 * 100}% * (100% - 28px) / 100%)"></span>`).join('');
    const pct = quiz.i / 9 * 100;
    let body = '';
    if (q.t === 'gram') body = `<div class="q"><span class="fr">${esc(q.g.s)}</span></div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'mcfe') body = `<div class="q">Que veut dire <span class="fr">${esc(q.it.fr)}</span> ?</div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'mcef') body = `<div class="q">Comment dit-on <span class="fr">${esc(q.it.en)}</span> ?</div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'listen') body = `<div class="q row">Écoute et choisis. <button class="speak" id="qSpeak">${SPK}</button></div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else body = `<div class="q">Écris en français : <span class="fr">${esc(q.it.en)}</span></div>
      <form id="typeForm"><input type="text" id="typeIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="avec l'article, si tu peux"><div class="accents" id="acc"></div>
      <div class="row" style="margin-top:12px"><button class="btn lilac" type="submit">Vérifier</button></div></form>`;
    $('#quizArea').innerHTML = `<div class="panel">
      <div class="orbit"><div class="track"></div>${quiz.qs.map((_, k) => `<span class="dot ${quiz.results[k] === true ? 'done' : quiz.results[k] === false ? 'miss' : ''}" style="left:calc(14px + (100% - 28px) * ${k / 9})"></span>`).join('')}<div class="ship" style="left:calc(14px + (100% - 28px) * ${quiz.i / 9})">${ROCKET}</div></div>
      ${body}<div class="feedback" id="fb"></div><div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn sm plain" id="quitQuiz">Arrêter</button><button class="btn pink" id="nextQ" hidden>Suivant</button></div></div>`;
    $('#quitQuiz').onclick = () => quizSetup(quiz.deckId);
    $('#nextQ').onclick = () => { quiz.i++; quiz.i >= quiz.qs.length ? endQuiz() : renderQ(); };
    if (q.t === 'listen') { $('#qSpeak').onclick = () => speak(headword(q.it.fr)); setTimeout(() => speak(headword(q.it.fr)), 300); }
    $$('.opt').forEach(b => b.onclick = () => {
      const o = q.opts[+b.dataset.k];
      $$('.opt').forEach(x => { x.disabled = true; if (q.opts[+x.dataset.k].ok) x.classList.add('right'); });
      if (!o.ok) b.classList.add('wrong');
      finish(o.ok, b, q.t === 'gram' ? q.g.x : `${esc(q.it.fr)} : ${esc(q.it.en)}. ${esc(q.it.exFr)}`);
      if (q.t !== 'gram') speak(q.t === 'gram' ? '' : headword(q.it.fr));
    });
    if (q.t === 'type') {
      const inp = $('#typeIn'); accentRow($('#acc'), inp); inp.focus();
      $('#typeForm').onsubmit = e => {
        e.preventDefault(); const v = norm(inp.value); if (!v) return;
        const target = norm(headword(q.it.fr)), alts = headword(q.it.fr).split(',').map(x => norm(x));
        const exact = alts.includes(v) || v === target;
        const noAcc = alts.some(x => strip(x) === strip(v)) || strip(v) === strip(target);
        const noArt = alts.some(x => strip(norm(bare(x))) === strip(v)) || strip(v) === strip(norm(bare(q.it.fr)));
        const ok = exact || noAcc || noArt; inp.disabled = true;
        let msg = `${esc(headword(q.it.fr))} : ${esc(q.it.en)}.`;
        if (ok && !exact && noAcc) msg += ' Presque parfait, attention aux accents.';
        else if (ok && !exact && noArt) msg += " Bonne réponse. Pense à l'article la prochaine fois.";
        finish(ok, inp, msg); speak(headword(q.it.fr));
      };
    }
    function finish(ok, el, note) {
      quiz.results[quiz.i] = ok; if (ok) { quiz.score++; award(el, 1); }
      $('#fb').innerHTML = `<span class="cheer">${ok ? rnd(window.LPO_CHEERS) : rnd(window.LPO_SOFT)}</span><div class="note">${note}</div>`;
      $('#nextQ').hidden = false; $('#nextQ').focus();
    }
  }
  function endQuiz() {
    const sc = quiz.score; S.quiz.push({ d: today, score: sc }); S.quiz = S.quiz.slice(-200); save();
    const msg = sc === 10 ? 'Dix sur dix. Cosmo aboie de joie. Cinq étoiles bonus.' : sc >= 8 ? 'Très solide. Encore un et tu les auras toutes.' : sc >= 5 ? 'Bien joué. Les ratés sont les meilleurs profs.' : 'Journée difficile, et alors. Refais les cartes de cette planète et reviens.';
    $('#quizArea').innerHTML = `<div class="panel pink"><h2>${sc} sur 10</h2><p class="big">${msg}</p><div class="row"><button class="btn pink" id="againQ">Encore dix</button><button class="btn plain" data-go="cards">Revoir les cartes</button></div></div>`;
    if (sc === 10) award($('#againQ'), 5);
    $('#againQ').onclick = () => startQuiz(quiz.deckId);
  }

  function accentRow(el, inp) {
    el.innerHTML = 'é è ê à â ç ù û î ô ë ï œ'.split(' ').map(c => `<button type="button">${c}</button>`).join('');
    el.onclick = e => { if (e.target.tagName !== 'BUTTON') return; const p = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, p) + e.target.textContent + inp.value.slice(p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); };
  }

  // ---------- verbs ----------
  const vowel = s => /^[aeiouyhéèêâîôûë]/i.test(s);
  const reflPron = (p, form) => { const r = ['me', 'te', 'se', 'nous', 'vous', 'se'][p]; return (p < 3 || p === 5) && vowel(form) ? r[0] + "'" : r + ' '; };
  const subj = (p, form) => (p === 0 && vowel(form)) ? "j'" : PERSONS[p] + ' ';
  const AGR = [['e', ''], ['', 'e'], ['', 'e'], ['s', 'es'], ['', 'e', 's', 'es'], ['s', 'es']];
  function conj(v, tense, p) {
    const ETRE = VERBS[0].pres, AVOIR = VERBS[1].pres, ALLER = VERBS[2].pres;
    let answers = [], core, note = '';
    if (tense === 'pres' || tense === 'imp') {
      const f = (tense === 'pres' ? v.pres : v.imp)[p];
      core = v.refl ? reflPron(p, f) + f : f; answers = [core];
    } else if (tense === 'pc') {
      if (v.aux === 'avoir') { core = AVOIR[p] + ' ' + v.pp; answers = [core]; }
      else {
        const aux = ETRE[p]; const forms = AGR[p].map(a => v.pp + a);
        answers = forms.map(f => (v.refl ? reflPron(p, aux) : '') + aux + ' ' + f);
        core = answers[0];
        note = 'Verbe avec être : le participe s\'accorde. ' + (p === 0 ? 'Pour toi, c\'est ' + v.pp + 'e.' : 'Formes acceptées : ' + forms.join(', ') + '.');
      }
    } else {
      const inf = v.refl ? v.inf.replace(/^s(e |')/, '') : v.inf;
      core = ALLER[p] + ' ' + (v.refl ? reflPron(p, inf) + inf : inf); answers = [core];
    }
    const full = (v.refl && p === 0 && tense !== 'fp') ? 'je ' + core : (tense === 'fp' || (v.refl && p === 0)) ? subj(p, core) + core : subj(p, core) + core;
    return { answers, display: full.replace(/^j' /, "j'"), note };
  }
  let vq = null;
  function fillVerbSel() { const sel = $('#verbSel'); if (sel.options.length) return; VERBS.forEach((v, i) => { const o = document.createElement('option'); o.value = i; o.textContent = v.inf + ' (' + v.en + ')'; sel.appendChild(o); }); }
  function verbNew() {
    fillVerbSel();
    const v = VERBS[+$('#verbSel').value || 0], tense = $('#tenseSel').value, p = Math.floor(Math.random() * 6);
    vq = { v, tense, p, c: conj(v, tense, p) };
    const tenseName = { pres: 'présent', pc: 'passé composé', imp: 'imparfait', fp: 'futur proche' }[tense];
    $('#verbArea').innerHTML = `<div class="q"><span class="fr">${esc(PERSONS[p])} ___</span> <span class="muted">(${esc(v.inf)}, ${tenseName})</span></div>
      <form id="verbForm"><input type="text" id="verbIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${v.refl ? 'avec me, te, se...' : 'juste le verbe'}"><div class="accents" id="vacc"></div>
      <div class="row" style="margin-top:12px"><button class="btn lilac" type="submit">Vérifier</button><button class="btn sm plain" type="button" id="verbSkip">Je ne sais pas</button></div></form><div class="feedback" id="vfb"></div>`;
    const inp = $('#verbIn'); accentRow($('#vacc'), inp); inp.focus();
    $('#verbForm').onsubmit = e => { e.preventDefault(); const val = norm(inp.value); if (!val) return; const ok = vq.c.answers.some(a => norm(a) === val), near = !ok && vq.c.answers.some(a => strip(norm(a)) === strip(val)); verbDone(ok || near, near, inp); };
    $('#verbSkip').onclick = () => verbDone(false, false, inp);
    renderVerbTable(false);
  }
  function verbDone(ok, near, inp) {
    inp.disabled = true;
    $('#vfb').innerHTML = `<span class="cheer">${ok ? rnd(window.LPO_CHEERS) : rnd(window.LPO_SOFT)}</span><div class="note"><span class="fr big">${esc(vq.c.display)}</span>${near ? '<br>Attention aux accents.' : ''}${vq.c.note ? '<br>' + esc(vq.c.note) : ''}</div><div class="row" style="margin-top:12px"><button class="speak" id="vSpeak">${SPK}</button><button class="btn pink" id="vNext">Suivant</button></div>`;
    $('#vSpeak').onclick = () => speak(vq.c.display); speak(vq.c.display);
    $('#vNext').onclick = verbNew; $('#vNext').focus();
    if (ok) award(inp, near ? 1 : 2);
  }
  let tableOpen = false;
  function renderVerbTable(toggle) {
    if (toggle) tableOpen = !tableOpen;
    $('#verbTable').textContent = tableOpen ? 'Cacher le tableau' : 'Voir le tableau';
    if (!tableOpen || !vq) { $('#verbTableArea').innerHTML = ''; return; }
    const rows = PERSONS.map((_, p) => { const c = conj(vq.v, vq.tense, p); return `<tr><td>${esc(PERSONS[p])}</td><td>${esc(c.display.replace(/^(je |j'|tu |il \/ elle |nous |vous |ils \/ elles )/, ''))}</td></tr>`; }).join('');
    $('#verbTableArea').innerHTML = `<table>${rows}</table>`;
  }
  $('#verbTable').onclick = () => renderVerbTable(true);
  $('#verbSel').onchange = verbNew; $('#tenseSel').onchange = verbNew;

  // ---------- phrases ----------
  let phraseOrder = PHRASES.map((_, i) => i), challenge = false;
  function renderPhrases() {
    const list = $('#phraseList');
    list.innerHTML = phraseOrder.filter(i => PHRASES[i][2] <= S.level || S.level === 3).map(i => { const p = PHRASES[i]; return `<div class="phrase ${challenge ? 'hidden' : ''}" data-i="${i}"><button class="speak" aria-label="Écouter">${SPK}</button><div><div class="fr">${esc(p[0])}</div><div class="en">${esc(p[1])}</div></div></div>`; }).join('');
    list.onclick = e => { const row = e.target.closest('.phrase'); if (!row) return; const p = PHRASES[+row.dataset.i]; if (e.target.closest('.speak')) speak(p[0]); else if (row.classList.contains('hidden')) { row.classList.remove('hidden'); speak(p[0]); } };
  }
  $('#toggleEn').onclick = e => { const list = $('#phraseList'); list.classList.toggle('hide-en'); e.target.textContent = list.classList.contains('hide-en') ? "Montrer l'anglais" : "Cacher l'anglais"; };
  $('#challengeMode').onclick = e => { challenge = !challenge; e.target.textContent = challenge ? 'Mode tranquille' : 'Mode défi'; if (challenge) $('#phraseList').classList.remove('hide-en'); renderPhrases(); };
  $('#shufflePhrases').onclick = () => { phraseOrder = shuffle(phraseOrder); renderPhrases(); };

  // ---------- radio ----------
  const radio = $('#radio'); let yt = null, ytReady = false, pendingPlay = false, custom = null;
  radio.classList.toggle('min', !S.radioOpen); $('#radioToggle').textContent = S.radioOpen ? '–' : '+';
  function renderStations() {
    $('#stations').innerHTML = window.LPO_STATIONS.map(s => `<button class="station ${S.station === s.id ? 'on' : ''}" data-st="${s.id}">${esc(s.name)}<small>${esc(s.note)}</small></button>`).join('');
  }
  renderStations();
  $('#radioToggle').onclick = () => { S.radioOpen = !S.radioOpen; save(); radio.classList.toggle('min', !S.radioOpen); $('#radioToggle').textContent = S.radioOpen ? '–' : '+'; };
  $('#stations').onclick = e => { const b = e.target.closest('[data-st]'); if (!b) return; S.station = b.dataset.st; custom = null; save(); renderStations(); play(); };
  $('#radioPlay').onclick = () => { if (yt && ytReady && radio.classList.contains('playing')) { const st = yt.getPlayerState(); st === 1 ? yt.pauseVideo() : yt.playVideo(); } else play(); };
  $('#customForm').onsubmit = e => {
    e.preventDefault(); const u = $('#customUrl').value.trim(); if (!u) return;
    const list = (u.match(/[?&]list=([\w-]+)/) || [])[1], vid = (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1];
    if (!list && !vid) { $('#nowPlaying').textContent = 'That does not look like a YouTube link.'; return; }
    custom = list ? { list } : { videos: [vid] }; $$('.station').forEach(s => s.classList.remove('on')); play();
  };
  function play() {
    S.radioOpen = true; save(); radio.classList.remove('min'); radio.classList.add('playing'); $('#radioToggle').textContent = '–';
    if (!window.YT || !window.YT.Player) { pendingPlay = true; if (!document.getElementById('ytapi')) { const s = document.createElement('script'); s.id = 'ytapi'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); } $('#nowPlaying').textContent = 'Loading the radio...'; return; }
    const src = custom || window.LPO_STATIONS.find(s => s.id === S.station) || window.LPO_STATIONS[0];
    if (!yt) {
      yt = new YT.Player('ytPlayer', { host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1, playsinline: 1 }, events: {
        onReady: () => { ytReady = true; load(src); },
        onStateChange: ev => { const d = yt.getVideoData && yt.getVideoData(); if (d && d.title) $('#nowPlaying').textContent = d.title; $('#radioPlay').textContent = ev.data === 1 ? 'Pause' : 'Lecture'; },
        onError: () => { $('#nowPlaying').textContent = 'That one will not play here, skipping.'; setTimeout(() => yt.nextVideo(), 800); }
      } });
    } else if (ytReady) load(src);
  }
  function load(src) { if (src.list) yt.loadPlaylist({ list: src.list, listType: 'playlist' }); else yt.loadPlaylist(src.videos); }
  window.onYouTubeIframeAPIReady = () => { if (pendingPlay) { pendingPlay = false; play(); } };


  // ---------- highlight to translate ----------
  const trBtn = document.createElement('button'); trBtn.className = 'tr-btn'; trBtn.textContent = 'Translate'; trBtn.hidden = true; document.body.appendChild(trBtn);
  const trPop = document.createElement('div'); trPop.className = 'tr-pop'; trPop.hidden = true; document.body.appendChild(trPop);
  let selText = '', selRect = null;
  function updateSel() {
    const sel = window.getSelection(); const t = sel && sel.toString().trim();
    if (!t || t.length > 400 || sel.rangeCount === 0 || trPop.contains(sel.anchorNode)) { trBtn.hidden = true; return; }
    const r = sel.getRangeAt(0).getBoundingClientRect(); if (!r.width && !r.height) { trBtn.hidden = true; return; }
    selText = t; selRect = r; trPop.hidden = true;
    trBtn.hidden = false; trBtn.style.left = Math.max(8, Math.min(innerWidth - 110, r.left + r.width / 2 - 50)) + 'px'; trBtn.style.top = Math.max(8, r.top + scrollY - 44) + 'px';
  }
  document.addEventListener('selectionchange', () => { clearTimeout(window._selT); window._selT = setTimeout(updateSel, 250); });
  document.addEventListener('mousedown', e => { if (!trBtn.contains(e.target) && !trPop.contains(e.target)) { trPop.hidden = true; } });
  function localLookup(t) {
    const n = strip(norm(t)); const hits = allItems().filter(it => strip(norm(headword(it.fr))) === n || strip(norm(bare(it.fr))) === n || strip(norm(it.exFr)) === n);
    if (hits.length) return hits[0].exFr && strip(norm(hits[0].exFr)) === n ? hits[0].exEn : hits[0].en;
    const ph = PHRASES.find(p => strip(norm(p[0])) === n); return ph ? ph[1] : null;
  }
  async function translate(t) {
    const local = localLookup(t); if (local) return local;
    try {
      const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); const out = (j[0] || []).map(x => x[0]).join(''); if (out) return out; }
    } catch (e) {}
    try {
      const r = await fetch('https://api.mymemory.translated.net/get?langpair=fr|en&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); if (j.responseData && j.responseData.translatedText) return j.responseData.translatedText; }
    } catch (e) {}
    return null;
  }
  trBtn.addEventListener('mousedown', e => e.preventDefault());
  trBtn.addEventListener('click', async () => {
    trBtn.hidden = true; const t = selText; if (!t) return;
    trPop.hidden = false; trPop.innerHTML = '<div class="tr-fr">' + esc(t) + '</div><div class="tr-en muted">Translating...</div>';
    trPop.style.left = Math.max(8, Math.min(innerWidth - 300, selRect.left)) + 'px'; trPop.style.top = (selRect.bottom + scrollY + 8) + 'px';
    const out = await translate(t);
    trPop.innerHTML = '<div class="tr-fr">' + esc(t) + ' <button class="speak sm" aria-label="Écouter">' + SPK + '</button></div><div class="tr-en">' + (out ? esc(out) : 'No translation came back. Check the connection and try again.') + '</div>';
    trPop.querySelector('.speak').onclick = () => speak(t);
  });

  window.LPO = { $, $$, esc, rnd, shuffle, speak, award, norm, strip, SPK };
  // ---------- boot ----------
  renderSky(); renderHome();
})();
