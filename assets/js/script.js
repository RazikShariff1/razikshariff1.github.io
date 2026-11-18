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

// Contact form: posts to a form service when data-endpoint is set, otherwise opens a pre-filled email
const dialog = document.getElementById('contact-dialog');
const form = document.getElementById('contact-form');
if (dialog && form) {
  const lock = (on) => document.documentElement.classList.toggle('modal-open', on);
  const closeDlg = () => dialog.close();
  document.querySelectorAll('[data-open-contact]').forEach((b) => b.addEventListener('click', () => {
    dialog.showModal(); lock(true);
    dialog.querySelector('input[name="name"]').focus();
  }));
  dialog.querySelector('[data-close]').addEventListener('click', closeDlg);
  dialog.addEventListener('mousedown', (e) => { if (e.target === dialog) closeDlg(); }); // click on backdrop
  dialog.addEventListener('close', () => lock(false));
}
if (form) {
  const status = form.querySelector('.form-status');
  const btn = form.querySelector('button[type="submit"]');
  const say = (msg, cls) => { status.textContent = msg; status.className = 'form-status ' + (cls || ''); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('.field').forEach((f) => {
      const input = f.querySelector('input, textarea');
      const bad = !input.value.trim() || (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value.trim()));
      f.classList.toggle('invalid', bad);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) ok = false;
    });
    if (!ok) return say('Please fill in all fields with a valid email.', 'bad');
    if (form.elements._gotcha.value) return; // bot

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    };
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      const subject = encodeURIComponent('Portfolio message from ' + data.name);
      const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
      location.href = 'mailto:' + form.dataset.email + '?subject=' + subject + '&body=' + body;
      say('Opening your email app with the message ready to send…', 'ok');
      return setTimeout(() => dialog && dialog.open && dialog.close(), 1200);
    }

    btn.disabled = true; say('Sending…');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      say('Thanks! Your message was sent.', 'ok');
      setTimeout(() => dialog && dialog.open && dialog.close(), 1800);
    } catch (err) {
      say('Could not send right now. Please email ' + form.dataset.email + ' instead.', 'bad');
    } finally { btn.disabled = false; }
  });
  form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));
}
