// Scroll fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in-view');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Booking form feedback
function handleBooking(btn) {
  btn.textContent = 'Request Sent ✓';
  btn.style.background = 'var(--brown-warm)';
  setTimeout(() => {
    btn.textContent = 'Send Booking Request ✦';
    btn.style.background = '';
  }, 3000);
}
