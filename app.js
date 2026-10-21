const certificates = [
  { id: 'video-editing', title: 'Video Editing Tips & Tricks', image: 'certificate/dict-webinar/video-editing.png' },
  { id: 'programming', title: 'Programming Fundamentals', image: 'certificate/dict-webinar/programming-fundamentals.png' },
  { id: 'agentic-ai', title: 'Agentic AI', image: 'certificate/dict-webinar/agentic-ai.png' },
  { id: 'iot', title: 'Integrating IoT in Capstone Project', image: 'certificate/dict-webinar/iot-capstone.png' },
  { id: 'digital-awareness', title: 'Digital Awareness', image: 'certificate/cisco/digital-awareness.png', pdf: 'certificate/cisco/digital-awareness.pdf' },
  { id: 'modern-ai', title: 'Introduction to Modern AI', image: 'certificate/cisco/introduction-to-modern-ai.png', pdf: 'certificate/cisco/introduction-to-modern-ai.pdf' },
  { id: 'resilience', title: 'National Disaster Resilience Month', image: 'certificate/dict-webinar/national-disaster-resilience.png', pdf: 'certificate/dict-webinar/national-disaster-resilience.pdf' },
  { id: 'tesda-installing', title: 'Installing and Configuring Computer Systems', image: 'certificate/tesda/installing-configuring-computer-systems.png', pdf: 'certificate/tesda/installing-configuring-computer-systems.pdf' },
  { id: 'tesda-css', title: 'Introduction to Computer Systems Servicing', image: 'certificate/tesda/introduction-computer-systems-servicing.png', pdf: 'certificate/tesda/introduction-computer-systems-servicing.pdf' },
  { id: 'tesda-networks', title: 'Setting Up Computer Networks', image: 'certificate/tesda/setting-up-computer-networks.png', pdf: 'certificate/tesda/setting-up-computer-networks.pdf' },
  { id: 'tesda-servers', title: 'Setting Up Computer Servers', image: 'certificate/tesda/setting-up-computer-servers.png', pdf: 'certificate/tesda/setting-up-computer-servers.pdf' },
  { id: 'tesda-maintaining', title: 'Maintaining Computer Systems and Networks', image: 'certificate/tesda/maintaining-computer-systems-networks.png', pdf: 'certificate/tesda/maintaining-computer-systems-networks.pdf' },
  { id: 'foundational-csharp', title: 'Foundational C# with Microsoft', image: 'certificate/freecodecamp/foundational-c-sharp-with-microsoft.png' }
];

const gallery = document.querySelector('.gallery');
const cards = [...document.querySelectorAll('.certificate-card')];
const filters = [...document.querySelectorAll('.filter')];
const dialog = document.querySelector('.viewer');
const viewerImage = document.querySelector('.viewer-image');
const viewerTitle = document.querySelector('.viewer-title');
const viewerCount = document.querySelector('.viewer-count');
const downloadLink = document.querySelector('.download-link');
const pdfLink = document.querySelector('.pdf-link');
let activeIndex = 0;

function showCertificate(index) {
  activeIndex = (index + certificates.length) % certificates.length;
  const certificate = certificates[activeIndex];
  viewerImage.src = certificate.image;
  viewerImage.alt = `${certificate.title} certificate for Genesis B. Garnadozo`;
  viewerTitle.textContent = certificate.title;
  viewerCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(certificates.length).padStart(2, '0')}`;
  downloadLink.href = certificate.image;
  downloadLink.download = certificate.image.split('/').pop();
  pdfLink.hidden = !certificate.pdf;
  if (certificate.pdf) pdfLink.href = certificate.pdf;
}

function openViewer(id) {
  const index = certificates.findIndex((item) => item.id === id);
  if (index < 0) return;
  showCertificate(index);
  dialog.showModal();
  document.body.classList.add('viewer-open');
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => openViewer(button.dataset.open));
});
cards.forEach((card) => card.querySelector('.card-image').addEventListener('click', () => openViewer(card.dataset.id)));
document.querySelector('.close-viewer').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('viewer-open'));
document.querySelector('.prev').addEventListener('click', () => showCertificate(activeIndex - 1));
document.querySelector('.next').addEventListener('click', () => showCertificate(activeIndex + 1));
document.addEventListener('keydown', (event) => {
  if (!dialog.open) return;
  if (event.key === 'ArrowLeft') showCertificate(activeIndex - 1);
  if (event.key === 'ArrowRight') showCertificate(activeIndex + 1);
});

filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((filter) => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  const category = button.dataset.filter;
  cards.forEach((card) => {
    const visible = category === 'all' || card.dataset.category.split(' ').includes(category);
    card.classList.toggle('hidden', !visible);
    if (visible) card.classList.add('in-view');
  });
}));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('in-view'));
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  mainNav.classList.toggle('open', !expanded);
});
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mainNav.classList.remove('open');
}));

const navLinks = [...mainNav.querySelectorAll('a')];
const navTargets = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.hash === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5] });
  navTargets.forEach((target) => navObserver.observe(target));
}

// Mark the featured card's motion as paused while the viewer is open.
dialog.addEventListener('close', () => {
  const featured = document.querySelector('.hero-art');
  if (featured) featured.blur();
});
