
(function(){
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav-toggle');
  if(nav && btn){
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
// Lightbox
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    let overlay = document.querySelector('.lightbox-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = "<div class='lightbox-inner' role='dialog' aria-modal='true' aria-label='Image preview'><button class='lightbox-close' aria-label='Close'>&times;</button><img alt='Full view'><p class='lightbox-caption'></p></div>";
      document.body.appendChild(overlay);
    }
    const full = overlay.querySelector('img');
    const caption = overlay.querySelector('.lightbox-caption');
    const close = overlay.querySelector('.lightbox-close');
    const open = (src,text)=>{ full.src = src; caption.textContent = text||""; overlay.classList.add("open"); close.focus(); };
    const hide = ()=> overlay.classList.remove("open");
    overlay.addEventListener("click",e=>{ if(e.target===overlay||e.target===close) hide(); });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") hide(); });
    document.querySelectorAll(".gallery-grid img, .thumb img").forEach(img=>{
      img.style.cursor="zoom-in";
      img.addEventListener("click",()=>{
        const big = img.getAttribute("data-full") || img.currentSrc || img.src;
        open(big, img.alt || "");
      }, {passive:true});
    });
  });
})();
// Search
(function(){
  const dataEl = document.getElementById('search-data');
  if(!dataEl) return;
  const data = JSON.parse(dataEl.textContent || "[]");
  const params = new URLSearchParams(window.location.search);
  const qInput = document.getElementById('q');
  const results = document.getElementById('results');
  function render(hits){
    if(!hits.length){results.innerHTML="<p>No results found.</p>";return;}
    results.innerHTML = hits.map(h=>`
      <article class="result card">
        <h3><a href="${h.url}">${h.title}</a></h3>
        <p>${h.snippet}</p>
        <p><a class="button" href="${h.url}">Open</a></p>
      </article>`).join("");
  }
  function filter(q){
    q = (q||'').trim().toLowerCase();
    if(!q) return data.slice(0, 20);
    return data.filter(h => (h.title + ' ' + h.snippet).toLowerCase().includes(q)).slice(0,50);
  }
  const initial = params.get('q')||''; qInput.value = initial; render(filter(initial));
  qInput.addEventListener('input', ()=>{ const v=qInput.value; const u=new URL(window.location); if(v)u.searchParams.set('q',v); else u.searchParams.delete('q'); history.replaceState(null,'',u); render(filter(v)); });
})();
// Form Validation
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function showToast(msg){
    var t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite');
    t.textContent=msg; document.body.appendChild(t);
    setTimeout(()=>t.classList.add('show'), 20);
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 250); }, 2500);
  }
  function validateField(field){
    const wrap = field.closest('.field') || field.parentElement;
    if(!wrap) return true;
    let valid = true, msg = '';
    if(field.hasAttribute('required') && !field.value.trim()){ valid=false; msg='This field is required.'; }
    else if(field.type==='email'){
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if(!ok){ valid=false; msg='Please enter a valid email.'; }
    }
    if(valid && field.hasAttribute('minlength')){
      const n = parseInt(field.getAttribute('minlength'),10) || 0;
      if(field.value.trim().length < n){ valid=false; msg=`Must be at least ${n} characters.`; }
    }
    let em = wrap.querySelector('.error-msg');
    if(!em){ em = document.createElement('span'); em.className='error-msg'; em.setAttribute('role','alert'); em.setAttribute('aria-live','polite'); wrap.appendChild(em); }
    if(!valid){ wrap.classList.add('error'); em.textContent = msg; }
    else { wrap.classList.remove('error'); em.textContent=''; }
    return valid;
  }
  ready(function(){
    document.querySelectorAll('form').forEach(function(form){
      form.querySelectorAll('input,select,textarea').forEach(function(el){
        el.addEventListener('input', ()=>validateField(el), {passive:true});
        el.addEventListener('blur', ()=>validateField(el));
      });
      form.addEventListener('submit', function(e){
        let firstBad=null, ok=true;
        form.querySelectorAll('input,select,textarea').forEach(function(el){
          const v = validateField(el); if(!v && !firstBad) firstBad=el; ok = ok && v;
        });
        if(!ok){ e.preventDefault(); if(firstBad) firstBad.focus(); return; }
        e.preventDefault();
        setTimeout(function(){
          form.reset();
          form.querySelectorAll('.error').forEach(x=>x.classList.remove('error'));
          showToast('Thanks! Your form was submitted.');
        }, 250);
      });
    });
  });
})();
