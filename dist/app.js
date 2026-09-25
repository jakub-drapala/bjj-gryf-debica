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
if (dayIndex >= 0) {
  const day = document.querySelectorAll('.day')[dayIndex];
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
  links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
}

// Formularz kontaktowy — wysyłka przez EmailJS (to samo konto co Business-website).
// Szablon template_cyeoxc6 ma w EmailJS ustawiony adresat marcinb88@interia.pl.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.form-submit');
  const status = contactForm.querySelector('.form-status');
  const setStatus = (text, state) => {
    status.textContent = text;
    status.dataset.state = state || '';
  };
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    if (typeof emailjs === 'undefined') {
      setStatus('Wysyłka chwilowo nie działa. Zadzwoń: 690 012 036 lub napisz na marcinb88@interia.pl.', 'error');
      return;
    }
    // Reply-To tylko dla adresu e-mail — numer telefonu zostaje w treści maila.
    const contact = contactForm.elements.contact.value.trim();
    contactForm.elements.reply_to.value = contact.includes('@') ? contact : '';
    submitButton.disabled = true;
    setStatus('Wysyłanie…');
    emailjs.sendForm('service_3ae2jx4', 'template_cyeoxc6', contactForm, { publicKey: 'ZOBwl7GMNRPwk_VRu' })
      .then(() => {
        contactForm.reset();
        setStatus('Dziękujemy! Wiadomość trafiła do Marcina.', 'success');
      }, error => {
        console.error('EmailJS error:', error);
        setStatus('Nie udało się wysłać. Spróbuj ponownie albo zadzwoń: 690 012 036.', 'error');
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  });
}
