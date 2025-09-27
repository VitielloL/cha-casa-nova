#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Otimizando desenvolvimento...')

// Configurações de otimização
const optimizations = {
  // Limpar cache do Next.js
  clearCache: () => {
    const nextDir = path.join(process.cwd(), '.next')
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true })
      console.log('✅ Cache do Next.js limpo')
    }
  },

  // Verificar arquivos de configuração
  checkConfig: () => {
    const configFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js'
    ]

    configFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} encontrado`)
      } else {
        console.log(`⚠️  ${file} não encontrado`)
      }
    })
  },

  // Verificar dependências críticas
  checkDependencies: () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      const criticalDeps = [
        'next',
        'react',
        'react-dom',
        '@supabase/supabase-js',
        'tailwindcss'
      ]

      criticalDeps.forEach(dep => {
        if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
          console.log(`✅ ${dep} instalado`)
        } else {
          console.log(`❌ ${dep} não encontrado`)
        }
      })
    }
  },

  // Otimizar variáveis de ambiente
  optimizeEnv: () => {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      console.log('✅ .env.local encontrado')
    } else {
      console.log('⚠️  .env.local não encontrado - execute npm run setup')
    }
  }
}

// Executar otimizações
Object.values(optimizations).forEach(fn => {
  try {
    fn()
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
})

console.log('\n🎯 Otimizações aplicadas!')
console.log('💡 Dicas para melhor performance:')
console.log('   - Use npm run dev:fast para desenvolvimento')
console.log('   - Evite recarregar a página desnecessariamente')
console.log('   - Use o cache do navegador (Ctrl+F5 para limpar)')
console.log('   - Monitore o console para erros de performance')
