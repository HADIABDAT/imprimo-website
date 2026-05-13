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
  { id:1,  cat:'textile',    title:"Combinaison brodée — Hôtel Bounehar",        seed:'combinaisonamazigh',             size:'tall' },
  { id:2,  cat:'textile',    title:"T-Shirt flocage — Bounehar",                 seed:'tshirtbounehar2',                size:'wide' },
  { id:3,  cat:'emballage',  title:"Emballage Amazigh — Édition spéciale",       seed:'emballageamazigh',               size:'sq'   },
  { id:4,  cat:'emballage',  title:"Emballage — Hija Phone",                     seed:'emballagehijophone',             size:'sq'   },
  { id:5,  cat:'textile',    title:"T-Shirt Tachwayt — Collection Kabyle",       seed:'tshirttachwayt',                 size:'sq'   },
  { id:6,  cat:'impression', title:"Flyers — Pharmacie Apoteka",                 seed:'petiteimpressionpharmacie',      size:'tall' },
  { id:7,  cat:'textile',    title:"Uniformes — Touaoula Patisserie",            seed:'combinaisontwawla2',             size:'wide' },
  { id:8,  cat:'emballage',  title:"Emballage — Miel Akfadou",                   seed:'mielboites',                    size:'sq'   },
  { id:9,  cat:'textile',    title:"T-Shirt cosmetique — Beauticia",             seed:'tshirtcosmetique',               size:'sq'   },
  { id:10, cat:'emballage',  title:"Emballage — Twawla Béjaïa",                  seed:'embalagetwawla',                 size:'sq'   },
  { id:11, cat:'textile',    title:"Combinaison — Twawla Béjaïa",                seed:'combinaisontwawla3',             size:'tall' },
  { id:12, cat:'emballage',  title:"Emballage téléphonie — Said 34 Phone",       seed:'emballagesaidphone',             size:'wide' },
  { id:13, cat:'textile',    title:"Combinaison Amazigh — Série 3",              seed:'combinaisonamazigh3',            size:'sq'   },
  { id:14, cat:'impression', title:"Flyers enfants — Impression locale",          seed:'petitimpressionenfants',         size:'sq'   },
  { id:15, cat:'impression', title:"Cartes de visite — Maxtor",                    seed:'cartemaxtor4',                   size:'tall' },
  { id:16, cat:'impression', title:"Cartes de visite — finition premium",          seed:'cartemaxtor3',                   size:'sq'   },
  { id:17, cat:'impression', title:"Cartes — Maison Apiculture",                   seed:'carteapiculture',                size:'sq'   },
  { id:18, cat:'impression', title:"Cartes — Bougie Phone",                        seed:'cartebougiephone',               size:'sq'   },
  { id:19, cat:'impression', title:"Cartes — Service Thermique Pro",               seed:'carteservicethermiquepro',       size:'wide' },
  { id:20, cat:'impression', title:"Cartes — série Maxtor",                        seed:'cartemaxtor5',                   size:'sq'   },
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
  reveal('.ct-card', { stagger: 0.12 });
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

