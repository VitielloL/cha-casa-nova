// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Utilitários de marca d'água de proteção

// Função para aplicar marca d'água
function applyWatermark() {
  // Marca d'água no DOM
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
      rgba(255, 0, 0, 0.005) 100px,
      rgba(255, 0, 0, 0.005) 200px
    );
    font-family: monospace;
    font-size: 4px;
    color: rgba(255, 0, 0, 0.03);
    overflow: hidden;
  `;
  
  const text = '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00';
  watermark.innerHTML = text.repeat(300);
  
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
}

// Executar marca d'água
if (typeof window !== 'undefined') {
  applyWatermark();
}

// Exportar função para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyWatermark };
}
