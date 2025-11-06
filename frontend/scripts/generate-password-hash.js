// Script para gerar hash de senhas
// Execute com: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = process.argv[2];
  
  if (!password) {
    process.exit(1);
  }

  try {
    // Gerar hash com salt rounds = 10 (padrão seguro)
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
  }
}

generatePasswordHash();
