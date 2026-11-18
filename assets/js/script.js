'use strict';

const root = document.documentElement;
root.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Scroll progress bar
const bar = document.querySelector('.progress');
const onScroll = () => {
  const h = root.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? Math.min(scrollY / h, 1) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll, staggered within each parent
document.querySelectorAll('.reveal').forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 80}ms`);
});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

// Active nav link by section
const links = [...document.querySelectorAll('[data-link]')];
const secs = links.map((l) => document.querySelector(l.getAttribute('href')));
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => s && spy.observe(s));
}

// Spotlight follows cursor
document.querySelectorAll('[data-spot]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Hero card tilt (fine pointers only)
const tilt = document.querySelector('[data-tilt]');
if (tilt && !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  tilt.addEventListener('pointermove', (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  tilt.addEventListener('pointerleave', () => (tilt.style.transform = ''));
}

// Project filters
const buttons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.project');
const empty = document.querySelector('.empty');
buttons.forEach((btn) => btn.addEventListener('click', () => {
  buttons.forEach((b) => b.classList.toggle('active', b === btn));
  const v = btn.dataset.filter;
  let shown = 0;
  cards.forEach((c) => {
    const ok = v === 'all' || c.dataset.category.split(', ').includes(v);
    c.classList.toggle('hide', !ok);
    if (ok) shown++;
  });
  empty.hidden = shown > 0;
}));
