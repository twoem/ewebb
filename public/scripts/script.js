// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Splash screen: random 3-6 seconds
  const splash = document.getElementById('splash-screen');
  const mainContent = document.getElementById('main-content');
  const delay = Math.random() * 3000 + 3000; // 3000–6000 ms
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.remove('hidden');
  }, delay);

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Get Service buttons (WhatsApp)
  document.querySelectorAll('.get-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text') || 'Hello, I need your service';
      // Replace with your WhatsApp number
      const phone = '254700644973'; // Use actual number
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  });
});
