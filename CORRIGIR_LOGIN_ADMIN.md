# 🔧 Corrigir Login Admin - Erro PGRST116

## 🚨 Problema
```
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "Cannot coerce the result to a single JSON object"
}
```

## ✅ Solução Rápida

### Passo 1: Executar Script no Supabase
1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o script: `scriptsSql/fix_admin_complete.sql`

### Passo 2: Verificar se Funcionou
1. Execute o script: `scriptsSql/test_admin.sql`
2. Deve retornar:
   - ✅ Tabela `admins` existe
   - ✅ 1 admin cadastrado
   - ✅ Email: `admin@chacasanova.com`

### Passo 3: Testar Login
1. Acesse: `http://localhost:3000/login`
2. **Email:** `admin@chacasanova.com`
3. **Senha:** `admin123`
4. Clique em "Entrar"

## 🔍 O que Causou o Erro

### Problema Original:
- ❌ Tabela `admins` não existia
- ❌ Uso de `.single()` sem dados
- ❌ RLS (Row Level Security) bloqueando acesso

### Solução Aplicada:
- ✅ **Tabela recriada** do zero
- ✅ **RLS configurado** para permitir acesso
- ✅ **Admin inserido** com hash válido
- ✅ **Código corrigido** para usar `.limit(1)`

## 🛠️ Scripts Utilizados

### `fix_admin_complete.sql`
- Remove tabela existente
- Cria nova tabela `admins`
- Configura RLS permissivo
- Insere admin padrão
- Testa funcionamento

### `test_admin.sql`
- Verifica se tabela existe
- Conta registros
- Lista admins
- Testa busca por email

## 🎯 Resultado Esperado

### Após executar os scripts:
- ✅ **Login funciona** sem erros
- ✅ **Admin logado** com sucesso
- ✅ **Botão "Cadastrar Produto"** aparece
- ✅ **Painel admin** acessível

## 🚨 Se Ainda Não Funcionar

### Verificações:
1. **Console do navegador** (F12) - verificar erros
2. **Supabase Dashboard** - verificar se tabela existe
3. **Credenciais** - verificar `.env.local`
4. **Servidor** - reiniciar com `npm run dev`

### Logs para Verificar:
```javascript
// No console do navegador
console.log('Admin data:', adminData)
console.log('Error:', error)
```

## 📞 Suporte
Se o problema persistir, verifique:
- ✅ Scripts executados na ordem
- ✅ Credenciais do Supabase corretas
- ✅ Servidor Next.js rodando
- ✅ Console sem erros

**🎉 Após a correção, o login deve funcionar perfeitamente!**
