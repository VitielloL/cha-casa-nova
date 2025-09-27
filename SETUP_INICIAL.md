# 🚀 Guia de Configuração Inicial - Chá de Casa Nova

Este guia te ajudará a configurar o sistema completo do Chá de Casa Nova em poucos passos.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js 18+ instalado
- Git instalado

## 🗄️ Passo 1: Configurar o Banco de Dados (Supabase)

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: `chacasanova` (ou seu nome preferido)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

### 1.2 Executar Script SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `scriptsSql/00_SETUP_INICIAL_COMPLETO.sql`
4. Clique em **Run** para executar o script
5. Aguarde a execução (deve mostrar "Script concluído com sucesso!")

### 1.3 Obter Credenciais

1. Vá para **Settings** → **API**
2. Anote as seguintes informações:
   - **Project URL**: `https://seuprojeto.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 💻 Passo 2: Configurar o Frontend

### 2.1 Clonar e Instalar

```bash
# Clonar o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/chacasanova.git
cd chacasanova/frontend

# Instalar dependências
npm install
```

### 2.2 Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas credenciais:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://seuprojeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # WhatsApp (opcional - pode ser configurado depois)
   NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
   ```

### 2.3 Executar o Projeto

```bash
npm run dev
```

3. Acesse `http://localhost:3000`

## 🔐 Passo 3: Primeiro Acesso

### 3.1 Fazer Login

1. Acesse `http://localhost:3000/login`
2. Use as credenciais padrão:
   - **Email**: `admin@chacasanova.com`
   - **Senha**: `admin123`

### 3.2 Configurar WhatsApp

1. Após o login, vá para **Configurações**
2. Configure os números do WhatsApp:
   - **Número Principal**: Seu número para contato geral
   - **Número do Admin**: Seu número para dúvidas
3. Personalize a mensagem de agradecimento
4. Clique em **Salvar Configurações**

## 🎨 Passo 4: Personalizar o Sistema

### 4.1 Adicionar Anfitriões

1. Vá para **Admin** → **Anfitriões**
2. Adicione informações dos noivos/anfitriões:
   - Nome
   - Biografia
   - Relacionamento (ex: "Noivos", "Aniversariantes")
   - Foto (opcional)

### 4.2 Configurar Endereço de Entrega

1. Vá para **Admin** → **Endereço de Entrega**
2. Adicione:
   - Título (ex: "Casa dos Noivos")
   - Endereço completo
   - Instruções de entrega
   - Contato

### 4.3 Adicionar Produtos

1. Vá para **Admin** → **Produtos**
2. Clique em **Adicionar Produto**
3. Preencha:
   - Nome do produto
   - Categoria
   - Descrição
   - Foto (opcional)
   - Métodos de compra (opcional)

### 4.4 Configurar Métodos de Compra

1. Vá para **Admin** → **Métodos de Compra**
2. Adicione lojas parceiras:
   - Nome da loja
   - Link
   - Descrição
   - Ícone e cor
   - Comissão (se aplicável)

## ✅ Verificação Final

### Checklist de Configuração

- [ ] Banco de dados configurado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Login funcionando com credenciais padrão
- [ ] Números do WhatsApp configurados
- [ ] Anfitriões adicionados
- [ ] Endereço de entrega configurado
- [ ] Pelo menos uma categoria criada
- [ ] Pelo menos um produto adicionado

### Teste de Funcionamento

1. **Teste de Reserva**:
   - Acesse a página inicial
   - Clique em uma categoria
   - Tente reservar um produto
   - Verifique se a reserva aparece no admin

2. **Teste de WhatsApp**:
   - Clique no botão de dúvidas de um produto
   - Verifique se abre o WhatsApp com a mensagem correta

3. **Teste de Agradecimento**:
   - No admin, marque um produto como "Recebido"
   - Clique em "Enviar Agradecimento"
   - Verifique se abre o WhatsApp com a mensagem personalizada

## 🚨 Solução de Problemas

### Erro de Conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Teste a conexão no SQL Editor do Supabase

### Erro de Login

- Verifique se o script SQL foi executado completamente
- Confirme se o admin foi inserido na tabela `admins`
- Teste com as credenciais padrão: `admin@chacasanova.com` / `admin123`

### Erro de Imagens

- Verifique se a tabela `images` foi criada
- Confirme se as políticas RLS estão ativas
- Teste o upload de uma imagem simples

### Erro de WhatsApp

- Verifique se os números estão no formato correto (apenas números)
- Confirme se as configurações foram salvas
- Teste com um número válido

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador
2. Confira os logs do terminal onde está rodando o `npm run dev`
3. Teste a conexão com o Supabase no SQL Editor
4. Verifique se todas as tabelas foram criadas corretamente

## 🎉 Próximos Passos

Após a configuração inicial:

1. **Personalize o visual**: Edite cores e estilos no `tailwind.config.js`
2. **Adicione mais produtos**: Use o painel admin para gerenciar a lista
3. **Configure notificações**: Personalize mensagens e alertas
4. **Teste com usuários**: Peça para amigos testarem as reservas
5. **Deploy**: Publique em produção usando Vercel + Supabase

---

**🎊 Parabéns! Seu sistema de Chá de Casa Nova está pronto para uso!**
