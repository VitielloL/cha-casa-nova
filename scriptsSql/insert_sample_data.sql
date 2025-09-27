-- Script para inserir dados de exemplo
-- Execute este script no Supabase SQL Editor

-- 1. Limpar dados existentes (opcional)
-- DELETE FROM products;
-- DELETE FROM categories;

-- 2. Inserir categorias de exemplo
INSERT INTO categories (id, name, created_at) VALUES 
    ('cat-001', 'Cozinha', NOW()),
    ('cat-002', 'Casa', NOW()),
    ('cat-003', 'Decoração', NOW())
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    created_at = EXCLUDED.created_at;

-- 3. Inserir produtos de exemplo para Cozinha
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
    ('prod-001', 'cat-001', 'Jogo de Pratos', 'Conjunto completo de pratos para 6 pessoas', false, 'available', false, 'principal', NOW()),
    ('prod-002', 'cat-001', 'Panela de Pressão', 'Panela de pressão elétrica 6L', false, 'available', false, 'principal', NOW()),
    ('prod-003', 'cat-001', 'Jogo de Talheres', 'Talheres de inox para 8 pessoas', false, 'available', false, 'adicional', NOW()),
    ('prod-004', 'cat-001', 'Conjunto de Copos', 'Copos de vidro para 6 pessoas', false, 'available', false, 'adicional', NOW());

-- 4. Inserir produtos de exemplo para Casa
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
    ('prod-005', 'cat-002', 'Jogo de Toalhas', 'Conjunto de toalhas de banho', false, 'available', false, 'principal', NOW()),
    ('prod-006', 'cat-002', 'Roupas de Cama', 'Conjunto de lençol, fronha e edredom', false, 'available', false, 'principal', NOW()),
    ('prod-007', 'cat-002', 'Tapete', 'Tapete para sala de estar', false, 'available', false, 'adicional', NOW());

-- 5. Inserir produtos de exemplo para Decoração
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
    ('prod-008', 'cat-003', 'Quadro Decorativo', 'Quadro para sala de estar', false, 'available', false, 'principal', NOW()),
    ('prod-009', 'cat-003', 'Vaso de Planta', 'Vaso decorativo para plantas', false, 'available', false, 'adicional', NOW()),
    ('prod-010', 'cat-003', 'Luminária', 'Luminária de mesa decorativa', false, 'available', false, 'adicional', NOW());

-- 6. Verificar resultado
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.reservation_status = 'available' THEN 1 END) as disponiveis
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- 7. Ver todos os produtos
SELECT 
    c.name as categoria,
    p.name as produto,
    p.reservation_status,
    p.item_type
FROM categories c
JOIN products p ON c.id = p.category_id
ORDER BY c.name, p.name;
