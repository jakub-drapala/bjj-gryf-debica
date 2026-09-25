// Formularz zgłoszeniowy — wysyłka przez EmailJS (to samo konto co Business-website).
// Szablon template_cyeoxc6 ma w EmailJS ustawiony adresat marcinb88@interia.pl.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const submitButton = contactForm.querySelector('.form-submit');
  const status = contactForm.querySelector('.form-status');
  // /formularz?trening=indywidualny wybiera od razu opcję z data-slug="indywidualny".
  const wanted = new URLSearchParams(location.search).get('trening');
  const option = wanted && contactForm.querySelector(`option[data-slug="${CSS.escape(wanted)}"]`);
  if (option) option.selected = true;
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
