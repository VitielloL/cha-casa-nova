-- Script para verificar produtos por categoria
-- Execute este script no Supabase SQL Editor

-- 1. Verificar produtos por categoria
SELECT 
    c.name as categoria,
    c.id as categoria_id,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.reservation_status = 'available' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN p.reservation_status = 'reserved' THEN 1 END) as reservados
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- 2. Ver todos os produtos com suas categorias
SELECT 
    c.name as categoria,
    p.name as produto,
    p.reservation_status,
    p.item_type,
    p.created_at
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
ORDER BY c.name, p.name;

-- 3. Verificar se a tabela products existe e tem dados
SELECT 
    'PRODUTOS_TOTAL' as tipo,
    COUNT(*) as total
FROM products;

-- 4. Se não houver produtos, inserir alguns de exemplo
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
    -- Produtos para Cozinha
    (gen_random_uuid(), '87115941-8013-45a3-a0b3-eb776b421103', 'Jogo de Pratos', 'Conjunto completo de pratos para 6 pessoas', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), '87115941-8013-45a3-a0b3-eb776b421103', 'Panela de Pressão', 'Panela de pressão elétrica 6L', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), '87115941-8013-45a3-a0b3-eb776b421103', 'Jogo de Talheres', 'Talheres de inox para 8 pessoas', false, 'available', false, 'adicional', NOW()),
    
    -- Produtos para Sala
    (gen_random_uuid(), '5e27b2f4-429b-4b96-8b91-613b53731093', 'Quadro Decorativo', 'Quadro para sala de estar', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), '5e27b2f4-429b-4b96-8b91-613b53731093', 'Luminária', 'Luminária de mesa decorativa', false, 'available', false, 'adicional', NOW()),
    
    -- Produtos para Quarto
    (gen_random_uuid(), 'ecfff25a-fe59-41ce-b462-f1eee5ffcfd1', 'Jogo de Toalhas', 'Conjunto de toalhas de banho', false, 'available', false, 'principal', NOW()),
    (gen_random_uuid(), 'ecfff25a-fe59-41ce-b462-f1eee5ffcfd1', 'Roupas de Cama', 'Conjunto de lençol, fronha e edredom', false, 'available', false, 'principal', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Verificar resultado final
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.reservation_status = 'available' THEN 1 END) as disponiveis
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;
