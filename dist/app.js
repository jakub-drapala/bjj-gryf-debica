const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
const filters = [...document.querySelectorAll('[data-filter]')];
const filterNames = { all: 'Wszystkie zajęcia', start: 'Początkujący', kids: 'Dzieci', adults: 'Młodzież i dorośli' };
function selectGroup(group) {
  let count = 0;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === group)));
  document.querySelectorAll('.class-item').forEach(item => {
    item.hidden = group !== 'all' && !item.dataset.category.split(' ').includes(group);
    if (!item.hidden) count++;
  });
  document.querySelectorAll('.day').forEach(day => {
    let empty = day.querySelector('.day-empty');
    if (!empty) {
      empty = document.createElement('p');
      empty.className = 'day-empty';
      empty.textContent = 'Brak zajęć tej grupy';
      day.append(empty);
    }
    empty.hidden = !!day.querySelector('.class-item:not([hidden])');
    day.classList.toggle('filtered-empty', !empty.hidden);
  });
  document.querySelector('.filter-status').textContent = `${filterNames[group]} · ${count} ${count < 5 ? 'treningi' : 'treningów'} w tygodniu`;
}
filters.forEach(button => button.addEventListener('click', () => selectGroup(button.dataset.filter)));
document.querySelectorAll('[data-select-group]').forEach(link => link.addEventListener('click', () => selectGroup(link.dataset.selectGroup)));
// The full content and timetable remain available without JavaScript.
document.documentElement.classList.add('js');

// Highlight the weekday in the club's timezone, independently of the visitor's timezone.
const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Warsaw', weekday: 'short' }).format(new Date());
const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(weekday);
const day = dayIndex >= 0 && document.querySelectorAll('.day')[dayIndex];
if (day) {
  day.classList.add('is-today');
  const label = document.createElement('span');
  label.className = 'today-label';
  label.textContent = 'DZIŚ';
  const shortName = day.querySelector('h3 > span');
  const row = document.createElement('span');
  row.className = 'day-heading-row';
  shortName.replaceWith(row);
  row.append(shortName, label);
}
if ('IntersectionObserver' in window) {
  const links = [...menu.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const id = visible[0].target.id;
    links.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  links.forEach(link => {
    if (link.pathname !== location.pathname || !link.hash) return;
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}

// Load the YouTube player only after a click, so the page stays light; without JS the link opens YouTube.
document.querySelectorAll('[data-youtube]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const frame = document.createElement('div');
  frame.className = 'video-frame';
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.youtube}?autoplay=1&playsinline=1&rel=0&cc_load_policy=0`;
  iframe.title = 'Teledysk „To nasz Gryf” — YouTube';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  frame.append(iframe);
  link.replaceWith(frame);
}));
