-- Script para debugar categorias vazias
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se existem categorias
SELECT 
    'CATEGORIAS' as tipo,
    id,
    name,
    created_at
FROM categories
ORDER BY name;

-- 2. Verificar se existem produtos
SELECT 
    'PRODUTOS' as tipo,
    id,
    name,
    category_id,
    reserved,
    reservation_status,
    created_at
FROM products
ORDER BY name;

-- 3. Verificar produtos por categoria
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.reservation_status = 'available' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN p.reservation_status = 'reserved' THEN 1 END) as reservados
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- 4. Se não houver dados, inserir dados de exemplo
INSERT INTO categories (id, name, created_at) VALUES 
    (gen_random_uuid(), 'Cozinha', NOW()),
    (gen_random_uuid(), 'Casa', NOW()),
    (gen_random_uuid(), 'Decoração', NOW())
ON CONFLICT (name) DO NOTHING;

-- 5. Inserir produtos de exemplo para a categoria Cozinha
WITH cozinha_id AS (
    SELECT id FROM categories WHERE name = 'Cozinha' LIMIT 1
)
INSERT INTO products (
    id,
    category_id,
    name,
    description,
    reserved,
    reservation_status,
    is_anonymous,
    item_type,
    created_at
) VALUES 
    (gen_random_uuid(), (SELECT id FROM cozinha_id), 'Jogo de Pratos', 'Conjunto completo de pratos para 6 pessoas', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), (SELECT id FROM cozinha_id), 'Panela de Pressão', 'Panela de pressão elétrica 6L', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), (SELECT id FROM cozinha_id), 'Jogo de Talheres', 'Talheres de inox para 8 pessoas', false, 'available', false, 'adicional', NOW())
ON CONFLICT DO NOTHING;

-- 6. Verificar resultado final
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.reservation_status = 'available' THEN 1 END) as disponiveis
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;
