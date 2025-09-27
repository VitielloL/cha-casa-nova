# 🔐 Como Gerar Hash de Senha - Exemplo Prático

## 🎯 Cenário: Alterar senha do admin padrão

### Passo 1: Acesse o Supabase SQL Editor
1. Vá para o seu projeto no Supabase
2. Clique em "SQL Editor" no menu lateral

### Passo 2: Execute o comando para gerar hash
```sql
-- Habilitar extensão (execute apenas uma vez)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Gerar hash para sua nova senha
-- Substitua 'MinhaSenh@123' pela senha que você quer
SELECT crypt('MinhaSenh@123', gen_salt('bf', 10)) as password_hash;
```

### Passo 3: Copie o hash gerado
O resultado será algo como:
```
password_hash
$2b$10$rQZ8K9vL8mN7pQrS6tUvOeKjHlMnBvCxZyAsDfGhIjKlMnOpQrStUvW
```

### Passo 4: Atualize a senha no banco
```sql
-- Use o hash que você copiou no passo anterior
UPDATE admins 
SET password_hash = '$2b$10$rQZ8K9vL8mN7pQrS6tUvOeKjHlMnBvCxZyAsDfGhIjKlMnOpQrStUvW'
WHERE email = 'admin@chacasanova.com';
```

### Passo 5: Teste o login
1. Acesse `/login` na sua aplicação
2. Use o email: `admin@chacasanova.com`
3. Use a nova senha: `MinhaSenh@123`

## 🔧 Exemplo Completo

**Senha desejada:** `Admin2024!`

**Comando SQL:**
```sql
SELECT crypt('Admin2024!', gen_salt('bf', 10)) as password_hash;
```

**Resultado esperado:**
```
$2b$10$abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890
```

**Update no banco:**
```sql
UPDATE admins 
SET password_hash = '$2b$10$abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890'
WHERE email = 'admin@chacasanova.com';
```

## ⚠️ Dicas Importantes

1. **Sempre use senhas seguras:**
   - Mínimo 8 caracteres
   - Inclua números, letras maiúsculas, minúsculas e símbolos
   - Exemplo: `MinhaSenh@123`

2. **O hash é único:**
   - Cada senha gera um hash diferente
   - Mesmo hash não pode ser "revertido" para a senha original
   - Isso garante segurança

3. **Teste sempre:**
   - Após alterar, teste o login
   - Se não funcionar, gere um novo hash

## 🚀 Alternativa: Script Node.js

Se preferir usar o script Node.js:

```bash
cd frontend
node scripts/generate-password-hash.js "MinhaSenh@123"
```

O script vai gerar o hash e mostrar o SQL pronto para usar!
