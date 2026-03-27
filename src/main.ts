// Scroll fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Theme toggle with local persistence.
const themeToggle = document.getElementById('themeToggle');
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line></svg>';

function applyTheme(theme: string | null) {
  const isDark = theme === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
}

const savedTheme = localStorage.getItem('rgz-theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('rgz-theme', nextTheme);
  });
}

// Booking form -> WhatsApp
const bookingForm = document.getElementById('bookingForm') as HTMLFormElement | null;
const bookingSubmit = document.getElementById('bookingSubmit') as HTMLButtonElement | null;
const whatsappNumber = '2349027047069';

function formatPreferredDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsed);
}

function buildBookingMessage(data: {
  firstName: string;
  phoneNumber: string;
  emailAddress: string;
  appointmentType: string;
  preferredDate: string;
  bookingNotes: string;
}): string {
  const notesLine = data.bookingNotes ? data.bookingNotes : 'None';

  return [
    'Hello Rumies Glam Zone ✨',
    '',
    'I would like to book a makeup appointment 💄',
    '',
    `👤 Name: ${data.firstName}`,
    `📞 Phone: ${data.phoneNumber}`,
    `📧 Email: ${data.emailAddress || 'Not provided'}`,
    `💋 Service: ${data.appointmentType}`,
    `📅 Preferred Date: ${formatPreferredDate(data.preferredDate)}`,
    `📝 Notes: ${notesLine}`,
    '',
    'Thank you! 🤍'
  ].join('\n');
}

if (bookingForm && bookingSubmit) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const phoneNumber = String(formData.get('phoneNumber') ?? '').trim();
    const emailAddress = String(formData.get('emailAddress') ?? '').trim();
    const appointmentType = String(formData.get('appointmentType') ?? '').trim();
    const preferredDate = String(formData.get('preferredDate') ?? '').trim();
    const bookingNotes = String(formData.get('bookingNotes') ?? '').trim();

    if (!firstName || !phoneNumber || !appointmentType || !preferredDate) {
      bookingSubmit.textContent = 'Please fill all required fields';
      bookingSubmit.style.background = 'var(--brown-warm)';
      setTimeout(() => {
        bookingSubmit.textContent = 'Send Booking Request ✦';
        bookingSubmit.style.background = '';
      }, 1800);
      return;
    }

    const message = buildBookingMessage({
      firstName,
      phoneNumber,
      emailAddress,
      appointmentType,
      preferredDate,
      bookingNotes
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    bookingSubmit.textContent = 'Opening WhatsApp...';
    bookingSubmit.disabled = true;

    const popup = window.open(whatsappUrl, '_blank', 'noopener');
    if (!popup) {
      window.location.href = whatsappUrl;
    }

    setTimeout(() => {
      bookingSubmit.textContent = 'Send Booking Request ✦';
      bookingSubmit.disabled = false;
    }, 1400);
  });
}
