-- Script COMPLETO para corrigir problema de admin
-- Execute este script no Supabase SQL Editor

-- 1. Remover tabela se existir (cuidado!)
DROP TABLE IF EXISTS admins CASCADE;

-- 2. Criar tabela de administradores
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Habilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 4. Política para permitir acesso público (temporário para teste)
CREATE POLICY "Allow all access" ON admins
    FOR ALL USING (true);

-- 5. Inserir administrador padrão
-- Senha: admin123
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@chacasanova.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador');

-- 6. Verificar se foi inserido
SELECT 'Admin criado com sucesso!' as status;
SELECT email, name, created_at FROM admins;

-- 7. Testar busca
SELECT 'Teste de busca:' as teste;
SELECT id, email, name 
FROM admins 
WHERE email = 'admin@chacasanova.com';
