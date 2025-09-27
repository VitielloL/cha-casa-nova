# ⚡ Instruções Rápidas - Chá de Casa Nova

## 🚀 Setup em 5 minutos

### 1. Supabase (2 min)
```bash
# 1. Criar projeto no Supabase
# 2. Executar script SQL:
scriptsSql/00_SETUP_INICIAL_COMPLETO.sql
# 3. Copiar URL e anon key
```

### 2. Frontend (2 min)
```bash
cd frontend
npm install
cp env.example .env.local
# Editar .env.local com credenciais do Supabase
npm run dev
```

### 3. Login (1 min)
- URL: `http://localhost:3000/login`
- Email: `admin@chacasanova.com`
- Senha: `admin123`

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Gerar hash de senha
node scripts/generate-password-hash.js "minhasenha123"
```

## 📁 Estrutura Rápida

```
frontend/
├── app/                    # Páginas (Next.js 14)
│   ├── admin/             # Painel administrativo
│   ├── categoria/[id]/    # Página de categoria
│   └── ...
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
└── scriptsSql/           # Scripts SQL para Supabase
```

## 🗄️ Tabelas Principais

- `products` - Produtos da lista
- `categories` - Categorias (cozinha, sala, etc.)
- `admins` - Administradores
- `app_config` - Configurações (WhatsApp, mensagens)
- `images` - Imagens otimizadas
- `party_owners` - Anfitriões da festa
- `surprise_items` - Itens surpresa

## ⚙️ Configurações Importantes

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=https://seuprojeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### Credenciais Padrão
- **Email**: `admin@chacasanova.com`
- **Senha**: `admin123`

## 🐛 Solução Rápida de Problemas

### Erro de Conexão
```bash
# Verificar variáveis de ambiente
cat .env.local

# Testar conexão Supabase
# Ir para SQL Editor e executar:
SELECT * FROM admins;
```

### Erro de Login
```sql
-- Verificar se admin existe
SELECT * FROM admins WHERE email = 'admin@chacasanova.com';

-- Recriar admin se necessário
INSERT INTO admins (email, password_hash, name) 
VALUES ('admin@chacasanova.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');
```

### Erro de Imagens
```sql
-- Verificar tabela de imagens
SELECT COUNT(*) FROM images;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'images';
```

## 📱 URLs Importantes

- **Home**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Admin**: `http://localhost:3000/admin`
- **Configurações**: `http://localhost:3000/admin/configuracoes`
- **Produtos**: `http://localhost:3000/admin/produtos`
- **Imagens**: `http://localhost:3000/admin/imagens`

## 🎯 Funcionalidades Principais

### Para Usuários
- ✅ Ver categorias e produtos
- ✅ Reservar produtos
- ✅ Contato via WhatsApp
- ✅ Reservas anônimas

### Para Admins
- ✅ Gerenciar produtos e categorias
- ✅ Controlar reservas
- ✅ Upload de imagens
- ✅ Configurar WhatsApp
- ✅ Gerenciar anfitriões
- ✅ Configurar métodos de compra

## 🔄 Fluxo de Reserva

1. **Usuário** acessa categoria
2. **Usuário** clica em produto
3. **Sistema** abre modal de reserva
4. **Usuário** preenche dados (ou marca anônimo)
5. **Sistema** salva reserva no banco
6. **Admin** vê reserva no painel
7. **Admin** pode marcar como recebido
8. **Sistema** envia agradecimento via WhatsApp

## 📊 Status de Reserva

- `available` - Disponível
- `reserved` - Reservado
- `received` - Recebido
- `cancelled` - Cancelado

## 🛒 Tipos de Item

- `principal` - Item principal da lista
- `adicional` - Item adicional/surpresa

## 📞 Suporte Rápido

1. **Console do navegador** (F12)
2. **Terminal** (logs do npm run dev)
3. **Supabase SQL Editor** (testar queries)
4. **Documentação completa** (SETUP_INICIAL.md)

---

**⚡ Sistema pronto para uso em minutos!**