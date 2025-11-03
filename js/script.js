/* =========================
   BCook – Part 3 Enhancements
   - Lightbox for gallery
   - Services filter
   - Form validation (contact + enquiry)
   (marker: BCOOK_PART23_JS)
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  setupLightbox();
  setupServiceFilter();
  setupFormValidation("#contact-form");
  setupFormValidation("#enquiry-form");
});

function setupLightbox() {
  const imgs = document.querySelectorAll(".gallery-grid img");
  if (!imgs.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Image preview">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img alt="Full view">
      <p class="lightbox-caption"></p>
    </div>`;
  document.body.appendChild(overlay);

  const full = overlay.querySelector("img");
  const caption = overlay.querySelector(".lightbox-caption");
  const close = overlay.querySelector(".lightbox-close");

  const open = (src, text) => {
    full.src = src;
    caption.textContent = text || "";
    overlay.classList.add("open");
    close.focus();
  };
  const hide = () => overlay.classList.remove("open");

  imgs.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => open(img.src, img.alt));
  });
  overlay.addEventListener("click", e => { if (e.target === overlay || e.target === close) hide(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
}

function setupServiceFilter() {
  const input = document.querySelector("#service-filter");
  const cards = document.querySelectorAll(".services .service");
  if (!input || !cards.length) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    cards.forEach(c => {
      const text = c.textContent.toLowerCase();
      c.style.display = text.includes(q) ? "" : "none";
    });
  });
}

function setupFormValidation(selector) {
  const form = document.querySelector(selector);
  if (!form) return;

  const showErr = (el, msg) => {
    let hint = el.parentElement.querySelector(".field-error");
    if (!hint) {
      hint = document.createElement("div");
      hint.className = "field-error";
      el.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
    el.setAttribute("aria-invalid", "true");
  };

  const clearErr = (el) => {
    const hint = el.parentElement.querySelector(".field-error");
    if (hint) hint.textContent = "";
    el.removeAttribute("aria-invalid");
  };

  form.addEventListener("submit", (e) => {
    let ok = true;

    form.querySelectorAll("[required]").forEach(el => {
      if (!el.value.trim()) { ok = false; showErr(el, "This field is required."); }
      else clearErr(el);
    });

    const email = form.querySelector('input[type="email"]');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      ok = false; showErr(email, "Enter a valid email address.");
    }

    const name = form.querySelector('#name');
    if (name && name.value.trim().length < 3) {
      ok = false; showErr(name, "Name must be at least 3 characters.");
    }

    if (!ok) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    e.preventDefault();
    form.reset();
    alert("Thanks! Your form was submitted successfully.");
  });

  form.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => clearErr(el));
    el.addEventListener("blur", () => { if (el.value.trim()) clearErr(el); });
  });
}


/* Mobile menu toggle (marker: BCOOK_MOBILE_JS) */
(function(){
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav-toggle');
  if(!nav || !btn) return;
  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();


/* Animations: Option B (marker: BCOOK_ANIM_B_JS) */
(function(){
  // Scroll reveal for cards, gallery thumbs, and services
  const targets = Array.from(document.querySelectorAll('.card, .gallery-grid .thumb, .services .service'));
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('reveal-in');
        io.unobserve(e.target);
      }
    });
  }, {rootMargin:'0px 0px -10% 0px', threshold:0.1});
  targets.forEach(t => io.observe(t));

  // Button active pop
  document.querySelectorAll('.button').forEach(btn=>{
    btn.addEventListener('mousedown', ()=> btn.style.transform='scale(.98)');
    ['mouseup','mouseleave','blur'].forEach(ev=>btn.addEventListener(ev, ()=> btn.style.transform=''));
  });
})();


/* Lightbox hardening (marker: BCOOK_LIGHTBOX_FIX) */
(function(){
  const ensureOverlay = () => {
    let overlay = document.querySelector('.lightbox-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = "<div class='lightbox-inner' role='dialog' aria-modal='true' aria-label='Image preview'>\
<button class='lightbox-close' aria-label='Close'>&times;</button>\
<img alt='Full view'><p class='lightbox-caption'></p></div>";
    document.body.appendChild(overlay);
    return overlay;
  };
  function init(){
    const imgs = document.querySelectorAll(".gallery-grid img, .thumb img");
    if(!imgs.length) return;
    const overlay = ensureOverlay();
    const full = overlay.querySelector("img");
    const caption = overlay.querySelector(".lightbox-caption");
    const close = overlay.querySelector(".lightbox-close");
    const open = (src,text)=>{ full.src = src; caption.textContent = text||""; overlay.classList.add("open"); close.focus(); };
    const hide = ()=> overlay.classList.remove("open");
    imgs.forEach(img=>{
      img.style.cursor="zoom-in";
      img.addEventListener("click",()=>{
        const big = img.getAttribute("data-full") || img.currentSrc || img.src;
        open(big, img.alt || "");
      });
    });
    overlay.addEventListener("click",e=>{ if(e.target===overlay||e.target===close) hide(); });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") hide(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();


/* CLICK_FIX ensure listeners (BCOOK_OVERLAY_FIX) */
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    // create overlay if missing
    let overlay = document.querySelector('.lightbox-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = "<div class='lightbox-inner'><button class='lightbox-close' aria-label='Close'>&times;</button><img alt='Full view'><p class='lightbox-caption'></p></div>";
      document.body.appendChild(overlay);
    }
    const full = overlay.querySelector('img');
    const caption = overlay.querySelector('.lightbox-caption');
    const close = overlay.querySelector('.lightbox-close');
    function open(src, text){ full.src = src; caption.textContent = text||''; overlay.classList.add('open'); }
    function hide(){ overlay.classList.remove('open'); }
    overlay.addEventListener('click', e=>{ if(e.target===overlay || e.target===close) hide(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') hide(); });

    // bind clicks
    document.querySelectorAll('.gallery-grid img, .thumb img').forEach(img=>{
      img.style.cursor='zoom-in';
      img.addEventListener('click', ()=>{
        const big = img.getAttribute('data-full') || img.currentSrc || img.src;
        open(big, img.alt||'');
      }, {passive:true});
    });
  });
})();


/* === Real-time validation & feedback (BCOOK_FORM_FEEDBACK) === */
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
      // Enhance fields
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
        // Simulate async submit for local demo
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
