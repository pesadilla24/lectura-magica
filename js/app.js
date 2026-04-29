/* ═══════════════════════════
   LEVEL DATA
═══════════════════════════ */
const LEVELS = [
  {
    id:1, title:"Los Animales", emoji:"🐶",
    color:"#FF6B6B", shadow:"#CC3333", bg:"#FFF5F5",
    story:{
      illo:"🐶🐱🐰", ttl:"¡Hola, Tomi!",
      lines:[
        "El perro se llama Tomi.",
        "Tomi es café y muy grande.",
        "A Tomi le gusta jugar.",
        "Tomi corre con la pelota.",
        "¡Tomi es muy divertido!"
      ]
    },
    qs:[
      {q:"¿Cómo se llama el perro?",     ic:"🐶", opts:["Tobi","Tomi","Tito"],        ok:1},
      {q:"¿De qué color es Tomi?",       ic:"🎨", opts:["Negro","Blanco","Café"],      ok:2},
      {q:"¿Qué le gusta hacer a Tomi?",  ic:"⚽", opts:["Dormir","Jugar","Nadar"],     ok:1}
    ]
  },
  {
    id:2, title:"El Mar", emoji:"🐠",
    color:"#4ECDC4", shadow:"#2A9D8F", bg:"#F0FFFE",
    story:{
      illo:"🐠🦈🌊", ttl:"Nemo y el Mar",
      lines:[
        "Nemo es un pez naranja.",
        "Nemo vive en el mar azul.",
        "El mar tiene muchos peces.",
        "También hay algas verdes.",
        "Nemo nada muy rápido.",
        "¡El mar es su hogar!"
      ]
    },
    qs:[
      {q:"¿De qué color es Nemo?",  ic:"🎨", opts:["Azul","Naranja","Rojo"],              ok:1},
      {q:"¿Dónde vive Nemo?",       ic:"🌊", opts:["En el río","En el lago","En el mar"],  ok:2},
      {q:"¿Qué hay en el mar?",     ic:"🐟", opts:["Muchos peces","Pájaros","Leones"],     ok:0}
    ]
  },
  {
    id:3, title:"El Bosque", emoji:"🦋",
    color:"#51CF66", shadow:"#2F9E44", bg:"#F0FFF4",
    story:{
      illo:"🌳🦋🌸", ttl:"Luna la Mariposa",
      lines:[
        "Luna es una mariposa.",
        "Sus alas son de muchos colores.",
        "Luna vive en el bosque verde.",
        "Ella vuela entre las flores.",
        "Las flores huelen muy bien.",
        "¡Luna ama su bosque!"
      ]
    },
    qs:[
      {q:"¿Quién es Luna?",          ic:"🦋", opts:["Un pájaro","Una mariposa","Una abeja"],     ok:1},
      {q:"¿Dónde vive Luna?",        ic:"🌳", opts:["En el mar","En el desierto","En el bosque"], ok:2},
      {q:"¿Cómo son las flores?",    ic:"🌸", opts:["Huelen bien","Son feas","Son frías"],         ok:0}
    ]
  },
  {
    id:4, title:"Mi Familia", emoji:"👨‍👩‍👧",
    color:"#CC5DE8", shadow:"#9B2FC9", bg:"#FDF4FF",
    story:{
      illo:"👨‍👩‍👧🏠❤️", ttl:"Mi Familia Feliz",
      lines:[
        "Yo tengo una familia.",
        "Mi papá se llama Carlos.",
        "Mi mamá se llama Ana.",
        "Mi hermano se llama Pedro.",
        "Nosotros vivimos juntos.",
        "Mi familia me quiere mucho.",
        "¡Yo también los quiero!"
      ]
    },
    qs:[
      {q:"¿Cómo se llama el papá?",     ic:"👨", opts:["Ana","Pedro","Carlos"],   ok:2},
      {q:"¿Cómo se llama la mamá?",     ic:"👩", opts:["Ana","Sara","Elena"],     ok:0},
      {q:"¿Cómo se llama el hermano?",  ic:"👦", opts:["Luis","Pedro","Juan"],    ok:1}
    ]
  },
  {
    id:5, title:"Las Estrellas", emoji:"⭐",
    color:"#FFD93D", shadow:"#C9A800", bg:"#FFFFF0",
    story:{
      illo:"🌙⭐🌟", ttl:"Sofi y las Estrellas",
      lines:[
        "Sofi mira el cielo de noche.",
        "Ella ve muchas estrellas.",
        "Las estrellas brillan mucho.",
        "La luna también brilla.",
        "Sofi ve una estrella fugaz.",
        "¡Sofi pide un deseo!",
        "¡Los sueños se hacen realidad!"
      ]
    },
    qs:[
      {q:"¿Cómo se llama la niña?",                  ic:"👧", opts:["Luna","Sofi","Ana"],                 ok:1},
      {q:"¿Qué ve Sofi en el cielo?",                ic:"⭐", opts:["Pájaros","Aviones","Estrellas"],     ok:2},
      {q:"¿Qué hace Sofi al ver la estrella fugaz?", ic:"✨", opts:["Se duerme","Llora","Pide un deseo"], ok:2}
    ]
  }
];

/* ═══════════════════════════
   STATE
═══════════════════════════ */
const G = { lvIdx:0, qIdx:0, correct:0, unlocked:1, stars:[0,0,0,0,0], speaking:false };

function loadG(){
  try{ const s=localStorage.getItem('lm3'); if(s){ const d=JSON.parse(s); G.unlocked=d.unlocked||1; G.stars=d.stars||[0,0,0,0,0]; } }catch(e){}
}
function saveG(){
  try{ localStorage.setItem('lm3', JSON.stringify({unlocked:G.unlocked, stars:G.stars})); }catch(e){}
}

/* ═══════════════════════════
   THEME
═══════════════════════════ */
function toggleDark(){
  document.body.classList.add('transitioning');
  const isDark = document.body.classList.toggle('dark');
  document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
  try{ localStorage.setItem('lm3-theme', isDark ? 'dark' : 'light'); }catch(e){}
  setTimeout(()=>document.body.classList.remove('transitioning'), 400);
}

function loadTheme(){
  try{
    if(localStorage.getItem('lm3-theme')==='dark'){
      document.body.classList.add('dark');
      document.getElementById('theme-toggle').textContent='☀️';
    }
  }catch(e){}
}

/* ═══════════════════════════
   NAVIGATION
═══════════════════════════ */
function go(name){
  stopSpeak();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active','pop'));
  const ids={welcome:'welcome-screen',levels:'levels-screen',reading:'reading-screen',quiz:'quiz-screen',results:'results-screen'};
  const el=document.getElementById(ids[name]||name);
  el.classList.add('active');
  requestAnimationFrame(()=>{ el.classList.add('pop'); });
  if(name==='levels'){ buildLevels(); updateBanner(); }
}

/* ═══════════════════════════
   LEVEL GRID
═══════════════════════════ */
function buildLevels(){
  const g=document.getElementById('levels-grid');
  g.innerHTML='';
  LEVELS.forEach((lv,i)=>{
    const ok=i<G.unlocked, earned=G.stars[i];
    const card=document.createElement('div');
    if(i<G.unlocked) card.className='lcard'+(earned>0?' done':'');
    else             card.className='lcard locked';
    card.style.setProperty('--lc',lv.color);
    if(ok) card.onclick=()=>openLevel(i);
    let stars='';
    for(let s=0;s<3;s++) stars+=`<span style="color:${s<earned?'#FFD93D':'#DDD'}">★</span>`;
    card.innerHTML=`
      <div class="lcard-bar" style="background:${lv.color}"></div>
      <span class="lcard-emoji">${lv.emoji}</span>
      <div class="lcard-num">Nivel ${lv.id}</div>
      <div class="lcard-name">${lv.title}</div>
      <div class="lcard-stars">${stars}</div>
      ${!ok?'<div class="lock-overlay">🔒</div>':''}
    `;
    g.appendChild(card);
  });
}

function updateBanner(){
  const t=G.stars.reduce((a,b)=>a+b,0);
  document.getElementById('total-stars').textContent=t+' / 15 estrellas';
}

/* ═══════════════════════════
   OPEN LEVEL
═══════════════════════════ */
function openLevel(i){
  G.lvIdx=i; G.qIdx=0; G.correct=0;
  const lv=LEVELS[i];
  document.getElementById('r-pill').textContent=`Nivel ${lv.id}: ${lv.title}`;
  document.getElementById('r-pill').style.background=lv.color;
  document.getElementById('r-prog').style.width='12%';
  document.getElementById('r-prog').style.background=`linear-gradient(90deg,${lv.color},${lv.shadow})`;
  document.getElementById('b-illo').textContent=lv.story.illo;
  document.getElementById('b-title').textContent=lv.story.ttl;
  document.getElementById('b-title').style.color=lv.color;

  const illo=document.getElementById('b-illo');
  illo.style.animation='none'; void illo.offsetWidth; illo.style.animation='';

  const body=document.getElementById('b-body');
  body.style.background=lv.bg;
  body.innerHTML=lv.story.lines.map((line,li)=>
    `<p class="story-para">${line.split(' ').map((w,wi)=>`<span class="sw" data-li="${li}" data-wi="${wi}">${w}</span>`).join(' ')}</p>`
  ).join('');

  document.getElementById('btn-speak').textContent='🔊 Escuchar';
  document.getElementById('q-back').onclick=()=>openLevel(i);
  go('reading');
}

/* ═══════════════════════════
   SPEECH
═══════════════════════════ */
let speakTimer=null;

function stopSpeak(){
  if(window.speechSynthesis) window.speechSynthesis.cancel();
  if(speakTimer){ clearTimeout(speakTimer); speakTimer=null; }
  G.speaking=false;
  const b=document.getElementById('btn-speak');
  if(b) b.textContent='🔊 Escuchar';
  document.querySelectorAll('.sw.lit').forEach(e=>e.classList.remove('lit'));
}

function speakStory(){
  if(G.speaking){ stopSpeak(); return; }
  G.speaking=true;
  document.getElementById('btn-speak').textContent='✋ Detener';
  const lv=LEVELS[G.lvIdx];
  const allWords=[...document.querySelectorAll('.sw')];
  let idx=0;

  if(window.speechSynthesis){
    const utt=new SpeechSynthesisUtterance(lv.story.lines.join('. '));
    utt.lang='es-ES'; utt.rate=0.72; utt.pitch=1.15;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(v=>v.lang.startsWith('es')&&v.name.toLowerCase().includes('female'))
           ||voices.find(v=>v.lang.startsWith('es'));
    if(v) utt.voice=v;
    utt.onend=stopSpeak; utt.onerror=stopSpeak;
    window.speechSynthesis.speak(utt);
  }

  function step(){
    if(!G.speaking) return;
    allWords.forEach(e=>e.classList.remove('lit'));
    if(idx<allWords.length){
      allWords[idx].classList.add('lit');
      allWords[idx].scrollIntoView({behavior:'smooth',block:'nearest'});
      idx++;
      speakTimer=setTimeout(step, 330);
    } else { stopSpeak(); }
  }
  step();
}

if(window.speechSynthesis){
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
}

/* ═══════════════════════════
   QUIZ
═══════════════════════════ */
function startQuiz(){
  stopSpeak();
  G.qIdx=0; G.correct=0;
  const lv=LEVELS[G.lvIdx];
  document.getElementById('q-pill').textContent=`📖 ${lv.title}`;
  document.getElementById('q-pill').style.background=lv.color;
  document.getElementById('q-prog').style.background=`linear-gradient(90deg,${lv.color},${lv.shadow})`;
  go('quiz');
  renderQ();
}

function renderQ(){
  const lv=LEVELS[G.lvIdx], q=lv.qs[G.qIdx], total=lv.qs.length;
  document.getElementById('q-prog').style.width=`${(G.qIdx/total)*100}%`;
  document.getElementById('q-num').textContent=`Pregunta ${G.qIdx+1} de ${total}`;
  document.getElementById('q-text').textContent=`${q.ic} ${q.q}`;

  const grid=document.getElementById('ans-grid');
  grid.innerHTML='';
  ['A','B','C'].forEach((letter,i)=>{
    const btn=document.createElement('button');
    btn.className='ans-btn';
    btn.innerHTML=`<span class="ans-letter">${letter}</span><span>${q.opts[i]}</span>`;
    btn.onclick=()=>checkAns(i,btn,q);
    grid.appendChild(btn);
  });
}

function checkAns(chosen, btn, q){
  document.querySelectorAll('.ans-btn').forEach(b=>{ b.onclick=null; b.style.opacity='.72'; b.style.cursor='default'; });
  const allBtns=document.querySelectorAll('.ans-btn');
  allBtns[q.ok].style.opacity='1';
  if(chosen===q.ok){
    G.correct++;
    btn.classList.add('ok'); btn.style.opacity='1';
    popup('✅');
  } else {
    btn.classList.add('bad','shakeX'); btn.style.opacity='1';
    allBtns[q.ok].classList.add('ok');
    popup('❌');
  }
  setTimeout(()=>{
    G.qIdx++;
    if(G.qIdx<LEVELS[G.lvIdx].qs.length) renderQ();
    else showResults();
  }, 1600);
}

function popup(emoji){
  const el=document.createElement('div');
  el.className='pop-lbl'; el.textContent=emoji;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1300);
}

/* ═══════════════════════════
   RESULTS
═══════════════════════════ */
function showResults(){
  const lv=LEVELS[G.lvIdx], total=lv.qs.length, got=G.correct;
  let stars=0;
  if(got===total) stars=3; else if(got>=total-1) stars=2; else if(got>=1) stars=1;

  if(stars>G.stars[G.lvIdx]) G.stars[G.lvIdx]=stars;
  if(stars>=1 && G.lvIdx+1<LEVELS.length) G.unlocked=Math.max(G.unlocked, G.lvIdx+2);
  saveG();

  const cfgs={
    3:{e:'🏆',t:'¡Perfecto!',            c:'#FFD93D'},
    2:{e:'🌟',t:'¡Muy bien!',            c:'#06D6A0'},
    1:{e:'😊',t:'¡Buen intento!',        c:'#4CC9F0'},
    0:{e:'💪',t:'¡Inténtalo otra vez!',  c:'#FF6B6B'}
  };
  const cfg=cfgs[stars];
  document.getElementById('r-emoji').textContent=cfg.e;
  document.getElementById('r-title').textContent=cfg.t;
  document.getElementById('r-title').style.color=cfg.c;
  document.getElementById('r-detail').textContent=`${got} de ${total} respuestas correctas`;

  const starsEl=document.getElementById('r-stars');
  starsEl.innerHTML=[0,1,2].map(i=>
    `<span class="r-star" style="filter:${i<stars?'drop-shadow(0 0 8px #FFD93D)':'grayscale(1) opacity(.35)'}">⭐</span>`
  ).join('');

  const nb=document.getElementById('btn-next');
  if(G.lvIdx<LEVELS.length-1 && G.unlocked>G.lvIdx+1){
    nb.textContent='¡Siguiente nivel! ➡️';
    nb.onclick=()=>openLevel(G.lvIdx+1);
    nb.style.display='block';
  } else if(G.lvIdx>=LEVELS.length-1){
    nb.textContent='🎊 ¡Todo completado!';
    nb.onclick=()=>go('levels');
  } else {
    nb.textContent='🔄 Intentar de nuevo';
    nb.onclick=()=>openLevel(G.lvIdx);
  }

  go('results');
  if(stars>0) setTimeout(()=>confetti(stars),400);
}

/* ═══════════════════════════
   CONFETTI
═══════════════════════════ */
function confetti(stars){
  const layer=document.getElementById('confetti');
  const cols=['#FF6B6B','#4ECDC4','#FFD93D','#06D6A0','#CC5DE8','#FF6B35','#4CC9F0','#FF6B9D'];
  const shapes=['●','▲','■','◆','★','♥'];
  const n=stars===3?130:stars===2?85:50;
  for(let i=0;i<n;i++){
    setTimeout(()=>{
      const p=document.createElement('span');
      p.className='cp';
      p.textContent=shapes[Math.random()*shapes.length|0];
      const sz=9+Math.random()*18, dur=2.5+Math.random()*2;
      p.style.cssText=`left:${Math.random()*100}%;font-size:${sz}px;color:${cols[Math.random()*cols.length|0]};animation:cpFall ${dur}s linear forwards;animation-delay:${Math.random()*.8}s;`;
      layer.appendChild(p);
      setTimeout(()=>p.remove(),(dur+1)*1000);
    },i*18);
  }
}

/* ═══════════════════════════
   INIT
═══════════════════════════ */
loadG();
loadTheme();
