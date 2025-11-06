// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Componente de proteção contra cópia

import { useEffect } from 'react';

export const CopyrightProtection = () => {
  useEffect(() => {
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
    
    // Marca d'água no window object
    (window as any)._gv_copyright = '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00';
    (window as any)._gv_license = 'R$ 1.000.000,00';
    (window as any)._gv_contact = 'gabrielvilelax@gmail.com';
    
  }, []);
  
  return null; // Componente invisível
};

export default CopyrightProtection;
