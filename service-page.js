/* Service detail page — light JS */
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Navbar scroll + mobile burger (mirror of homepage) */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobilemenu = document.getElementById('mobilemenu');

addEventListener('scroll', () => {
  if(window.scrollY > 30) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
}, { passive:true });

burger?.addEventListener('click', () => {
  const open = !mobilemenu.classList.contains('is-open');
  mobilemenu.classList.toggle('is-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  mobilemenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mobilemenu?.addEventListener('click', e => {
  if(e.target.tagName === 'A'){
    mobilemenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }
});

if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  if(!PREFERS_REDUCED){
    gsap.from('.svc-hero__icon, .svc-hero__title, .svc-hero__sub, .svc-hero__meta', {
      y: 30, opacity: 0, duration: .8, ease:'power3.out', stagger: .08
    });
    const reveal = sel => document.querySelectorAll(sel).forEach(el => {
      gsap.from(el, { y:40, opacity:0, duration:.7, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 85%' } });
    });
    reveal('.feat'); reveal('.spstep'); reveal('.svc-gallery__grid .g');
    reveal('.svc-overview > *'); reveal('.svc-cta__inner > *');
  }
}

if(window.GLightbox){ GLightbox({ selector:'.glightbox', loop:true }); }
