-- Script de TESTE para verificar admin
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'admins';

-- 2. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'admins' 
AND table_schema = 'public';

-- 3. Verificar se há dados na tabela
SELECT COUNT(*) as total_admins FROM admins;

-- 4. Listar todos os admins
SELECT id, email, name, created_at FROM admins;

-- 5. Testar busca por email específico
SELECT id, email, name, password_hash 
FROM admins 
WHERE email = 'admin@chacasanova.com';
