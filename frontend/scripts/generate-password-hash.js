// Script para gerar hash de senhas
// Execute com: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('❌ Uso: node scripts/generate-password-hash.js "sua_senha_aqui"');
    console.log('📝 Exemplo: node scripts/generate-password-hash.js "minhasenha123"');
    process.exit(1);
  }

  try {
    // Gerar hash com salt rounds = 10 (padrão seguro)
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Hash gerado com sucesso!');
    console.log('📝 Senha original:', password);
    console.log('🔑 Hash bcrypt:', hash);
    console.log('');
    console.log('📋 SQL para inserir no banco:');
    console.log(`INSERT INTO admins (email, password_hash, name) VALUES ('seu@email.com', '${hash}', 'Seu Nome');`);
    console.log('');
    console.log('📋 SQL para atualizar senha:');
    console.log(`UPDATE admins SET password_hash = '${hash}' WHERE email = 'seu@email.com';`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error);
  }
}

generatePasswordHash();
