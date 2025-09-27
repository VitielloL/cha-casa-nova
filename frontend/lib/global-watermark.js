// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Marca d'água global de proteção contra cópia

(function() {
  'use strict';
  
  // Marca d'água no console
  console.log('%c© 2025 Gabriel Vilela - Software Proprietário', 'color: #ff0000; font-size: 16px; font-weight: bold;');
  console.log('%cLicença: R$ 1.000.000,00', 'color: #ff0000; font-size: 14px; font-weight: bold;');
  console.log('%cMulta por cópia: R$ 1.000.000,00', 'color: #ff0000; font-size: 12px;');
  console.log('%cContato: gabrielvilelax@gmail.com', 'color: #ff0000; font-size: 12px;');
  
  // Marca d'água no DOM (invisível)
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 100px,
      rgba(255, 0, 0, 0.01) 100px,
      rgba(255, 0, 0, 0.01) 200px
    );
    font-family: monospace;
    font-size: 6px;
    color: rgba(255, 0, 0, 0.05);
    overflow: hidden;
  `;
  
  const text = '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00';
  watermark.innerHTML = text.repeat(200);
  
  document.body.appendChild(watermark);
  
  // Marca d'água no localStorage
  try {
    localStorage.setItem('_gv_copyright', '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00');
    localStorage.setItem('_gv_license', 'R$ 1.000.000,00');
    localStorage.setItem('_gv_contact', 'gabrielvilelax@gmail.com');
  } catch (e) {
    // Ignorar erros
  }
  
  // Marca d'água no sessionStorage
  try {
    sessionStorage.setItem('_gv_copyright', '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00');
  } catch (e) {
    // Ignorar erros
  }
  
  // Marca d'água no window object
  window._gv_copyright = '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00';
  window._gv_license = 'R$ 1.000.000,00';
  window._gv_contact = 'gabrielvilelax@gmail.com';
  
  // Marca d'água no globalThis
  if (typeof globalThis !== 'undefined') {
    globalThis._gv_copyright = '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00';
  }
  
  // Marca d'água no título da página
  const originalTitle = document.title;
  document.title = `© Gabriel Vilela 2025 - ${originalTitle}`;
  
  // Marca d'água no meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `© Gabriel Vilela 2025 - ${metaDescription.getAttribute('content')}`);
  }
  
})();
