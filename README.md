# Chá de Casa Nova 🏠

Uma aplicação completa para gerenciar listas de presentes de chá de casa nova, com frontend em Next.js e backend em Supabase.

## 🚀 Funcionalidades

### 🏠 **Sistema Principal**
- **Mobile First**: Design otimizado para celulares
- **Categorias de Produtos**: Organize produtos por categorias (cozinha, sala, quarto, etc.)
- **Sistema de Reservas**: Qualquer pessoa pode reservar produtos sem login
- **Reservas Anônimas**: Opção de reservar sem informar dados pessoais
- **Status de Reserva**: Controle completo (disponível, reservado, recebido, cancelado)

### 📱 **Integração WhatsApp**
- **Botão de Dúvidas**: Contato direto via WhatsApp
- **Mensagens de Agradecimento**: Envio automático com nome do produto
- **Configuração Flexível**: Números diferentes para admin e contato geral

### 👥 **Sistema de Anfitriões**
- **Perfil dos Anfitriões**: Fotos, biografias e relacionamento
- **Endereço de Entrega**: Informações completas para entrega
- **Múltiplos Anfitriões**: Suporte para casais e grupos

### 🛒 **Sistema de Compra**
- **Métodos em Destaque**: Links para lojas parceiras
- **Métodos por Produto**: Informações específicas de compra para cada item
- **Links Afiliados**: Suporte a comissões e cashback
- **Múltiplos Formatos**: Links, endereços, fotos, textos, telefones

### 🎁 **Itens Surpresa**
- **Sistema de Itens Adicionais**: Produtos não listados
- **Reservas Anônimas**: Suporte completo para itens surpresa
- **Controle de Visibilidade**: Mostrar/ocultar itens

### 🔧 **Painel Administrativo**
- **Gestão Completa**: Produtos, categorias, lojas, imagens
- **Controle de Reservas**: Visualização e atualização de status
- **Sistema de Imagens**: Upload otimizado e gerenciamento
- **Configurações**: WhatsApp, mensagens, anfitriões
- **Dados Protegidos**: Informações sensíveis com blur

### 📊 **Relatórios e Estatísticas**
- **Progresso de Reservas**: Barras de progresso por categoria
- **Estatísticas Gerais**: Contadores e métricas
- **Relatórios de Uso**: Análise de imagens e espaço

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Estilização**: TailwindCSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel (frontend) + Supabase (backend)

## 📁 Estrutura do Projeto

```
├── frontend/                 # Aplicação Next.js
│   ├── app/                 # App Router (Next.js 14)
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   └── ...
├── scriptsSql/              # Scripts SQL para Supabase
│   ├── 01_create_tables.sql
│   └── 02_enable_rls.sql
└── README.md
```

## 🚀 Como Executar

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL completo:
   - `scriptsSql/00_SETUP_INICIAL_COMPLETO.sql` ⭐ **RECOMENDADO**
   
   **OU** execute os scripts individuais na ordem:
   - `scriptsSql/01_create_tables.sql`
   - `scriptsSql/02_enable_rls.sql`
   - `scriptsSql/03_create_admin_table.sql`
   - `scriptsSql/05_create_images_table.sql`
   - `scriptsSql/07_add_thank_you_config.sql`
   - `scriptsSql/08_add_anonymous_reservation.sql`
   - `scriptsSql/09_add_party_owners_and_delivery.sql`
   - `scriptsSql/10_add_product_purchase_method.sql`
   - `scriptsSql/11_add_multiple_purchase_methods.sql`
   - `scriptsSql/12_add_surprise_items.sql`

3. Anote a URL e a chave anônima do seu projeto

### 2. Configurar Frontend

1. Navegue para a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas credenciais:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
   ```

4. Execute o projeto:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`

## 📱 Páginas da Aplicação

- **Home** (`/`): Lista de categorias
- **Categoria** (`/categoria/[id]`): Produtos de uma categoria
- **Lojas** (`/lojas`): Lista de lojas parceiras
- **Cadastro** (`/cadastro`): Formulário para adicionar produtos/lojas
- **Login** (`/login`): Acesso para administradores
- **Admin** (`/admin`): Painel administrativo com reservas (protegido)
- **Admin Imagens** (`/admin/imagens`): Gerenciamento de imagens (protegido)

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **categories**: Categorias de produtos
- **products**: Produtos com informações de reserva
- **stores**: Lojas parceiras
- **admins**: Administradores do sistema
- **images**: Imagens otimizadas salvas como bytes

### Tabelas de Configuração

- **app_config**: Configurações gerais (WhatsApp, mensagens)
- **party_owners**: Informações dos anfitriões da festa
- **delivery_address**: Endereços de entrega
- **featured_purchase_methods**: Métodos de compra em destaque
- **product_purchase_methods**: Métodos de compra por produto
- **surprise_items**: Itens surpresa adicionais

### Relacionamentos

- `products.category_id` → `categories.id`
- `products.image_id` → `images.id`
- `product_purchase_methods.product_id` → `products.id`
- `party_owners.photo_id` → `images.id`
- Row Level Security (RLS) habilitado para segurança

### Campos Especiais

- **reservation_status**: `available`, `reserved`, `received`, `cancelled`
- **item_type**: `principal`, `adicional`
- **is_anonymous**: Reservas anônimas
- **is_visible**: Controle de visibilidade
- **is_active**: Status ativo/inativo

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Backend (Supabase)

- Já está configurado quando você executa os scripts SQL
- RLS habilitado para segurança
- APIs automáticas geradas pelo Supabase

## 🔧 Configurações Importantes

### Número do WhatsApp

Configure seu número no arquivo `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

**Formato**: Apenas números, sem + ou espaços
**Exemplo**: `5511999999999` (Brasil + DDD + número)

### Configuração de Administrador

#### Credenciais Padrão
- **Email**: `admin@chacasanova.com`
- **Senha**: `admin123`

#### Gerando Hash de Senha

**Opção 1: Usando o Supabase (Recomendado)**
Execute no Supabase SQL Editor:

```sql
-- Habilitar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Gerar hash para sua senha (substitua 'minhasenha123')
SELECT crypt('minhasenha123', gen_salt('bf', 10)) as password_hash;
```

**Opção 2: Usando Node.js**
```bash
cd frontend
node scripts/generate-password-hash.js "minhasenha123"
```

#### Alterando Credenciais
```sql
-- 1. Primeiro gere o hash da nova senha
SELECT crypt('novasenha123', gen_salt('bf', 10)) as password_hash;

-- 2. Use o hash gerado para atualizar
UPDATE admins 
SET email = 'seu-email@exemplo.com', 
    password_hash = 'HASH_GERADO_AQUI'
WHERE email = 'admin@chacasanova.com';
```

#### Adicionando Novos Administradores
```sql
-- 1. Gere o hash da senha
SELECT crypt('senha123', gen_salt('bf', 10)) as password_hash;

-- 2. Insira o novo admin com o hash
INSERT INTO admins (email, password_hash, name) 
VALUES ('novo@admin.com', 'HASH_GERADO_AQUI', 'Nome do Admin');
```

⚠️ **Importante**: 
- Use senhas seguras (mínimo 8 caracteres, com números e símbolos)
- Nunca use senhas simples como "123456" ou "admin"
- O hash gerado é único para cada senha

### Sistema de Imagens

**Upload Otimizado:**
- Imagens são salvas diretamente no banco de dados como bytes
- Otimização automática: máximo 800x600px, qualidade 80%
- Tamanho máximo: 200KB por imagem
- Formatos suportados: JPG, PNG, WebP

**Gerenciamento:**
- Upload via interface drag-and-drop
- Preview em tempo real
- Gerenciamento completo no painel admin (`/admin/imagens`)
- Estatísticas de uso de espaço
- Exclusão de imagens não utilizadas

**Vantagens:**
- ✅ Sem dependência de serviços externos
- ✅ Imagens sempre disponíveis
- ✅ Controle total sobre os dados
- ✅ Otimização automática
- ✅ Backup automático com o banco

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm run start

# Linting
npm run lint
```

## 🎨 Personalização

### Cores e Tema

Edite `frontend/tailwind.config.js` para personalizar cores e estilos.

### Componentes

Todos os componentes estão em `frontend/components/ui/` usando shadcn/ui.

### Mobile First

O design é otimizado para mobile. Para ajustar para desktop, edite as classes TailwindCSS.

## 🔒 Segurança

- Row Level Security (RLS) habilitado no Supabase
- Dados de reserva protegidos no painel admin
- Validação de formulários no frontend
- Sanitização de inputs

## 📚 Documentação Adicional

- **[INSTRUCOES_RAPIDAS.md](./INSTRUCOES_RAPIDAS.md)**: ⚡ Setup em 5 minutos
- **[SETUP_INICIAL.md](./SETUP_INICIAL.md)**: Guia completo de configuração inicial
- **[CHECKLIST_PRIMEIRA_EXECUCAO.md](./CHECKLIST_PRIMEIRA_EXECUCAO.md)**: Checklist rápido para primeira execução
- **[scriptsSql/00_SETUP_INICIAL_COMPLETO.sql](./scriptsSql/00_SETUP_INICIAL_COMPLETO.sql)**: Script SQL completo para primeira execução

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação de setup](./SETUP_INICIAL.md)
2. Use o [checklist de primeira execução](./CHECKLIST_PRIMEIRA_EXECUCAO.md)
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Confirme se os scripts SQL foram executados corretamente
5. Verifique os logs do console para erros
6. Teste a conexão com o Supabase

## 🎯 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar notificações por email
- [ ] Adicionar relatórios de reservas
- [ ] Integração com pagamentos
- [ ] App mobile nativo

---

## ⚖️ Licença

Este software é **PROPRIETÁRIO** e **PROTEGIDO** por direitos autorais.

- ❌ **PROIBIDO** copiar, modificar ou distribuir
- ❌ **PROIBIDO** uso comercial sem autorização
- ✅ **PERMITIDO** apenas uso pessoal e educacional
- 💰 **Licenciamento comercial:** R$ 1.000.000,00 + 30% royalties

**Leia:** [LICENSE](./LICENSE) | [TERMOS_DE_USO.md](./TERMOS_DE_USO.md)

---

**Desenvolvido com ❤️ por Gabriel Vilela - Todos os direitos reservados**
