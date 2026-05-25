document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupCarousels();
  setupHeaderHideOnFooter();
  setupRevealOnScroll();
});


/* --- HAMB --- */
function setupMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#nav-list');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}


/* --- CARROSSÉIS (Ações e Equipe) --- */
function setupCarousels() {
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');

    if (!track) return;

    // Quanto rolar a cada clique: largura do primeiro card + gap
    const getScrollAmount = () => {
      const firstCard = track.querySelector('.card');
      if (!firstCard) return 300;
      const gap = parseInt(getComputedStyle(track).gap) || 24;
      return firstCard.offsetWidth + gap;
    };

    // Clique em ‹ : rola pra esquerda
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
    }

    // Clique em › : rola pra direita
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
    }

    // Esconde botões nos extremos do scroll
    const updateButtons = () => {
      const atStart = track.scrollLeft <= 5;  // tolerância de 5px
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 5;

      if (prevBtn) prevBtn.classList.toggle('is-hidden', atStart);
      if (nextBtn) nextBtn.classList.toggle('is-hidden', atEnd);
    };

    // Atualiza ao rolar e ao redimensionar a janela
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);

    // Estado inicial: começa no início, então esconde o ‹
    updateButtons();
  });
}


/* --- HEADER ESCONDE QUANDO FOOTER APARECE --- */
function setupHeaderHideOnFooter() {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');

  if (!header || !footer) return;

  // IntersectionObserver: detecta quando o footer entra/sai da tela
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Quando o footer está visível, esconde o header
        header.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    {
      // Considera o footer "visível" quando 5% dele aparece na tela
      threshold: 0.5
    }
  );

  observer.observe(footer);
}


/* --- FADE-IN DOS CARDS NO SCROLL --- */
function setupRevealOnScroll() {
  // Elementos que vão receber o efeito: cards, headers de seção, etc.
  const elementsToReveal = document.querySelectorAll(
    '.card, .section-header, .equipe-intro, .contato-info, .contato-map, .instagram-feed'
  );

  // Adiciona a classe .reveal em todos eles (estado inicial: invisível)
  elementsToReveal.forEach(el => el.classList.add('reveal'));

  // Observa quando cada um entra na tela
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Depois de aparecer, não precisa observar mais
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // Dispara quando 12% do elemento aparece na tela
      threshold: 0.12,
      // Começa um pouco antes do elemento aparecer de fato
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elementsToReveal.forEach(el => observer.observe(el));
}