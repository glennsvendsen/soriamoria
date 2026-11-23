// Soria Moria website. Set APP_URL to the App Store link when the app is live.
const APP_URL = '';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (APP_URL) { $$('.store').forEach(a => { a.href = APP_URL; a.target = '_blank'; a.rel = 'noopener'; }); const n = $('#storenote'); if (n) n.remove(); }

// nav turns solid after the hero starts scrolling; hero painting drifts slower than the page
const nav = $('#nav'), herobg = $('#herobg');
function onScroll() {
  const y = scrollY;
  nav.classList.toggle('solid', y > 40);
  if (herobg && !reduce && y < innerHeight * 1.2) herobg.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.00015})`;
  bridge();
}

// the troll under the bridge talks back
const spot = $('#trollspot'), bubble = $('#bubble');
const lines = ['Hvem er det som tripper på MIN bro?!', 'Nå kommer jeg og tar deg!', 'Jeg har øyne som tallerkener og nese som et riveskaft!', 'Jeg er så sulten på bukker…'];
let li = 0, bt;
spot?.addEventListener('click', () => {
  bubble.textContent = lines[li++ % lines.length]; bubble.classList.add('on');
  $('.hero').classList.remove('shake'); void $('.hero').offsetWidth; $('.hero').classList.add('shake');
  clearTimeout(bt); bt = setTimeout(() => bubble.classList.remove('on'), 2600);
});

// "tripp trapp": three goats cross the bridge as you scroll, the troll peeks up when one is in the middle
const band = $('#tripp'), goats = $$('#goats .goat'), th = $('#trollhead'), tts = $$('#tt span');
function bridge() {
  if (!band) return;
  const r = band.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  let mid = false;
  goats.forEach((g, i) => {
    const k = Math.min(1, Math.max(0, p * 3 - i));          // 0..1 for this goat's turn
    const x = -15 + k * 130;                                 // % of the scene width
    g.style.left = x + '%';
    g.classList.toggle('walk', k > 0 && k < 1);
    if (k > 0.3 && k < 0.62) mid = true;
  });
  th.classList.toggle('up', mid);
  tts.forEach((s, i) => s.classList.toggle('on', Math.floor(p * 12) % 4 === i && p > 0 && p < 1));
}
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', bridge); addEventListener('load', onScroll); onScroll();

// read-along demo: each word lights up in turn, like in the app. Uses a Norwegian voice when the device has one.
const rt = $('#rtext');
if (rt) {
  rt.innerHTML = rt.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  const words = $$('#rtext .w'), play = $('#rplay');
  const voice = () => speechSynthesis?.getVoices().find(v => /^(nb|no|nn)/i.test(v.lang));
  let timer, playing = false;
  const clear = () => words.forEach(w => w.classList.remove('lit'));
  const stop = () => { playing = false; clearTimeout(timer); clear(); play.textContent = '▶ Les for meg'; try { speechSynthesis.cancel(); } catch (e) {} };
  play.addEventListener('click', () => {
    if (playing) return stop();
    playing = true; play.textContent = '■ Stopp';
    const v = window.speechSynthesis && voice();
    if (v) {   // real narration, highlight on word boundaries
      const u = new SpeechSynthesisUtterance(rt.textContent); u.voice = v; u.lang = v.lang; u.rate = 0.9;
      const starts = []; let pos = 0; words.forEach(w => { starts.push(pos); pos += w.textContent.length + 1; });
      u.onboundary = e => { if (e.name && e.name !== 'word') return; let i = starts.findIndex((s, j) => e.charIndex >= s && (j === starts.length - 1 || e.charIndex < starts[j + 1])); clear(); if (i >= 0) words[i].classList.add('lit'); };
      u.onend = stop; speechSynthesis.speak(u);
    } else {   // no voice: the same rhythm, silently
      let i = 0;
      const step = () => { clear(); if (i >= words.length || !playing) return stop(); words[i].classList.add('lit'); timer = setTimeout(step, 180 + words[i].textContent.length * 55); i++; };
      step();
    }
  });
  words.forEach(w => w.addEventListener('click', () => {
    w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop', 'lit'); setTimeout(() => !playing && w.classList.remove('lit'), 700);
    const v = window.speechSynthesis && voice(); if (v) { const u = new SpeechSynthesisUtterance(w.textContent.replace(/[«»?.,!]/g, '')); u.voice = v; u.lang = v.lang; u.rate = 0.8; speechSynthesis.speak(u); }
  }));
}

// story cards flip
$$('button.card').forEach(c => c.addEventListener('click', () => c.classList.toggle('on')));

// screenshot rail
const rail = $('#rail');
$('#rprev')?.addEventListener('click', () => rail.scrollBy({ left: -rail.clientWidth * 0.6, behavior: 'smooth' }));
$('#rnext')?.addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * 0.6, behavior: 'smooth' }));

// the game: three taps on the big goat, and the troll goes over the edge
const gg = $('#ggoat'), gt = $('#gtroll'), gm = $('#gmsg'), sp = $('#splash'), arena = $('#arena');
let charge = 0, flights = +localStorage.getItem('flights') || 0, busy = false;
const score = () => { if (flights) $('#score').textContent = `Trollet har fløyet i fossen ${flights} ${flights === 1 ? 'gang' : 'ganger'}.`; };
score();
gg?.addEventListener('click', () => {
  if (busy) return;
  charge++;
  gt.classList.remove('hit'); void gt.offsetWidth; gt.classList.add('hit');
  if (charge === 1) { gg.className = 'g-goat c1'; gm.textContent = 'Tripp trapp…'; }
  else if (charge === 2) { gg.className = 'g-goat c2'; gm.textContent = '«Kom bare!» brølte trollet.'; }
  else {
    busy = true; gg.className = 'g-goat charge'; gm.textContent = 'BANG!';
    setTimeout(() => gt.classList.add('fly'), 200);
    setTimeout(() => { sp.classList.remove('go'); void sp.offsetWidth; sp.classList.add('go'); gm.textContent = 'Plask! Snipp snapp snute!'; flights++; localStorage.setItem('flights', flights); score(); }, 1500);
    setTimeout(() => { gt.classList.remove('fly', 'hit'); gg.className = 'g-goat'; gm.textContent = ''; charge = 0; busy = false; }, 3200);
  }
});
arena?.addEventListener('pointermove', e => { const r = arena.getBoundingClientRect(); const x = 35 + ((e.clientX - r.left) / r.width) * 30; gt.querySelectorAll('.ge i').forEach(i => i.style.setProperty('--ex', x + '%')); });

// five golden nuts hidden on the page
let found = +localStorage.getItem('nuts') || 0; const hud = $('#hud');
function showHud() {
  hud.style.display = 'flex';
  hud.innerHTML = `<svg><use href="#nutsym"/></svg> ${found} av 5 gullnøtter` + (found >= 5 ? ' – du fant alle!' : '');
}
if (found) showHud();
$$('.nut').forEach(n => {
  if (localStorage.getItem('n' + n.dataset.i)) { n.remove(); return; }
  n.addEventListener('click', () => { n.classList.add('got'); localStorage.setItem('n' + n.dataset.i, 1); found++; localStorage.setItem('nuts', found); showHud(); setTimeout(() => n.remove(), 600); });
});

// stars over the finale
const fin = $('.finale'); if (fin) for (let i = 0; i < 70; i++) { const s = document.createElement('span'); s.className = 'star'; s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 75 + '%'; s.style.animationDelay = Math.random() * 3 + 's'; fin.appendChild(s); }

// fade sections in as they arrive
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
$$('section h2, .intro, .tile, .steps li, .plan, .readdemo .page, .tr-pic, .quote, .rail figure').forEach((el, i) => { el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
