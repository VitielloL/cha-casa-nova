-- Script SIMPLES para criar admin
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Habilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Política para permitir SELECT (sem autenticação JWT)
CREATE POLICY "Allow public read access" ON admins
    FOR SELECT USING (true);

-- 4. Política para permitir UPDATE (sem autenticação JWT)
CREATE POLICY "Allow public update access" ON admins
    FOR UPDATE USING (true);

-- 5. Inserir administrador padrão
-- Senha: admin123 (hash bcrypt válido)
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@chacasanova.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador')
ON CONFLICT (email) DO NOTHING;

-- 6. Verificar se foi inserido
SELECT email, name, created_at FROM admins;
