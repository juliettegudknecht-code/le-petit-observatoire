// Little Paris fashion cartoon touches: stickers on the panels, things drifting in the sky,
// a beret on the title, extra lines for Cosmo and Juliette. Pure decoration, loaded last.
(function () {
  'use strict';
  const INK = '#2a1540';
  const I = {
    beret: `<path d="M14 58 C10 36 36 22 54 24 C76 26 92 38 86 58 C70 50 36 50 14 58Z" fill="#e03a3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M16 58 C40 66 70 66 86 58" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M54 24 c2 -7 7 -9 12 -7" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    macaron: `<path d="M18 44 C18 28 82 28 82 44 C82 52 18 52 18 44Z" fill="#ff7ac6" stroke="${INK}" stroke-width="4"/><path d="M20 50 h60 v8 h-60z" fill="#fff6fb" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M18 60 C18 76 82 76 82 60 C82 54 18 54 18 60Z" fill="#ff7ac6" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="38" r="3" fill="#fff" opacity=".8"/>`,
    perfume: `<rect x="40" y="10" width="20" height="14" rx="3" fill="#ffd98a" stroke="${INK}" stroke-width="4"/><rect x="24" y="24" width="52" height="64" rx="8" fill="#fff6fb" stroke="${INK}" stroke-width="4"/><rect x="34" y="42" width="32" height="26" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="50" y="60" text-anchor="middle" font-family="Fredoka,Nunito,sans-serif" font-size="13" font-weight="700" fill="${INK}">No 5</text><path d="M30 30 v50" stroke="#fff" stroke-width="4" opacity=".8" stroke-linecap="round"/>`,
    bag: `<path d="M34 36 C30 18 70 18 66 36" fill="none" stroke="#d4af37" stroke-width="4" stroke-dasharray="4 4" stroke-linecap="round"/><rect x="16" y="36" width="68" height="48" rx="10" fill="${INK}"/><path d="M18 48 l64 26 M18 72 l64 -26 M34 38 v44 M50 38 v44 M66 38 v44" stroke="#6b4d8f" stroke-width="2"/><path d="M42 60 h16 M50 52 v16" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/>`,
    lipstick: `<rect x="36" y="50" width="28" height="40" rx="5" fill="${INK}"/><rect x="40" y="38" width="20" height="14" fill="#ffd98a" stroke="${INK}" stroke-width="3"/><path d="M42 40 V22 C42 14 58 10 58 20 V40Z" fill="#ff4f8b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`,
    croissant: `<path d="M18 62 C14 42 30 28 50 28 C70 28 86 42 82 62 C76 54 66 50 50 50 C34 50 24 54 18 62Z" fill="#f0b25a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M34 32 C30 40 30 48 34 54 M66 32 C70 40 70 48 66 54 M50 29 v22" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
    eiffel: `<path d="M50 6 L58 46 C60 58 66 70 80 92 L62 92 C58 82 54 78 50 78 C46 78 42 82 38 92 L20 92 C34 70 40 58 42 46 Z" fill="#b48cff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M40 52 h20 M34 70 h32" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    heart: `<path d="M50 86 C20 64 10 48 16 32 C22 16 44 16 50 32 C56 16 78 16 84 32 C90 48 80 64 50 86Z" fill="#ff7ac6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="34" cy="34" r="4" fill="#fff" opacity=".8"/>`,
    heel: `<path d="M14 70 C30 60 50 56 70 36 L86 40 C80 54 66 64 48 70 L48 86 L38 86 L36 72 C28 74 22 76 14 78Z" fill="#ff4f8b" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M70 36 c6 -8 12 -8 16 4" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    glasses: `<rect x="6" y="36" width="38" height="26" rx="12" fill="${INK}"/><rect x="56" y="36" width="38" height="26" rx="12" fill="${INK}"/><path d="M44 46 h12" stroke="${INK}" stroke-width="5"/><path d="M14 42 h10 M64 42 h10" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>`
  };
  const svg = (id, cls) => `<svg viewBox="0 0 100 100" class="${cls || ''}" aria-hidden="true">${I[id]}</svg>`;
  const seed = n => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };


  // puffy cartoon clouds and a Paris rooftop skyline for the pastel sky
  function clouds() {
    const cloud = '<svg viewBox="0 0 180 110"><path d="M34 92 C14 92 8 72 20 62 C8 44 30 30 46 40 C52 16 90 12 102 36 C122 26 146 40 140 60 C166 58 172 92 148 92 Z" fill="#fff" stroke="#2a1540" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="58" r="6" fill="#ffd4ea"/><circle cx="110" cy="52" r="5" fill="#ead6ff"/></svg>';
    return [0, 1, 2].map(k => `<span class="cloud" style="top:${(4 + seed(k + 41) * 40).toFixed(1)}%;animation-duration:${(70 + seed(k + 43) * 60).toFixed(0)}s;animation-delay:${(-seed(k + 47) * 120).toFixed(0)}s;scale:${(.6 + seed(k + 53) * .7).toFixed(2)}">${cloud}</span>`).join('');
  }
  function skyline() {
    const INK = '#2a1540', fills = ['#cdb6ff', '#ffc2e2', '#fff1d6', '#e6d9ff', '#ffd9c7'];
    let x = 0, out = '', k = 0;
    while (x < 1240) {
      const w = 56 + Math.round(seed(k + 61) * 60), h = 70 + Math.round(seed(k + 67) * 70), f = fills[k % fills.length], top = 200 - h;
      out += `<path d="M${x} 200 V${top + 18} L${x + 8} ${top} H${x + w - 8} L${x + w} ${top + 18} V200Z" fill="${f}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      out += `<path d="M${x + 8} ${top} L${x + 14} ${top - 10} H${x + w - 14} L${x + w - 8} ${top}" fill="#8f63e6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      if (seed(k + 71) > .5) out += `<rect x="${x + w - 26}" y="${top - 26}" width="10" height="18" fill="${INK}"/>`;
      for (let r = 0; r < Math.floor((h - 30) / 26); r++) for (let c = 0; c < Math.floor((w - 20) / 22); c++) out += `<rect x="${x + 14 + c * 22}" y="${top + 28 + r * 26}" width="12" height="16" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;
      x += w - 4; k++;
    }
    const eiffel = `<g transform="translate(560 0)"><path d="M60 8 L70 90 C72 112 80 130 100 170 L72 170 C68 156 64 150 60 150 C56 150 52 156 48 170 L20 170 C40 130 48 112 50 90 Z" fill="#b48cff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M46 96 h28 M34 134 h52" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="8" r="5" fill="#ff7ac6" stroke="${INK}" stroke-width="3"/></g>`;
    return `<span class="skyline"><svg viewBox="0 0 1240 200" preserveAspectRatio="xMidYMax slice">${out}${eiffel}<path d="M0 200 H1240" stroke="${INK}" stroke-width="5"/></svg></span>`;
  }

  // things drifting in the sky, behind everything
  const sky = document.createElement('div'); sky.className = 'parisSky'; sky.setAttribute('aria-hidden', 'true');
  const drift = ['macaron', 'beret', 'perfume', 'heart', 'croissant', 'lipstick', 'glasses', 'heel', 'bag', 'macaron', 'heart'];
  sky.innerHTML = clouds() + skyline();
  document.body.insertBefore(sky, document.body.firstChild);



  // retro-futuristic logo: orbit ring with a little planet circling the title, sunset stripes behind it
  const h1 = document.querySelector('.title h1');
  if (h1) {
    const logo = document.createElement('div'); logo.className = 'logo';
    h1.parentNode.insertBefore(logo, h1); logo.appendChild(h1);
    logo.insertAdjacentHTML('afterbegin', `<svg class="logo-back" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="lgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7ac6"/><stop offset="1" stop-color="#b48cff"/></linearGradient></defs>
      <g opacity=".45" fill="url(#lgs)"><rect x="40" y="118" width="520" height="10" rx="5"/><rect x="90" y="138" width="420" height="8" rx="4"/><rect x="150" y="156" width="300" height="6" rx="3"/></g>
      <ellipse cx="300" cy="100" rx="290" ry="74" fill="none" stroke="#fff" stroke-width="5" opacity=".8" transform="rotate(-6 300 100)"/>
      <ellipse cx="300" cy="100" rx="290" ry="74" fill="none" stroke="#2a1540" stroke-width="2" opacity=".35" transform="rotate(-6 300 100)"/>
    </svg>`);
    logo.insertAdjacentHTML('beforeend', `<svg class="logo-front" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path id="orbitpath" d="M10 130 A290 74 -6 0 1 590 70" fill="none"/>
      <g><circle r="11" fill="#ffd98a" stroke="#2a1540" stroke-width="3"/><ellipse rx="19" ry="5" fill="none" stroke="#ff7ac6" stroke-width="3" transform="rotate(-18)"/>
        <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#orbitpath"/></animateMotion></g>
      <g><circle r="3" fill="#fff"/><animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite"><mpath href="#orbitpath"/></animateMotion></g>
    </svg>`);
  }

  // a tiny Eiffel tower in the footer
  const foot = document.querySelector('footer');
  if (foot) foot.insertAdjacentHTML('afterbegin', `<span class="footicon">${svg('eiffel')}</span>`);

  // stars that fly to the badge are sometimes something sweeter
  const STAR = '<svg viewBox="0 0 100 100"><path d="M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40 Z" fill="#ffd98a" stroke="#2a1540" stroke-width="6" stroke-linejoin="round"/></svg>';
  if (window.LPO) window.LPO.flyIcon = () => { const r = Math.random(); return r < .8 ? STAR : svg('heart'); };

  // more things for them to say
  if (window.LPO_COSMO_SAYS) window.LPO_COSMO_SAYS.push('Mon béret est de travers ?', 'Un macaron, vite.', 'Je suis très chic.', 'Rue Cambon, s’il vous plaît.', 'Pas de talons pour moi.');
  if (window.LPO_JULIETTE_SAYS) window.LPO_JULIETTE_SAYS.push('Le béret, toujours.', 'Un petit tour rue Saint-Honoré ?', 'Croissant d’abord, français ensuite.', 'Coco would approve.', 'Macarons ou mots ? Les deux.');
})();
