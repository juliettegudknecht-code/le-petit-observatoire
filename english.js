// Temporary English mode: swaps the site's own words (buttons, instructions, messages) to English.
// The French you are practicing (cards, options, phrases, examples) stays French.
(function () {
  'use strict';
  const MAP = {
    'Accueil': 'Home', 'Cartes': 'Cards', 'Quiz': 'Quiz', 'Verbes': 'Verbs', 'Phrases': 'Phrases', 'Jeux': 'Games',
    'Dix questions': 'Ten questions', 'Les cartes': 'The cards', 'Un verbe': 'One verb',
    'Le mot du jour': 'Word of the day', 'Ton niveau': 'Your level', 'Révision (A1)': 'Review (A1)', 'Juste bien (A2)': 'Just right (A2)', 'Un cran au-dessus (B1)': 'One notch up (B1)',
    'Où tu en es': 'Where you are', "Mots bien ancrés par planète (trois bonnes réponses d'affilée sur une carte) :": 'Words that feel solid, by planet (three right answers in a row on a card):',
    'Pas encore de quiz. Dix questions, ça prend cinq minutes.': 'No quiz yet. Ten questions takes five minutes.', 'Tout remettre à zéro': 'Reset everything',
    "Quelle planète aujourd'hui ?": 'Which planet today?', 'tap to flip': 'tap to flip', "Montrer l'anglais d'abord": 'Show English first', 'Montrer le français d\'abord': 'Show French first',
    'Pas encore': 'Not yet', 'Je savais': 'I knew it', 'Planète terminée.': 'Planet finished.', 'Encore un tour': 'One more lap',
    'Dix questions, une planète': 'Ten questions, one planet', "C'est parti": "Let's go", 'Arrêter': 'Stop', 'Suivant': 'Next', 'Vérifier': 'Check', 'Écoute et choisis.': 'Listen and choose.',
    'Écris en français :': 'Write it in French:', "avec l'article, si tu peux": 'with the article, if you can', 'Encore dix': 'Ten more', 'Revoir les cartes': 'Review the cards',
    'Dix sur dix. Cosmo aboie de joie. Cinq étoiles bonus.': 'Ten out of ten. Cosmo is barking with joy. Five bonus stars.', 'Très solide. Encore un et tu les auras toutes.': 'Very solid. One more and you will have them all.',
    'Bien joué. Les ratés sont les meilleurs profs.': 'Nice work. The misses are the best teachers.', 'Journée difficile, et alors. Refais les cartes de cette planète et reviens.': 'Rough day, so what. Redo the cards for this planet and come back.',
    'Conjugue-moi ça': 'Conjugate this', 'Voir le tableau': 'Show the table', 'Cacher le tableau': 'Hide the table', 'Je ne sais pas': 'I do not know', 'juste le verbe': 'just the verb', 'avec me, te, se...': 'with me, te, se...',
    'Attention aux accents.': 'Watch the accents.', 'présent': 'present', 'passé composé': 'passé composé', 'imparfait': 'imparfait', 'futur proche': 'near future',
    'Des trucs que tu dis vraiment': 'Things you actually say', "Cacher l'anglais": 'Hide English', "Montrer l'anglais": 'Show English', 'Mode défi': 'Challenge mode', 'Mode tranquille': 'Easy mode', 'Mélanger': 'Shuffle',
    'On joue ?': 'Shall we play?', 'Habille Cosmo': 'Dress Cosmo', 'La vitrine': 'The shop window', 'Le défilé': 'The runway', 'Encore': 'Again', 'Autres jeux': 'Other games',
    'Cosmo est prêt pour le défilé !': 'Cosmo is ready for the runway!', "Qu'est-ce qu'elle porte ?": 'What is she wearing?',
    "Pas d'étiquettes, c'est le jeu.": 'No labels, that is the game.', 'Tu peux faire les soldes à Paris sans peur.': 'You can hit the Paris sales without fear.', "Les prix français, c'est presque gagné.": 'French prices, nearly nailed.',
    'Soixante-dix et quatre-vingt-dix sont des pièges. On recommence ?': 'Seventy and ninety are traps. Go again?', 'Accords parfaits. Anna Wintour applaudit.': 'Perfect agreement. Anna Wintour approves.', 'Le podium est à toi, presque.': 'The runway is yours, almost.',
    "Les adjectifs s'accordent avec le nom. Encore un tour ?": 'Adjectives agree with the noun. One more round?',
    'Radio': 'Radio', 'Lecture': 'Play', 'Pause': 'Pause', 'Indila is waiting on station one.': 'Indila is waiting on station one.', 'Go': 'Go',
    'Écouter': 'Listen', 'Translate': 'Translate', 'Translating...': 'Translating...',
    'Génial !': 'Brilliant!', 'Bravo !': 'Bravo!', 'Trop fort !': 'Too good!', 'Nickel !': 'Spot on!', 'Impeccable !': 'Flawless!', 'Parfait !': 'Perfect!', 'Ouais !': 'Yes!', 'Excellent !': 'Excellent!', 'Super !': 'Super!', "C'est ça !": "That's it!", 'Et voilà !': 'And there it is!', 'Très chic !': 'Very chic!',
    'Pas grave.': 'No big deal.', 'Presque !': 'Almost!', 'On réessaie.': 'Try again.', "C'est pas facile, celui-là.": 'That one is not easy.', 'La prochaine fois.': 'Next time.', 'Ça viendra.': 'It will come.',
    'Que veut dire': 'What does', 'Comment dit-on': 'How do you say',
    'Fait avec amour pour Juliette et Cosmo. Progress lives in this browser only.': 'Made with love for Juliette and Cosmo. Progress lives in this browser only.'
  };
  // Dress-up instructions
  [['Mets-lui le béret rouge.', 'Put the red beret on him.'], ['Mets-lui les lunettes de soleil.', 'Put the sunglasses on him.'], ['Mets-lui le foulard en soie.', 'Put the silk scarf on him.'], ['Mets-lui le collier de perles.', 'Put the pearl necklace on him.'], ['Donne-lui le petit sac matelassé.', 'Give him the little quilted bag.'], ['Mets-lui le trench beige.', 'Put the beige trench coat on him.'], ['Mets-lui le nœud rose.', 'Put the pink bow on him.'], ['Mets-lui la petite couronne dorée.', 'Put the little gold crown on him.']].forEach(([f, e]) => MAP[f] = e);
  const RULES = [
    [/^(Bonjour|Bon après-midi|Bonsoir), Juliette\.$/, (m) => ({ Bonjour: 'Good morning', 'Bon après-midi': 'Good afternoon', Bonsoir: 'Good evening' }[m[1]] + ', Juliette.')],
    [/^Aujourd'hui, c'est (.+)\.$/, m => 'Today is ' + m[1] + '.'],
    [/^Ton ciel est encore vide\..*$/, () => 'Your sky is still empty. Every right answer adds a star.'],
    [/^Tu as (\d+) étoiles? dans ton ciel\. (.*)$/, m => `You have ${m[1]} star${m[1] === '1' ? '' : 's'} in your sky. ` + ({ 'Ça commence à briller.': 'It is starting to glow.', 'Ça ressemble déjà à une constellation.': 'It already looks like a constellation.', 'Hubble serait jaloux.': 'Hubble would be jealous.' }[m[2]] || m[2])],
    [/^Quiz faits : (\d+)\. Meilleur score : (\d+) sur 10\.$/, m => `Quizzes done: ${m[1]}. Best score: ${m[2]} out of 10.`],
    [/^Jours passés ici : (\d+)\..*$/, m => `Days spent here: ${m[1]}. No pressure, the stars never go out.`],
    [/^(.+) : (\d+) sur (\d+)$/, m => `${m[1]}: ${m[2]} of ${m[3]}`],
    [/^(\d+) sur (\d+)$/, m => `${m[1]} out of ${m[2]}`],
    [/^(\d+) sur (\d+)\.? Pas d'étiquettes, c'est le jeu\.$/, m => `${m[1]} of ${m[2]}. No labels, that is the game.`],
    [/^(.+?) (\d+) sur (\d+) bien ancrés\.$/, m => `${m[1]} ${m[2]} of ${m[3]} feel solid.`],
    [/^Tu as fait le tour de (.+)\. Reviens demain ou choisis une autre planète\.$/, m => `You went all the way around ${m[1]}. Come back tomorrow or pick another planet.`],
    [/^Combien coûte (.+) \? Écoute et choisis l'objet\.$/, m => `How much is ${m[1]}? Listen and pick the item.`],
    [/^Qu'est-ce qui coûte (.+) euros \?$/, m => `What costs ${m[1]} euros?`],
    [/^Il porte : (.+)\.$/, m => `He is wearing: ${m[1]}.`],
    [/^Tap anything below/, s => s[0]],
    [/^\((.+), (présent|passé composé|imparfait|futur proche)\)$/, m => `(${m[1]}, ${MAP[m[2]]})`]
  ];
  const SKIP = '.tr-pop, #nowPlaying, .station small, .accents, .langbtn';
  const head = fr => fr.replace(/\s*\((m|f|m\/f)\)\s*$/, '').trim();
  const DICT = {};
  (window.LPO_DECKS || []).forEach(d => d.items.forEach(it => { DICT[it[0]] = it[1]; DICT[head(it[0])] = it[1]; DICT[it[2]] = it[3]; head(it[0]).split(',').forEach(x => { DICT[x.trim()] = it[1]; }); }));
  (window.LPO_PHRASES || []).forEach(p => DICT[p[0]] = p[1]);
  (window.LPO_VERBS || []).forEach(v => DICT[v.inf] = v.en);
  (window.LPO_DECKS || []).forEach(d => { DICT[d.name] = d.en.charAt(0).toUpperCase() + d.en.slice(1); });
  let CACHE = {}; try { CACHE = JSON.parse(localStorage.getItem('lpo_tr') || '{}'); } catch (e) {}
  const FRISH = /[àâçéèêëîïôûùüœ]|\b(le|la|les|un|une|des|je|tu|il|elle|on|nous|vous|ils|elles|est|et|ou|de|du|pas|ne|ce|cette|ces|mon|ma|mes|ton|ta|tes|son|sa|ses|que|qui|pour|avec|dans|sur|sous|chez|très|plus|moins|aussi|bien|mal|oui|non|merci|bonjour|bonsoir|allons|allez|vais|vas|va|vont|ai|as|avons|avez|ont|suis|es|sommes|êtes|sont|fait|faire|mets|aboie|porte)\b|'/i;
  async function online(t) {
    if (CACHE[t]) return CACHE[t];
    try {
      const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); const out = (j[0] || []).map(x => x[0]).join(''); if (out) { CACHE[t] = out; try { localStorage.setItem('lpo_tr', JSON.stringify(CACHE)); } catch (e) {} return out; } }
    } catch (e) {}
    return null;
  }
  let on = false;
  function tr(s) {
    const t = s.trim(); if (!t) return null;
    if (MAP[t]) return s.replace(t, MAP[t]);
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) return s.replace(t, fn(m)); }
    const t2 = t.replace(/[.!?]+$/, '');
    if (DICT[t]) return s.replace(t, DICT[t]);
    if (DICT[t2]) return s.replace(t2, DICT[t2]);
    return null;
  }
  function apply(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentElement; if (!p || p.closest(SKIP) || p.closest('script,style')) return;
      if (n.__fr != null) return;
      const out = tr(n.nodeValue);
      if (out != null) { n.__fr = n.nodeValue; n.nodeValue = out; }
      else if (n.nodeValue.trim().length > 1 && /[a-zA-Zàâçéèêëîïôûùüœ]/.test(n.nodeValue) && FRISH.test(n.nodeValue)) {
        const orig = n.nodeValue; n.__fr = orig;
        online(orig.trim()).then(res => { if (on && res && n.__fr === orig) n.nodeValue = orig.replace(orig.trim(), res); });
      }
      else if (n.nodeValue.trim() === '?' && p.closest('.q') && /What does|How do you say/.test(p.closest('.q').textContent)) { n.__fr = n.nodeValue; n.nodeValue = /What does/.test(p.closest('.q').textContent) ? ' mean?' : '?'; }
    });
    root.querySelectorAll && root.querySelectorAll('[placeholder]').forEach(el => { if (el.__fr == null && MAP[el.placeholder]) { el.__fr = el.placeholder; el.placeholder = MAP[el.placeholder]; } });
  }
  function restore(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => { if (n.__fr != null) { n.nodeValue = n.__fr; n.__fr = null; } });
    root.querySelectorAll('[placeholder]').forEach(el => { if (el.__fr != null) { el.placeholder = el.__fr; el.__fr = null; } });
  }
  const obs = new MutationObserver(ms => { if (!on) return; ms.forEach(m => m.addedNodes.forEach(nd => { if (nd.nodeType === 1) apply(nd); else if (nd.nodeType === 3 && nd.parentElement) apply(nd.parentElement); })); });
  const btn = document.createElement('button'); btn.className = 'btn sm plain langbtn'; btn.textContent = 'In English, please';
  document.querySelector('.title').appendChild(btn);
  btn.onclick = () => {
    on = !on; document.body.classList.toggle('en-mode', on);
    if (on) { apply(document.body); obs.observe(document.body, { childList: true, subtree: true }); btn.textContent = 'Back to French'; }
    else { obs.disconnect(); restore(document.body); btn.textContent = 'In English, please'; }
  };
})();
