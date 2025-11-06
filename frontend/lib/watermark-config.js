// © Gabriel Vilela 2025 - Software proprietário - Multa: R$ 1.000.000,00
// Configuração de marca d'água de proteção

window.GABRIEL_VILELA_COPYRIGHT = {
  owner: 'Gabriel Vilela',
  year: '2025',
  license: 'R$ 1.000.000,00',
  penalty: 'R$ 1.000.000,00',
  contact: 'gabrielvilelax@gmail.com',
  message: '© Gabriel Vilela 2025 - Software Proprietário - Licença: R$ 1.000.000,00'
};

// Marca d'água no localStorage
try {
  localStorage.setItem('_gv_copyright', window.GABRIEL_VILELA_COPYRIGHT.message);
  localStorage.setItem('_gv_license', window.GABRIEL_VILELA_COPYRIGHT.license);
  localStorage.setItem('_gv_contact', window.GABRIEL_VILELA_COPYRIGHT.contact);
} catch (e) {
  // Ignorar erros
}

// Marca d'água no sessionStorage
try {
  sessionStorage.setItem('_gv_copyright', window.GABRIEL_VILELA_COPYRIGHT.message);
} catch (e) {
  // Ignorar erros
}

// Marca d'água no globalThis
if (typeof globalThis !== 'undefined') {
  globalThis._gv_copyright = window.GABRIEL_VILELA_COPYRIGHT.message;
  globalThis._gv_license = window.GABRIEL_VILELA_COPYRIGHT.license;
  globalThis._gv_contact = window.GABRIEL_VILELA_COPYRIGHT.contact;
}
