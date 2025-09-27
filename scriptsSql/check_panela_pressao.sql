-- Script para verificar especificamente a Panela de Pressão
-- Execute este script no Supabase SQL Editor

-- 1. Verificar Panela de Pressão especificamente
SELECT 
    'PANELA DE PRESSÃO' as produto,
    id,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact,
    is_anonymous,
    received_at,
    cancelled_at,
    created_at
FROM products
WHERE name ILIKE '%panela%' OR name ILIKE '%pressão%';

-- 2. Verificar se há outras panelas
SELECT 
    'TODAS AS PANELAS' as tipo,
    name,
    reserved,
    reservation_status,
    reserved_by
FROM products
WHERE name ILIKE '%panela%';

-- 3. Verificar todos os produtos da categoria Cozinha
SELECT 
    'PRODUTOS DA COZINHA' as categoria,
    name,
    reserved,
    reservation_status,
    reserved_by
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name ILIKE '%cozinha%'
ORDER BY p.name;

-- 4. Forçar atualização da Panela de Pressão
UPDATE products 
SET reservation_status = 'available',
    reserved = false,
    reserved_by = NULL,
    reserved_contact = NULL,
    is_anonymous = false,
    received_at = NULL,
    cancelled_at = NULL
WHERE name ILIKE '%panela%' OR name ILIKE '%pressão%';

-- 5. Verificar resultado da atualização
SELECT 
    'APÓS ATUALIZAÇÃO' as status,
    name,
    reserved,
    reservation_status,
    reserved_by
FROM products
WHERE name ILIKE '%panela%' OR name ILIKE '%pressão%';
