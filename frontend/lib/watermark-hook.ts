// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Hook de proteção contra cópia

import { useEffect } from 'react';

export const useCopyrightProtection = () => {
  useEffect(() => {
    // Marca d'água no console
    console.log('%c© 2025 Gabriel Vilela - Software Proprietário', 'color: #ff0000; font-size: 16px; font-weight: bold;');
    console.log('%cLicença: R$ 1.000.000,00', 'color: #ff0000; font-size: 14px; font-weight: bold;');
    console.log('%cMulta por cópia: R$ 1.000.000,00', 'color: #ff0000; font-size: 12px;');
    console.log('%cContato: gabrielvilelax@gmail.com', 'color: #ff0000; font-size: 12px;');
    
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
};
