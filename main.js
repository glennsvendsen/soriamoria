document.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('on')));
// golden nuts
let found=+localStorage.getItem('nuts')||0;const hud=document.getElementById('nut');
function show(){if(!hud)return;hud.style.display='block';hud.textContent='🌰 '+found+' / 5 gullnøtter'+(found>=5?' – takk! Trollet sier hei 👀':'')}
if(found)show();
document.querySelectorAll('.nut').forEach(n=>{if(localStorage.getItem('n'+n.dataset.i))n.style.display='none';
 n.addEventListener('click',()=>{n.style.display='none';localStorage.setItem('n'+n.dataset.i,1);found++;localStorage.setItem('nuts',found);show();
 if(found>=5)document.querySelector('.hero p').textContent='Du fant alle gullnøttene! Barna dine ville vært stolte.'})});
// troll eyes follow cursor, grumble on click
const eyes=document.querySelector('.eyes');
if(eyes){addEventListener('pointermove',e=>{const r=eyes.getBoundingClientRect(),dx=(e.clientX-r.left)/innerWidth-.5;eyes.querySelectorAll('i').forEach(i=>i.style.setProperty('--px',dx*10+'px'))});
 eyes.addEventListener('click',()=>{const t=document.getElementById('say');if(t){t.textContent='«Hvem er det som tripper på MIN bro?!»';setTimeout(()=>t.textContent='',2500)}})}
// butt game
const g=document.getElementById('butt'),tr=document.getElementById('troll');let hits=0;
if(g)g.addEventListener('click',()=>{tr.classList.add('fly');hits++;document.getElementById('score').textContent='Trollet har fløyet '+hits+' gang'+(hits>1?'er':'')+' ned fossen!';setTimeout(()=>tr.classList.remove('fly'),900)});
// stars
const f=document.querySelector('footer');if(f)for(let i=0;i<40;i++){const s=document.createElement('span');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*3+'s';f.appendChild(s)}
