#!/usr/bin/env node

// Script para otimizar o desenvolvimento
const { execSync } = require('child_process')

console.log('🚀 Otimizando ambiente de desenvolvimento...')

try {
  // Limpar cache do Next.js
  console.log('🧹 Limpando cache do Next.js...')
  execSync('rm -rf .next', { stdio: 'inherit' })
  
  // Limpar cache do npm
  console.log('🧹 Limpando cache do npm...')
  execSync('npm cache clean --force', { stdio: 'inherit' })
  
  // Reinstalar dependências
  console.log('📦 Reinstalando dependências...')
  execSync('npm install', { stdio: 'inherit' })
  
  console.log('✅ Otimização concluída!')
  console.log('💡 Dica: Use "npm run dev" para iniciar o servidor otimizado')
  
} catch (error) {
  console.error('❌ Erro durante a otimização:', error.message)
  process.exit(1)
}
