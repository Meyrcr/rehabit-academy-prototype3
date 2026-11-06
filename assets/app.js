/* Rehabit Academy prototype — front-end demonstration only.
   Nothing here sends, stores or verifies anything. No accounts, payments,
   server-side grading, CEUs, certificates or HPCSA submissions exist. */

const courses=[
{id:'knee',name:'Knee Joint Anatomy',category:'Anatomy',icon:'accessibility_new',duration:'45 min',note:'Anatomy fundamentals'},
{id:'acl',name:'ACL Injury & Rehabilitation',category:'Joints & Orthopaedics',icon:'functions',duration:'60 min',note:'Clinical reasoning overview'},
{id:'shoulder',name:'Rotator Cuff Conditions',category:'Joints & Orthopaedics',icon:'health_and_safety',duration:'40 min',note:'Shoulder conditions'},
{id:'hip',name:'Hip and Pelvic Anatomy',category:'Anatomy',icon:'directions_run',duration:'55 min',note:'Movement anatomy'},
{id:'osteoporosis',name:'Osteoporosis & Exercise',category:'Diseases & Conditions',icon:'medication',duration:'50 min',note:'Exercise considerations'},
{id:'diabetes',name:'Diabetes & Exercise',category:'Diseases & Conditions',icon:'bloodtype',duration:'50 min',note:'Metabolic considerations'}];

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const icon=(n,cls='material-symbols-outlined')=>`<span class="${cls}" aria-hidden="true">${n}</span>`;

/* ---------- catalogue ---------- */
function renderCourses(){
  const grid=$('#courseGrid'); if(!grid) return;
  const term=($('#searchCourse')?.value||'').toLowerCase().trim();
  const cat=$('#categoryFilter')?.value||'All';
  const list=courses.filter(c=>(cat==='All'||c.category===cat)&&(c.name.toLowerCase().includes(term)||c.category.toLowerCase().includes(term)||c.note.toLowerCase().includes(term)));
  grid.innerHTML=list.length?list.map(c=>`<article class="plate">
    <div class="course-plate">${icon(c.icon,'material-symbols-outlined glyph')}<span class="status s-draft">Draft · unaccredited</span><span class="stack" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
    <h3>${c.name}</h3>
    <p class="muted small">${c.note}</p>
    <p class="statusline">${chip(c.category)}${chip(c.duration,'timer')}</p>
    <a class="btn btn-block" href="course.html?id=${encodeURIComponent(c.id)}">Open sample lesson ${icon('chevron_right')}</a>
  </article>`).join(''):'';
  const empty=$('#noCourses'); if(empty) empty.classList.toggle('hide',list.length>0);
  const count=$('#courseCount'); if(count) count.textContent=`${list.length} of ${courses.length} sample lessons`;
}
function chip(text,ico){return `<span class="status s-none">${ico?icon(ico):''}${text}</span>`}

/* ---------- course reader ---------- */
function initCourse(){
  const p=new URLSearchParams(location.search);
  const c=courses.find(x=>x.id===p.get('id'))||courses[0];
  $$('[data-course-name]').forEach(e=>e.textContent=c.name);
  $$('[data-course-category]').forEach(e=>e.textContent=c.category);
  $$('[data-course-icon]').forEach(e=>e.innerHTML=icon(c.icon,'material-symbols-outlined ico'));
  const t=$('#courseTime'); if(t) t.textContent=c.duration;
}

/* ---------- assessment demo ---------- */
const quiz=[
['Which joint connects the femur with the tibia?',['Knee','Shoulder','Elbow','Wrist'],0],
['Which is a common anatomical plane?',['Sagittal','Circular','Electrical','Magnetic'],0],
['What is a ligament?',['Connective tissue linking bones','A type of blood vessel','A nerve cell','A gland'],0],
['Which bone forms the kneecap?',['Patella','Scapula','Humerus','Ulna'],0],
['Which term refers to bending a joint?',['Flexion','Extension','Abduction','Rotation'],0],
['A tendon most commonly connects:',['Muscle to bone','Bone to bone','Nerve to skin','Cartilage to blood'],0],
['Which joint is classified as a hinge?',['Elbow','Shoulder','Hip','Sacroiliac'],0],
['Which structure covers many articulating bone ends?',['Articular cartilage','Epidermis','Periosteum only','Skeletal muscle'],0],
['Which term describes movement away from the midline?',['Abduction','Adduction','Flexion','Pronation'],0],
['Which bone is part of the lower leg?',['Tibia','Radius','Clavicle','Sternum'],0]];

function initQuiz(){
  const form=$('#quizForm'),out=$('#quizResult'),bar=$('#quizProgress'),left=$('#attemptsLeft');
  if(!form) return;
  let attempt=1,max=2;
  function draw(){
    form.innerHTML=quiz.map((q,i)=>`<fieldset class="q"><legend><span class="idx">Q${String(i+1).padStart(2,'0')}</span><span>${q[0]}</span></legend>${
      q[1].map((opt,j)=>`<label class="choice"><input type="radio" required name="q${i}" value="${j}"><span>${opt}</span></label>`).join('')
    }</fieldset>`).join('')+`<button class="btn" type="submit">${icon('checklist')}Submit demonstration test</button>`;
    if(bar) bar.style.width=`${((attempt-1)/max)*100}%`;
    if(left) left.textContent=`${max-attempt+1}`;
    $$('.choice input',form).forEach(i=>i.addEventListener('change',()=>{
      $$('.choice',i.closest('fieldset')).forEach(l=>l.classList.toggle('is-picked',l.contains(i)&&i.checked));
    }));
  }
  draw();
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(form);
    const score=quiz.reduce((s,q,i)=>s+(Number(data.get('q'+i))===q[2]?1:0),0);
    const passed=score>=8;
    if(bar) bar.style.width='100%';
    out.classList.remove('hide');
    out.classList.toggle('fail',!passed);
    out.setAttribute('tabindex','-1'); out.focus({preventScroll:true});
    out.innerHTML=`<h3>${icon(passed?'check_circle':'cancel')}${passed?'Passed (demo)':'Not passed (demo)'}</h3>
      <p>Score <strong>${score}/10</strong> on attempt ${attempt} of ${max}. ${icon('info','material-symbols-outlined')} This is browser-only marking: no CPD credit, certificate or completion record is produced by this demonstration.</p>
      ${passed?`<p class="muted small">Production behaviour: the pass decision and the awarded CEUs are read from the approved accreditation record for this activity version, not from this page.</p><a class="btn" href="certificate-example.html">See the certificate design sample ${icon('chevron_right')}</a>`
      :attempt<max?`<p>One demonstration attempt remains. In production the attempt lock, its timer and its audit trail are enforced on the server.</p><button class="btn btn-ghost" type="button" id="again">${icon('autorenew')}Try the demo again</button> <a class="btn-quiet" href="attempt-locked.html">Preview the attempt-locked state</a>`
      :`<p>The demonstration limit is reached.</p><a class="btn" href="attempt-locked.html">See the attempt-locked screen ${icon('chevron_right')}</a>`}`;
    form.classList.add('hide');
    if(!passed&&attempt<max) $('#again').addEventListener('click',()=>{attempt++;out.classList.add('hide');out.classList.remove('fail');form.classList.remove('hide');draw();scrollTo({top:0,behavior:'smooth'})});
  });
}

/* ---------- forms: state that does not persist ---------- */
function demoForm(){
  $$('form[data-demo-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const msg=$('#formMessage');
      const invalid=$$(':invalid',form);
      if(invalid.length){
        invalid.forEach(i=>i.setAttribute('aria-invalid','true'));
        if(msg){msg.className='note alert';msg.innerHTML=`${icon('error_outline')}<span>Fix ${invalid.length} field${invalid.length>1?'s':''} above. Nothing was sent or stored.</span>`;}
        invalid[0].focus();return;
      }
      if(msg){msg.className='note ok';msg.innerHTML=`${icon('verified')}<span>Demonstration only: no information was sent or stored, and no account was created. Production requires a real, secure backend.</span>`;msg.removeAttribute('hidden');}
      form.reset();
    });
    $$('input',form).forEach(i=>i.addEventListener('input',()=>i.removeAttribute('aria-invalid')));
  });
}
function demoButtons(){
  $$('[data-demo-action]').forEach(b=>b.addEventListener('click',()=>{
    const what=b.dataset.demoAction||'This action';
    alert(`${what}: demonstration only. It needs authorised backend work${/pay|buy|subscribe|checkout/i.test(what)?', including PayFast checkout and server-verified callbacks,':''} and an accreditation decision before any CEU or certificate claim. Nothing was charged and no record was created.`);
  }));
}

/* ---------- header ---------- */
function initNav(){
  const t=$('.nav-toggle'),l=$('#navLinks'); if(!t||!l) return;
  t.addEventListener('click',()=>{
    const open=l.classList.toggle('is-open');
    t.setAttribute('aria-expanded',String(open));
    const i=$('.material-symbols-outlined',t); if(i) i.textContent=open?'close':'menu';
  });
}

/* ---------- scroll rail (carousel) ---------- */
function initRails(){
  $$('.rail-scroll').forEach(rail=>{
    const wrap=rail.closest('[data-carousel]'); if(!wrap) return;
    $$('[data-scroll]',wrap).forEach(btn=>btn.addEventListener('click',()=>{
      const dir=btn.dataset.scroll==='next'?1:-1;
      const card=rail.firstElementChild.getBoundingClientRect().width+24;
      rail.scrollBy({left:dir*card*Math.round(rail.clientWidth/card||1),behavior:'smooth'});
    }));
  });
}

function initBars(){$$('.progress > span[data-w]').forEach(b=>b.style.width=Math.max(0,Math.min(100,Number(b.dataset.w)||0))+'%')}

/* ---------- hero spine readout ---------- */
function initSpine(){
  $$('.spine-bg path').forEach(p=>{try{p.style.setProperty('--len',Math.round(p.getTotalLength()));}catch(e){}});
  const ticks=$$('.ruler i[data-step]'); if(!ticks.length) return;
  const secs=ticks.map(t=>document.getElementById(t.dataset.step)).filter(Boolean);
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    if(!en.isIntersecting) return;
    const i=secs.indexOf(en.target); if(i<0) return;
    ticks.forEach((t,j)=>t.classList.toggle('here',j===i));
  }),{rootMargin:'-45% 0px -45% 0px'});
  secs.forEach(s=>io.observe(s));
}

document.addEventListener('DOMContentLoaded',()=>{
  initNav();initRails();initSpine();initBars();renderCourses();
  $('#searchCourse')?.addEventListener('input',renderCourses);
  $('#categoryFilter')?.addEventListener('change',renderCourses);
  if($('#courseGrid')) initCourse();
  if($('#quizForm')) initQuiz();
  demoForm();demoButtons();
});
