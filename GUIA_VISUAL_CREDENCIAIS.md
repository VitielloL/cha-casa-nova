# 📸 Guia Visual - Onde Buscar as Credenciais

## 🎯 Objetivo
Este guia mostra exatamente onde encontrar as credenciais do Supabase para configurar a aplicação.

---

## 🗄️ Passo 1: Acessar o Supabase

1. **Faça login** no [supabase.com](https://supabase.com)
2. **Selecione seu projeto** `cha-casa-nova`
3. Você verá o painel principal do Supabase

---

## ⚙️ Passo 2: Ir para Settings

1. **Clique no ícone ⚙️** no canto inferior esquerdo
2. **Clique em "API"** no menu lateral
3. Você verá a página de configurações da API

---

## 🔑 Passo 3: Copiar as Credenciais

### 📍 Onde encontrar:

**Na seção "Project API keys", você verá:**

```
Project URL
https://abc123def456.supabase.co

API Keys
anon public    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk4NzY4MDAwLCJleHAiOjIwMTQzNDQwMDB9.exemplo123456789
service_role   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2OTg3NjgwMDAsImV4cCI6MjAxNDM0NDAwMH0.outroexemplo987654321
```

### ✅ O que copiar:

1. **Project URL**: `https://abc123def456.supabase.co`
2. **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9nIiwiaWF0IjoxNjk4NzY4MDAwLCJleHAiOjIwMTQzNDQwMDB9.exemplo123456789`

**⚠️ Importante:** 
- Copie APENAS a chave `anon public`
- NÃO copie a `service_role` (é para uso interno)

---

## 📝 Passo 4: Colar no arquivo .env.local

### 📁 Abra o arquivo:
```
frontend/.env.local
```

### 📋 Cole as credenciais:
```env
# Cole aqui a Project URL
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co

# Cole aqui a anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9nIiwiaWF0IjoxNjk4NzY4MDAwLCJleHAiOjIwMTQzNDQwMDB9.exemplo123456789

# Seu número do WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

---

## ✅ Verificação

### Antes de salvar, confira:
- [ ] Project URL começa com `https://` e termina com `.supabase.co`
- [ ] anon key começa com `eyJ` e é bem longa
- [ ] Número do WhatsApp tem apenas números (ex: `5511999999999`)
- [ ] Não há espaços extras ou quebras de linha

### Após salvar:
- [ ] Arquivo `.env.local` está na pasta `frontend`
- [ ] Reinicie o servidor: `npm run dev`
- [ ] Teste acessando `http://localhost:3000`

---

## 🚨 Problemas Comuns

### ❌ "Invalid API key"
- Verifique se copiou a chave `anon public` (não a `service_role`)
- Confirme que não há espaços extras na chave
- Verifique se o arquivo está salvo como `.env.local`

### ❌ "Failed to fetch"
- Verifique se a Project URL está correta
- Confirme se o projeto Supabase está ativo
- Teste a conexão com internet

### ❌ Página em branco
- Abra o Console do navegador (F12)
- Verifique se há erros relacionados ao Supabase
- Confirme se as variáveis estão no formato correto

---

## 📞 Ainda com dúvidas?

1. **Verifique o Console** do navegador (F12) para erros
2. **Confirme as credenciais** no painel do Supabase
3. **Teste a conexão** acessando a Project URL no navegador
4. **Reinicie o servidor** após mudanças no `.env.local`

**🎯 Lembre-se:** As credenciais são únicas para cada projeto Supabase!
