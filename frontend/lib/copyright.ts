// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Arquivo de proteção contra cópia - Não remover

export const COPYRIGHT = {
  owner: 'Gabriel Vilela',
  year: '2025',
  license: 'R$ 1.000.000,00',
  penalty: 'R$ 1.000.000,00',
  contact: 'gabrielvilelax@gmail.com',
  message: '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00'
};

export const WATERMARK = {
  
  dom: () => {
    if (typeof window !== 'undefined' && document.body) {
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
    }
  },
  
  storage: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('_gv_copyright', COPYRIGHT.message);
        localStorage.setItem('_gv_license', COPYRIGHT.license);
        localStorage.setItem('_gv_contact', COPYRIGHT.contact);
        sessionStorage.setItem('_gv_copyright', COPYRIGHT.message);
      } catch (e) {
        // Ignorar erros
      }
    }
  },
  
  global: () => {
    if (typeof window !== 'undefined') {
      (window as any)._gv_copyright = COPYRIGHT.message;
      (window as any)._gv_license = COPYRIGHT.license;
      (window as any)._gv_contact = COPYRIGHT.contact;
      
      if (typeof globalThis !== 'undefined') {
        (globalThis as any)._gv_copyright = COPYRIGHT.message;
      }
    }
  }
};

// Executar todas as marcas d'água
export const applyWatermark = () => {
  WATERMARK.dom();
  WATERMARK.storage();
  WATERMARK.global();
};

// Auto-executar se estiver no browser
if (typeof window !== 'undefined') {
  applyWatermark();
}
