'use strict';

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Tab-style pages with hash routing (#home, #experience, #projects, #contact)
const links = [...document.querySelectorAll('[data-link]')];
const pages = [...document.querySelectorAll('[data-page]')];
const names = pages.map((p) => p.dataset.page);

const show = (hash, scroll = true) => {
  let name = hash.replace('#', '') || 'home';
  if (!names.includes(name)) name = 'home';
  pages.forEach((p) => p.classList.toggle('active', p.dataset.page === name));
  links.forEach((l) => {
    const on = l.getAttribute('href') === '#' + name;
    l.classList.toggle('active', on);
    if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
  });
  if (scroll) window.scrollTo(0, 0);
};

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const h = a.getAttribute('href');
  if (location.hash !== h) history.pushState(null, '', h);
  show(h);
});
addEventListener('popstate', () => show(location.hash));
show(location.hash, false);

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
