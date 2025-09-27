-- Script para criar tabela de administradores
-- Execute este script após os scripts anteriores

-- Tabela de administradores
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Inserir administrador padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@chacasanova.com', '$2b$10$rQZ8K9vL8mN7pQrS6tUvOeKjHlMnBvCxZyAsDfGhIjKlMnOpQrStUvW', 'Administrador');

-- Habilitar RLS na tabela de admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política para permitir que admins vejam seus próprios dados
CREATE POLICY "Admins can view own data" ON admins
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para permitir que admins atualizem seus próprios dados
CREATE POLICY "Admins can update own data" ON admins
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');
