// Script para configurar o arquivo .env.local
// Execute com: node setup-env.js

const fs = require('fs');
const path = require('path');

const envContent = `# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kednlctmkudawyguyekw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZG5sY3Rta3VkYXd5Z3V5ZWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTQ2NDMsImV4cCI6MjA3NDQ5MDY0M30.vFgWkbMU-5p8hXSZEcX4hr5lVbHv5J37nzLDJqoIQUU

# Número do WhatsApp (apenas números, sem + ou espaços)
# Exemplo: 5511999999999
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env.local criado com sucesso!');
  console.log('📝 Suas credenciais do Supabase foram configuradas');
  console.log('🔧 Agora execute: npm run dev');
} catch (error) {
  console.error('❌ Erro ao criar arquivo .env.local:', error.message);
  console.log('📋 Copie manualmente o conteúdo do arquivo configuracao-supabase.txt');
}
