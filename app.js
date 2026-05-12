/* =============================================================
   IMPRIMO — App JS
============================================================= */
/* Mark page as loaded ONLY when document is visible, so animations never
   leave the hero blank in a backgrounded tab. */
function markLoaded(){
  if(document.visibilityState === 'visible'){
    document.body.classList.add('is-loaded');
    document.removeEventListener('visibilitychange', markLoaded);
  }
}
markLoaded();
document.addEventListener('visibilitychange', markLoaded);

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 0. Portfolio data (rendered to DOM) ---------- */
const PORTFOLIO = [
  { id:1,  cat:'enseignes',  title:"Enseigne lumineuse — Optique Centrale",      seed:'panneaulimuneuxbounehar',  size:'tall' },
  { id:2,  cat:'impression', title:"Bâche événement — Salon Auto Sétif",         seed:'grandimpressionwoemnsday',  size:'wide' },
  { id:3,  cat:'textile',    title:"Flocage staff — FC Sétif",                   seed:'tshirtbounehar',  size:'sq'   },
  { id:4,  cat:'facades',    title:"Façade Alucobond — Showroom Atlas",          seed:'opticien',  size:'sq'   },
  { id:5,  cat:'enseignes',  title:"Caisson lumineux — Pharmacie NumiPharm",     seed:'panneaulimuneuxbounehar',  size:'sq'   },
  { id:6,  cat:'impression', title:"Roll-ups — Conférence BENAMOR",              seed:'grandimpression',  size:'tall' },
  { id:7,  cat:'textile',    title:"Uniformes — Riadh Hôtel",                    seed:'combinaisontwawla',  size:'wide' },
  { id:8,  cat:'facades',    title:"Habillage Composite — Sahara Bank",          seed:'opticien',  size:'sq'   },
  { id:9,  cat:'enseignes',  title:"Lettres boîtier — Café Numidia",             seed:'cadres',  size:'sq'   },
  { id:10, cat:'impression', title:"Catalogue 96p — Cevital Distribution",       seed:'cal', size:'sq'   },
  { id:11, cat:'textile',    title:"Sérigraphie sacs — Sétif Mall",              seed:'tshirtcosmetique', size:'tall' },
  { id:12, cat:'facades',    title:"Totem signalétique — Hôpital Sétif",         seed:'paneaubounehar', size:'wide' },
  { id:13, cat:'enseignes',  title:"Néon flex — Bar à café Numidia",             seed:'panneaulimuneuxbounehar', size:'sq' },
  { id:14, cat:'impression', title:"Affichage 4×3 — Campagne El Khabar",         seed:'grandimpressionassegassameguaz', size:'sq' },
];

const SIZE_TO_SPAN = { sq:{c:4,r:30}, wide:{c:8,r:30}, tall:{c:4,r:46} };

function renderPortfolio(){
  const grid = document.getElementById('pfGrid');
  if(!grid) return;
  grid.innerHTML = PORTFOLIO.map(p => {
    const sp = SIZE_TO_SPAN[p.size];
    const w = sp.c === 8 ? 1200 : 800;
    const h = sp.r === 46 ? 1100 : (sp.c === 8 ? 700 : 800);
    return `
      <a class="pf-card glightbox" href="Images/${p.seed}.jpg"
         data-cat="${p.cat}"
         data-gallery="imprimo-pf"
         data-title="${p.title}"
         data-description="${p.cat.toUpperCase()}"
         style="grid-column:span ${sp.c};grid-row:span ${sp.r}">
        <img loading="lazy" src="Images/${p.seed}.jpg" alt="${p.title}">
        <div class="pf-card__overlay">
          <span class="pf-card__cat">${p.cat}</span>
          <span class="pf-card__title">${p.title} <i class="ph ph-arrow-up-right"></i></span>
        </div>
      </a>`;
  }).join('');
}
renderPortfolio();

/* ---------- 1. Navbar scroll + mobile menu ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobilemenu = document.getElementById('mobilemenu');

addEventListener('scroll', () => {
  if(window.scrollY > 30) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
}, { passive:true });

burger.addEventListener('click', () => {
  const open = !mobilemenu.classList.contains('is-open');
  mobilemenu.classList.toggle('is-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  mobilemenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mobilemenu.addEventListener('click', e => {
  if(e.target.tagName === 'A'){
    mobilemenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }
});

/* ---------- 2. GSAP animations ---------- */
gsap.registerPlugin(ScrollTrigger);

if(!PREFERS_REDUCED){
  /* Hero entry animation is handled by pure CSS @keyframes (see styles.css) */

  /* Generic scroll reveals */
  const reveal = (sel, opts={}) => {
    document.querySelectorAll(sel).forEach(el => {
      gsap.from(el, Object.assign({
        y:40, opacity:0, duration:.7, ease:'power2.out',
        scrollTrigger:{ trigger: el, start:'top 80%' }
      }, opts));
    });
  };
  reveal('.about__left > *, .about__right .collage');
  reveal('.section-head > *');
  reveal('.srv', { stagger:.06 });
  reveal('.pf-card', { stagger:.04 });
  reveal('.info-card, .mapwrap, .form');
  reveal('.bn');

  /* Process horizontal pin (desktop only) */
  if(window.matchMedia('(min-width: 900px)').matches){
    const rail = document.querySelector('.process__rail');
    const track = document.querySelector('.process__track');
    if(rail && track){
      const distance = () => rail.scrollWidth - window.innerWidth + 80;
      gsap.to(rail, {
        x: () => -distance(),
        ease:'none',
        scrollTrigger:{
          trigger: track,
          start:'top top',
          end: () => '+=' + distance(),
          pin:true,
          scrub:.6,
          invalidateOnRefresh:true,
        }
      });
    }
  }
}

/* ---------- 3. CountUp.js ---------- */
function startCount(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const cu = new countUp.CountUp(el, target, { duration: 2.2, suffix, useEasing:true, separator:' ' });
  if(!cu.error) cu.start();
}
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){ startCount(e.target); cObs.unobserve(e.target); }
  });
}, { threshold:.4 });
document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

/* ---------- 4. Portfolio filter ---------- */
const filterbar = document.getElementById('filterbar');
filterbar?.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if(!chip) return;
  filterbar.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
  chip.classList.add('is-active');
  const f = chip.dataset.filter;
  document.querySelectorAll('.pf-card').forEach(card => {
    const match = f === 'all' || card.dataset.cat === f;
    if(PREFERS_REDUCED){
      card.classList.toggle('is-hidden', !match);
    } else if(match){
      card.classList.remove('is-hidden');
      gsap.fromTo(card, { opacity:0, scale:.92 }, { opacity:1, scale:1, duration:.5, ease:'power2.out' });
    } else {
      gsap.to(card, { opacity:0, scale:.92, duration:.3, ease:'power2.in', onComplete:()=>card.classList.add('is-hidden') });
    }
  });
  ScrollTrigger.refresh();
});

/* ---------- 5. Swiper testimonials ---------- */
new Swiper('.testi__swiper', {
  loop:true,
  slidesPerView:1,
  spaceBetween:24,
  autoplay:{ delay: 5500, disableOnInteraction:false },
  pagination:{ el:'.swiper-pagination', clickable:true },
  speed: 650,
});

/* ---------- 6. GLightbox ---------- */
GLightbox({ selector:'.glightbox', loop:true });

/* ---------- 7. Form (Formspree placeholder) ---------- */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  // Real handler: Formspree POST. For preview, prevent + alert.
  if(e.currentTarget.action.includes('xxxxx')){
    e.preventDefault();
    alert('Merci ! Votre demande a bien été enregistrée. Nous revenons vers vous sous 24h.');
    e.currentTarget.reset();
  }
});
