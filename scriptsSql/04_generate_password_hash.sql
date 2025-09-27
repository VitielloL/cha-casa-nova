-- Script para gerar hash de senhas
-- Execute este script no Supabase SQL Editor

-- Função para gerar hash de senha (usando extensão pgcrypto)
-- Primeiro, habilite a extensão se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Exemplo de como gerar hash para uma senha
-- Substitua 'minhasenha123' pela senha desejada
SELECT crypt('minhasenha123', gen_salt('bf', 10)) as password_hash;

-- Para inserir um novo admin com senha hash
-- Substitua os valores pelos seus dados
INSERT INTO admins (email, password_hash, name) 
VALUES (
    'meuemail@exemplo.com', 
    crypt('minhasenha123', gen_salt('bf', 10)), 
    'Meu Nome'
);

-- Para atualizar senha de um admin existente
-- Substitua o email e a nova senha
UPDATE admins 
SET password_hash = crypt('novasenha123', gen_salt('bf', 10))
WHERE email = 'admin@chacasanova.com';
