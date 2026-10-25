// Paris fashion games for Juliette and Cosmo. Loaded after app.js; uses window.LPO (helpers exposed by app.js).
(function () {
  'use strict';
  const L = window.LPO; if (!L) return;
  const { $, $$, esc, rnd, shuffle, speak, award, norm, strip, SPK } = L;
  const INK = '#2a1540';

  // ---------- Cosmo with outfit layers ----------
  const WEAR = [
    { id: 'beret', fr: 'le béret rouge', en: 'the red beret', ask: 'Mets-lui le béret rouge.' },
    { id: 'lunettes', fr: 'les lunettes de soleil', en: 'the sunglasses', ask: 'Mets-lui les lunettes de soleil.' },
    { id: 'foulard', fr: 'le foulard en soie', en: 'the silk scarf', ask: 'Mets-lui le foulard en soie.' },
    { id: 'perles', fr: 'le collier de perles', en: 'the pearl necklace', ask: 'Mets-lui le collier de perles.' },
    { id: 'sac', fr: 'le petit sac matelassé', en: 'the little quilted bag', ask: 'Donne-lui le petit sac matelassé.' },
    { id: 'trench', fr: 'le trench beige', en: 'the beige trench coat', ask: 'Mets-lui le trench beige.' },
    { id: 'noeud', fr: 'le nœud rose', en: 'the pink bow', ask: 'Mets-lui le nœud rose.' },
    { id: 'couronne', fr: 'la petite couronne dorée', en: 'the little gold crown', ask: 'Mets-lui la petite couronne dorée.' }
  ];
  function icon(id) {
    const s = { beret: `<path d="M10 42 C8 26 30 14 52 16 C74 18 92 28 88 42 C70 36 40 34 10 42Z" fill="#e03a3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M52 16 c2 -6 6 -8 10 -6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      lunettes: `<rect x="6" y="34" width="38" height="26" rx="10" fill="${INK}"/><rect x="56" y="34" width="38" height="26" rx="10" fill="${INK}"/><path d="M44 44 h12" stroke="${INK}" stroke-width="5"/><path d="M14 40 h10 M64 40 h10" stroke="#fff" stroke-width="3" opacity=".7"/>`,
      foulard: `<path d="M20 30 C40 20 60 20 80 30 L74 48 C58 42 42 42 26 48 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M50 46 L36 84 L50 76 L64 84 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="36" cy="34" r="3" fill="#fff"/><circle cx="60" cy="34" r="3" fill="#fff"/><circle cx="48" cy="62" r="3" fill="#fff"/>`,
      perles: `<path d="M14 30 C26 70 74 70 86 30" fill="none" stroke="${INK}" stroke-width="3"/><g fill="#fff8f0" stroke="${INK}" stroke-width="3"><circle cx="18" cy="38" r="7"/><circle cx="30" cy="52" r="7"/><circle cx="50" cy="60" r="7"/><circle cx="70" cy="52" r="7"/><circle cx="82" cy="38" r="7"/></g>`,
      sac: `<path d="M34 34 C30 20 70 20 66 34" fill="none" stroke="#d4af37" stroke-width="4" stroke-dasharray="4 4"/><rect x="18" y="34" width="64" height="46" rx="10" fill="${INK}"/><path d="M20 46 l60 24 M20 68 l60 -24 M36 36 v42 M50 36 v42 M64 36 v42" stroke="#5a3f7a" stroke-width="2"/><path d="M42 57 h16 M50 49 v16" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/>`,
      trench: `<path d="M30 20 L50 30 L70 20 L84 30 L78 86 L22 86 L16 30 Z" fill="#d9c2a3" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M50 30 v56" stroke="${INK}" stroke-width="3"/><path d="M20 56 h60" stroke="${INK}" stroke-width="4"/><circle cx="42" cy="46" r="3" fill="${INK}"/><circle cx="58" cy="46" r="3" fill="${INK}"/><circle cx="42" cy="70" r="3" fill="${INK}"/><circle cx="58" cy="70" r="3" fill="${INK}"/>`,
      noeud: `<path d="M50 50 l-34 -18 v36 z M50 50 l34 -18 v36 z" fill="#ff7ac6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="50" r="9" fill="#d4af37" stroke="${INK}" stroke-width="3"/>`,
      couronne: `<path d="M16 74 L16 36 L34 52 L50 24 L66 52 L84 36 L84 74 Z" fill="#d4af37" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="24" r="5" fill="#ff7ac6" stroke="${INK}" stroke-width="3"/><circle cx="16" cy="36" r="4" fill="#7fd3ff" stroke="${INK}" stroke-width="3"/><circle cx="84" cy="36" r="4" fill="#7fd3ff" stroke="${INK}" stroke-width="3"/>` };
    return `<svg viewBox="0 0 100 100">${s[id]}</svg>`;
  }
  function cosmoSVG(on) {
    const v = id => on.has(id) ? '' : 'display:none';
    return `<svg viewBox="0 0 200 240" class="cosmo-big">
      <path id="w-trench" style="${v('trench')}" d="M54 150 C44 180 50 212 70 220 L130 220 C150 212 156 180 146 150 L124 158 L100 150 L76 158 Z" fill="#d9c2a3" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M58 150 C50 180 56 210 72 216 L128 216 C144 210 150 180 142 150 Z" fill="#e9c79b" stroke="${INK}" stroke-width="4" stroke-linejoin="round" style="${on.has('trench') ? 'display:none' : ''}"/>
      <g style="${v('trench')}"><path d="M100 160 v56" stroke="${INK}" stroke-width="3"/><path d="M62 190 h76" stroke="${INK}" stroke-width="4"/><circle cx="90" cy="178" r="3" fill="${INK}"/><circle cx="110" cy="178" r="3" fill="${INK}"/></g>
      <path d="M142 160 c14 -4 22 6 14 16 c-6 8 -16 4 -12 -4" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="80" cy="216" rx="16" ry="9" fill="#e9c79b" stroke="${INK}" stroke-width="4"/><ellipse cx="120" cy="216" rx="16" ry="9" fill="#e9c79b" stroke="${INK}" stroke-width="4"/>
      <path d="M62 150 C80 160 120 160 138 150" fill="none" stroke="#8f63e6" stroke-width="9" stroke-linecap="round"/>
      <g style="${v('perles')}"><path d="M64 152 C80 170 120 170 136 152" fill="none" stroke="${INK}" stroke-width="1.5"/><g fill="#fff8f0" stroke="${INK}" stroke-width="1.5"><circle cx="68" cy="156" r="3.5"/><circle cx="78" cy="162" r="3.5"/><circle cx="89" cy="166" r="3.5"/><circle cx="100" cy="167" r="3.5"/><circle cx="111" cy="166" r="3.5"/><circle cx="122" cy="162" r="3.5"/><circle cx="132" cy="156" r="3.5"/></g></g>
      <g style="${v('foulard')}"><path d="M60 146 C80 158 120 158 140 146 L136 160 C118 168 82 168 64 160 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M128 158 L140 190 L128 184 L120 194 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="80" cy="155" r="2" fill="#fff"/><circle cx="104" cy="158" r="2" fill="#fff"/><circle cx="130" cy="178" r="2" fill="#fff"/></g>
      <g style="${v('noeud')}"><path d="M100 160 l-14 -8 v16 z M100 160 l14 -8 v16 z" fill="#ff7ac6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="160" r="4.5" fill="#d4af37" stroke="${INK}" stroke-width="2.5"/></g>
      <g style="${v('sac')}"><path d="M44 170 C40 160 60 158 58 170" fill="none" stroke="#d4af37" stroke-width="3" stroke-dasharray="3 3"/><rect x="32" y="170" width="34" height="26" rx="6" fill="${INK}"/><path d="M34 177 l30 12 M34 189 l30 -12 M43 171 v24 M55 171 v24" stroke="#5a3f7a" stroke-width="1.4"/><path d="M44 183 h10 M49 178 v10" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"/></g>
      <circle cx="100" cy="96" r="48" fill="#e9c79b" stroke="${INK}" stroke-width="4"/>
      <path d="M58 76 C48 90 52 108 62 116 C70 104 72 90 72 78 Z" fill="#3a2a24" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M142 76 C152 90 148 108 138 116 C130 104 128 90 128 78 Z" fill="#3a2a24" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M82 66 C92 60 108 60 118 66 M86 58 C94 54 106 54 114 58" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      <ellipse cx="100" cy="116" rx="30" ry="22" fill="#3a2a24"/>
      <circle cx="78" cy="96" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="122" cy="96" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="80" cy="98" r="8.5" fill="${INK}"/><circle cx="120" cy="98" r="8.5" fill="${INK}"/><circle cx="83" cy="94" r="3" fill="#fff"/><circle cx="123" cy="94" r="3" fill="#fff"/>
      <g style="${v('lunettes')}"><rect x="60" y="84" width="34" height="24" rx="9" fill="${INK}"/><rect x="106" y="84" width="34" height="24" rx="9" fill="${INK}"/><path d="M94 94 h12" stroke="${INK}" stroke-width="4"/><path d="M66 90 h10 M112 90 h10" stroke="#fff" stroke-width="2.5" opacity=".7"/></g>
      <ellipse cx="100" cy="110" rx="9" ry="6" fill="#120a0a" stroke="${INK}" stroke-width="2"/>
      <path d="M100 116 v8 M88 126 C94 132 106 132 112 126" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M94 128 c2 8 10 8 12 0 z" fill="#ff8fb4" stroke="${INK}" stroke-width="2"/>
      <g style="${v('beret')}"><path d="M54 66 C50 44 74 28 104 30 C134 32 154 46 148 66 C134 56 116 52 100 54 C84 56 66 60 54 66 Z" fill="#e03a3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M104 30 c2 -6 6 -8 10 -6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>
      <g style="${v('couronne')}"><path d="M74 58 L72 30 L86 44 L100 20 L114 44 L128 30 L126 58 Z" fill="#d4af37" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="100" cy="20" r="4" fill="#ff7ac6" stroke="${INK}" stroke-width="2.5"/></g>
    </svg>`;
  }

  // ---------- game 1: Habille Cosmo ----------
  let outfit = new Set(), dressQueue = [], dressCur = null;
  function dressStart() {
    outfit = new Set(); dressQueue = shuffle(WEAR).slice(0, 6); dressNext();
  }
  function dressNext() {
    const area = $('#gameArea');
    if (!dressQueue.length) {
      area.innerHTML = `<div class="panel pink"><h2>Cosmo est prêt pour le défilé !</h2><div class="dress"><div class="cosmo-stage">${cosmoSVG(outfit)}</div><div><p class="big">Il porte : ${Array.from(outfit).map(id => esc(WEAR.find(w => w.id === id).fr)).join(', ')}.</p><p>Tap anything below to change his look, or start again.</p><div class="wear" id="freeWear">${WEAR.map(w => `<button class="wearbtn ${outfit.has(w.id) ? 'on' : ''}" data-w="${w.id}" title="${esc(w.fr)}">${icon(w.id)}<span>${esc(w.fr)}</span></button>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn pink" id="dressAgain">Encore</button><button class="btn plain" id="backGames">Autres jeux</button></div></div></div></div>`;
      $('#freeWear').onclick = e => { const b = e.target.closest('[data-w]'); if (!b) return; outfit.has(b.dataset.w) ? outfit.delete(b.dataset.w) : outfit.add(b.dataset.w); b.classList.toggle('on'); $('.cosmo-stage').innerHTML = cosmoSVG(outfit); speak(WEAR.find(w => w.id === b.dataset.w).fr); };
      $('#dressAgain').onclick = dressStart; $('#backGames').onclick = gamesMenu;
      award(area, 2); return;
    }
    dressCur = dressQueue.shift();
    const choices = shuffle(WEAR.filter(w => !outfit.has(w.id)));
    area.innerHTML = `<div class="panel"><div class="dress"><div class="cosmo-stage">${cosmoSVG(outfit)}</div><div>
      <div class="q row"><span class="fr">${esc(dressCur.ask)}</span><button class="speak" id="dressSpeak">${SPK}</button></div>
      <div class="wear" id="wearPick">${choices.map(w => `<button class="wearbtn" data-w="${w.id}" aria-label="${esc(w.en)}">${icon(w.id)}</button>`).join('')}</div>
      <div class="feedback" id="dressFb"></div><p class="small muted">${6 - dressQueue.length} sur 6. Pas d'étiquettes, c'est le jeu.</p></div></div></div>`;
    $('#dressSpeak').onclick = () => speak(dressCur.ask); speak(dressCur.ask);
    $('#wearPick').onclick = e => {
      const b = e.target.closest('[data-w]'); if (!b) return;
      if (b.dataset.w === dressCur.id) { outfit.add(dressCur.id); $('.cosmo-stage').innerHTML = cosmoSVG(outfit); $('#dressFb').innerHTML = `<span class="cheer">${rnd(window.LPO_CHEERS)}</span> ${esc(dressCur.fr)} : ${esc(dressCur.en)}.`; award(b, 1); $$('#wearPick button').forEach(x => x.disabled = true); setTimeout(dressNext, 1300); }
      else { b.classList.add('shake'); const w = WEAR.find(x => x.id === b.dataset.w); $('#dressFb').innerHTML = `<span class="cheer">${rnd(window.LPO_SOFT)}</span> Ça, c'est ${esc(w.fr)} (${esc(w.en)}).`; setTimeout(() => b.classList.remove('shake'), 500); }
    };
  }

  // ---------- game 2: La vitrine (prices) ----------
  const SHOP = [
    { fr: 'le sac', en: 'bag', draw: `<rect x="22" y="38" width="56" height="42" rx="8" fill="${INK}"/><path d="M36 38 C32 22 68 22 64 38" fill="none" stroke="#d4af37" stroke-width="4"/><path d="M44 60 h12 M50 54 v12" stroke="#d4af37" stroke-width="3"/>` },
    { fr: 'le parfum', en: 'perfume', draw: `<rect x="34" y="34" width="32" height="46" rx="6" fill="#ffc2e2" stroke="${INK}" stroke-width="3"/><rect x="42" y="20" width="16" height="14" rx="3" fill="#d4af37" stroke="${INK}" stroke-width="3"/><text x="50" y="62" text-anchor="middle" font-size="14" font-family="Fredoka" fill="${INK}">N°5</text>` },
    { fr: 'les talons', en: 'heels', draw: `<path d="M20 70 L40 40 L62 36 L80 60 L80 70 Z" fill="#e03a3a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M30 70 v-14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` },
    { fr: 'le foulard', en: 'scarf', draw: `<path d="M20 30 C40 20 60 20 80 30 L74 48 C58 42 42 42 26 48 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="3"/><path d="M50 46 L36 84 L50 76 L64 84 Z" fill="#ff7ac6" stroke="${INK}" stroke-width="3"/>` },
    { fr: 'le béret', en: 'beret', draw: `<path d="M10 56 C8 40 30 28 52 30 C74 32 92 42 88 56 C70 50 40 48 10 56Z" fill="#e03a3a" stroke="${INK}" stroke-width="3"/>` },
    { fr: 'les lunettes', en: 'sunglasses', draw: `<rect x="6" y="40" width="38" height="26" rx="10" fill="${INK}"/><rect x="56" y="40" width="38" height="26" rx="10" fill="${INK}"/><path d="M44 50 h12" stroke="${INK}" stroke-width="5"/>` },
    { fr: 'la robe', en: 'dress', draw: `<path d="M38 18 L62 18 L58 36 L80 84 L20 84 L42 36 Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M30 60 h40" stroke="#5a3f7a" stroke-width="2"/>` },
    { fr: 'le trench', en: 'trench coat', draw: `<path d="M30 20 L50 30 L70 20 L84 30 L78 86 L22 86 L16 30 Z" fill="#d9c2a3" stroke="${INK}" stroke-width="3"/><path d="M50 30 v56 M20 56 h60" stroke="${INK}" stroke-width="3"/>` },
    { fr: 'les perles', en: 'pearls', draw: `<g fill="#fff8f0" stroke="${INK}" stroke-width="3"><circle cx="20" cy="40" r="7"/><circle cx="32" cy="54" r="7"/><circle cx="50" cy="60" r="7"/><circle cx="68" cy="54" r="7"/><circle cx="80" cy="40" r="7"/></g>` },
    { fr: 'le rouge à lèvres', en: 'lipstick', draw: `<rect x="40" y="46" width="20" height="36" rx="4" fill="${INK}"/><path d="M42 46 V30 L58 24 V46 Z" fill="#e03a3a" stroke="${INK}" stroke-width="3"/>` }
  ];
  const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  function numFr(n) {
    if (n < 20) return UNITS[n];
    if (n < 100) {
      const t = Math.floor(n / 10), u = n % 10;
      if (t === 7 || t === 9) { const rest = n - (t === 7 ? 60 : 80); return TENS[t] + (t === 7 && rest === 11 ? ' et ' : '-') + UNITS[rest]; }
      if (u === 0) return TENS[t] + (t === 8 ? 's' : '');
      return TENS[t] + (u === 1 ? ' et ' : '-') + UNITS[u];
    }
    if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? 'cent' : UNITS[h] + ' cent' + (r === 0 ? 's' : '')) + (r ? ' ' + numFr(r) : ''); }
    const k = Math.floor(n / 1000), r = n % 1000; return (k === 1 ? 'mille' : numFr(k) + ' mille') + (r ? ' ' + numFr(r) : '');
  }
  const PRICES = [12, 15, 19, 25, 35, 45, 60, 71, 75, 80, 81, 90, 95, 99, 120, 150, 199, 250, 300, 450, 500, 750, 999, 1200, 1500, 2000, 3500, 4800];
  let shop = null;
  function shopStart() { shop = { i: 0, n: 8, score: 0 }; shopNext(); }
  function shopNext() {
    const area = $('#gameArea');
    if (shop.i >= shop.n) { area.innerHTML = `<div class="panel pink"><h2>${shop.score} sur ${shop.n}</h2><p class="big">${shop.score === shop.n ? 'Tu peux faire les soldes à Paris sans peur.' : shop.score >= 5 ? 'Les prix français, c\'est presque gagné.' : 'Soixante-dix et quatre-vingt-dix sont des pièges. On recommence ?'}</p><div class="row"><button class="btn pink" id="shopAgain">Encore</button><button class="btn plain" id="backGames">Autres jeux</button></div></div>`; $('#shopAgain').onclick = shopStart; $('#backGames').onclick = gamesMenu; if (shop.score === shop.n) award(area, 3); return; }
    const items = shuffle(SHOP).slice(0, 4).map(it => ({ ...it, price: 0 }));
    const prices = shuffle(PRICES).slice(0, 4); items.forEach((it, k) => it.price = prices[k]);
    const target = rnd(items); const mode = Math.random() < 0.5 ? 'hear' : 'read';
    const question = mode === 'hear' ? `Combien coûte ${target.fr} ? Écoute et choisis l'objet.` : `Qu'est-ce qui coûte ${numFr(target.price)} euros ?`;
    const say = mode === 'hear' ? `${target.fr.charAt(0).toUpperCase() + target.fr.slice(1)} coûte ${numFr(target.price)} euros.` : question;
    area.innerHTML = `<div class="panel"><div class="q row"><span class="fr">${esc(question)}</span><button class="speak" id="shopSpeak">${SPK}</button></div>
      <div class="shelf" id="shelf">${items.map((it, k) => `<button class="shopitem" data-k="${k}"><svg viewBox="0 0 100 100">${it.draw}</svg><span class="tag">${it.price} €</span><span class="small">${esc(it.fr)}</span></button>`).join('')}</div>
      <div class="feedback" id="shopFb"></div><p class="small muted">${shop.i + 1} sur ${shop.n}</p></div>`;
    $('#shopSpeak').onclick = () => speak(say); speak(say);
    $('#shelf').onclick = e => {
      const b = e.target.closest('[data-k]'); if (!b) return; const it = items[+b.dataset.k]; $$('.shopitem').forEach(x => x.disabled = true);
      const ok = it === target; if (ok) { shop.score++; award(b, 1); b.classList.add('right'); } else { b.classList.add('wrong'); $$('.shopitem')[items.indexOf(target)].classList.add('right'); }
      $('#shopFb').innerHTML = `<span class="cheer">${ok ? rnd(window.LPO_CHEERS) : rnd(window.LPO_SOFT)}</span> ${esc(target.fr)} coûte ${target.price} € : ${esc(numFr(target.price))} euros.`;
      shop.i++; setTimeout(shopNext, ok ? 1500 : 2600);
    };
  }

  // ---------- game 3: Le défilé (agreement) ----------
  const NOUNS = [
    { fr: 'robe', g: 'f', n: 1, en: 'dress', shape: 'M38 18 L62 18 L58 36 L80 84 L20 84 L42 36 Z' },
    { fr: 'sac', g: 'm', n: 1, en: 'bag', shape: 'M22 38 h56 v42 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 Z M36 38 C32 22 68 22 64 38' },
    { fr: 'foulard', g: 'm', n: 1, en: 'scarf', shape: 'M20 30 C40 20 60 20 80 30 L74 48 L50 46 L36 84 L50 76 L64 84 L50 46 L26 48 Z' },
    { fr: 'béret', g: 'm', n: 1, en: 'beret', shape: 'M10 56 C8 40 30 28 52 30 C74 32 92 42 88 56 C70 50 40 48 10 56Z' },
    { fr: 'talons', g: 'm', n: 2, en: 'heels', shape: 'M20 70 L40 40 L62 36 L80 60 L80 70 Z' },
    { fr: 'lunettes', g: 'f', n: 2, en: 'glasses', shape: 'M6 40 h38 v26 h-38 Z M56 40 h38 v26 h-38 Z' },
    { fr: 'ceinture', g: 'f', n: 1, en: 'belt', shape: 'M10 42 h80 v16 h-80 Z M42 38 h16 v24 h-16 Z' },
    { fr: 'chaussures', g: 'f', n: 2, en: 'shoes', shape: 'M14 66 C24 54 44 56 56 46 L70 56 C80 60 86 64 86 70 L14 70 Z' },
    { fr: 'trench', g: 'm', n: 1, en: 'trench coat', shape: 'M30 20 L50 30 L70 20 L84 30 L78 86 L22 86 L16 30 Z' },
    { fr: 'gants', g: 'm', n: 2, en: 'gloves', shape: 'M34 86 V46 L28 30 L36 28 L42 44 L42 22 L50 22 L50 42 L58 20 L66 22 L62 46 L66 86 Z' }
  ];
  const COLORS = [
    { f: ['noir', 'noire', 'noirs', 'noires'], hex: '#2a1540', en: 'black' },
    { f: ['blanc', 'blanche', 'blancs', 'blanches'], hex: '#fff8f0', en: 'white' },
    { f: ['rouge', 'rouge', 'rouges', 'rouges'], hex: '#e03a3a', en: 'red' },
    { f: ['rose', 'rose', 'roses', 'roses'], hex: '#ff7ac6', en: 'pink' },
    { f: ['violet', 'violette', 'violets', 'violettes'], hex: '#8f63e6', en: 'purple' },
    { f: ['doré', 'dorée', 'dorés', 'dorées'], hex: '#d4af37', en: 'gold' },
    { f: ['bleu', 'bleue', 'bleus', 'bleues'], hex: '#4fb0e8', en: 'blue' },
    { f: ['vert', 'verte', 'verts', 'vertes'], hex: '#4ccf8a', en: 'green' },
    { f: ['gris', 'grise', 'gris', 'grises'], hex: '#9a9aa8', en: 'grey' },
    { f: ['beige', 'beige', 'beiges', 'beiges'], hex: '#d9c2a3', en: 'beige' }
  ];
  const ART = { m1: 'un', f1: 'une', m2: 'des', f2: 'des' };
  const idx = (g, n) => (n === 2 ? 2 : 0) + (g === 'f' ? 1 : 0);
  function phrase(noun, color, g, n) { return `${ART[g + n]} ${noun.fr} ${color.f[idx(g, n)]}`; }
  let runway = null;
  function runwayStart() { runway = { i: 0, n: 10, score: 0 }; runwayNext(); }
  function runwayNext() {
    const area = $('#gameArea');
    if (runway.i >= runway.n) { area.innerHTML = `<div class="panel pink"><h2>${runway.score} sur ${runway.n}</h2><p class="big">${runway.score === runway.n ? 'Accords parfaits. Anna Wintour applaudit.' : runway.score >= 7 ? 'Le podium est à toi, presque.' : 'Les adjectifs s\'accordent avec le nom. Encore un tour ?'}</p><div class="row"><button class="btn pink" id="rwAgain">Encore</button><button class="btn plain" id="backGames">Autres jeux</button></div></div>`; $('#rwAgain').onclick = runwayStart; $('#backGames').onclick = gamesMenu; if (runway.score === runway.n) award(area, 3); return; }
    const noun = rnd(NOUNS), color = rnd(COLORS), right = phrase(noun, color, noun.g, noun.n);
    const wrongs = new Set();
    const otherG = noun.g === 'm' ? 'f' : 'm';
    wrongs.add(`${ART[noun.g + noun.n]} ${noun.fr} ${color.f[idx(otherG, noun.n)]}`);
    wrongs.add(`${ART[otherG + noun.n]} ${noun.fr} ${color.f[idx(otherG, noun.n)]}`);
    wrongs.add(`${ART[noun.g + noun.n]} ${noun.fr} ${color.f[idx(noun.g, noun.n === 1 ? 2 : 1)]}`);
    let other; do { other = rnd(COLORS); } while (other === color); wrongs.add(phrase(noun, other, noun.g, noun.n));
    const opts = shuffle([right].concat(shuffle(Array.from(wrongs).filter(w => w !== right)).slice(0, 3)));
    area.innerHTML = `<div class="panel"><div class="dress"><div class="runway-stage"><svg viewBox="0 0 100 100"><path d="${noun.shape}" fill="${color.hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" fill-rule="evenodd"/></svg><div class="small muted">${noun.n === 2 ? 'plural' : 'singular'} ${esc(noun.en)}, ${color.en}</div></div><div>
      <div class="q"><span class="fr">Qu'est-ce qu'elle porte ?</span></div>
      <div class="opts" id="rwOpts">${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" id="rwFb"></div><p class="small muted">${runway.i + 1} sur ${runway.n}</p></div></div></div>`;
    $('#rwOpts').onclick = e => {
      const b = e.target.closest('[data-k]'); if (!b) return; $$('#rwOpts .opt').forEach(x => { x.disabled = true; if (opts[+x.dataset.k] === right) x.classList.add('right'); });
      const ok = opts[+b.dataset.k] === right; if (!ok) b.classList.add('wrong'); else { runway.score++; award(b, 1); }
      const why = noun.n === 2 ? `${noun.fr} is plural, so des and the adjective takes an s` : noun.g === 'f' ? `${noun.fr} is feminine, so une and the feminine adjective` : `${noun.fr} is masculine, so un and the plain adjective`;
      $('#rwFb').innerHTML = `<span class="cheer">${ok ? rnd(window.LPO_CHEERS) : rnd(window.LPO_SOFT)}</span> ${esc(right)}. ${esc(why)}.`; speak(right);
      runway.i++; setTimeout(runwayNext, ok ? 1500 : 2800);
    };
  }

  // ---------- menu ----------
  function gamesMenu() {
    $('#gameArea').innerHTML = `<div class="panel"><h2>On joue ?</h2>
      <div class="gamelist">
        <button class="game" id="gDress"><div class="gpic">${cosmoSVG(new Set(['beret', 'lunettes']))}</div><div><span class="fr big">Habille Cosmo</span><br>Listen to the French instruction and pick the right accessory. No labels, just your ears.</div></button>
        <button class="game" id="gShop"><div class="gpic"><svg viewBox="0 0 100 100">${SHOP[0].draw}</svg></div><div><span class="fr big">La vitrine</span><br>French prices in words and out loud. Soixante-dix and quatre-vingt-dix included, sorry.</div></button>
        <button class="game" id="gRunway"><div class="gpic"><svg viewBox="0 0 100 100"><path d="${NOUNS[0].shape}" fill="#ff7ac6" stroke="${INK}" stroke-width="4"/></svg></div><div><span class="fr big">Le défilé</span><br>Say what she is wearing with the right un, une, des and adjective ending.</div></button>
      </div></div>`;
    $('#gDress').onclick = dressStart; $('#gShop').onclick = shopStart; $('#gRunway').onclick = runwayStart;
  }
  L.gamesMenu = gamesMenu;
})();
