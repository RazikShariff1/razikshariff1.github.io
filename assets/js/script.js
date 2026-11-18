'use strict';

// Based on the vCard portfolio template (MIT); trimmed to the parts this site uses.
const toggle = (el) => el.classList.toggle("active");

// Sidebar contacts toggle on small screens
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", () => {
  toggle(sidebar);
  sidebarBtn.querySelector("span").textContent = sidebar.classList.contains("active") ? "Hide Contacts" : "Show Contacts";
});

// Project filters
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = (value) => {
  filterItems.forEach((item) => {
    const cats = item.dataset.category.split(", ");
    item.classList.toggle("active", value === "all" || cats.includes(value));
  });
};

select.addEventListener("click", function () { toggle(this); });
selectItems.forEach((item) => item.addEventListener("click", function () {
  const v = this.innerText.toLowerCase();
  selectValue.innerText = this.innerText;
  toggle(select);
  filterFunc(v);
}));

let lastBtn = filterBtns[0];
filterBtns.forEach((btn) => btn.addEventListener("click", function () {
  selectValue.innerText = this.innerText;
  filterFunc(this.innerText.toLowerCase());
  lastBtn.classList.remove("active");
  this.classList.add("active");
  lastBtn = this;
}));

// Page navigation, with #about / #resume / #portfolio links
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const showPage = (name, scroll) => {
  let found = false;
  pages.forEach((p, i) => {
    const on = p.dataset.page === name;
    p.classList.toggle("active", on);
    navLinks[i].classList.toggle("active", on);
    if (on) found = true;
  });
  if (!found) showPage("about", false);
  if (scroll) window.scrollTo(0, 0);
};
navLinks.forEach((link) => link.addEventListener("click", function () {
  const name = this.textContent.trim().toLowerCase();
  if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
  showPage(name, true);
}));
window.addEventListener("hashchange", () => showPage(location.hash.slice(1), true));
if (location.hash) showPage(location.hash.slice(1), false);
