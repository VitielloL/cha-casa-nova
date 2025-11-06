// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Hook de proteção contra cópia

import { useEffect } from 'react';

export const useCopyrightProtection = () => {
  useEffect(() => {
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
