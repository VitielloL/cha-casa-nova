-- Script para testar exclusão específica da Panela de Pressão
-- Execute este script para ver exatamente qual erro acontece

-- 1. Primeiro, verificar se a Panela de Pressão existe
SELECT 
    'VERIFICANDO PANELA DE PRESSÃO' as info,
    id,
    name,
    reservation_status,
    reserved,
    received_at,
    created_at
FROM products 
WHERE name = 'Panela de Pressão';

-- 2. Verificar se há métodos de compra relacionados
SELECT 
    'MÉTODOS DE COMPRA DA PANELA' as info,
    id,
    name,
    type,
    product_id
FROM product_purchase_methods 
WHERE product_id = (SELECT id FROM products WHERE name = 'Panela de Pressão');

-- 3. Verificar se há imagens de reserva relacionadas
SELECT 
    'IMAGENS DE RESERVA DA PANELA' as info,
    id,
    filename,
    product_id
FROM reservation_images 
WHERE product_id = (SELECT id FROM products WHERE name = 'Panela de Pressão');

-- 4. Verificar se há outras referências à Panela de Pressão
SELECT 
    'OUTRAS REFERÊNCIAS' as info,
    'reservation_image_id' as campo,
    COUNT(*) as total
FROM products 
WHERE reservation_image_id = (SELECT id FROM products WHERE name = 'Panela de Pressão')

UNION ALL

SELECT 
    'OUTRAS REFERÊNCIAS' as info,
    'image_id' as campo,
    COUNT(*) as total
FROM products 
WHERE image_id = (SELECT id FROM products WHERE name = 'Panela de Pressão');

-- 5. Tentar deletar métodos de compra primeiro (se existirem)
DELETE FROM product_purchase_methods 
WHERE product_id = (SELECT id FROM products WHERE name = 'Panela de Pressão')
RETURNING id, name, 'MÉTODOS DELETADOS' as status;

-- 6. Tentar deletar imagens de reserva (se existirem)
DELETE FROM reservation_images 
WHERE product_id = (SELECT id FROM products WHERE name = 'Panela de Pressão')
RETURNING id, filename, 'IMAGENS DELETADAS' as status;

-- 7. Agora tentar deletar a Panela de Pressão
-- CUIDADO: Este comando vai tentar deletar a Panela de Pressão
DELETE FROM products 
WHERE name = 'Panela de Pressão'
RETURNING id, name, reservation_status, 'PANELA DELETADA' as status;

-- 8. Verificar se ainda existe
SELECT 
    'VERIFICAÇÃO FINAL' as info,
    COUNT(*) as panela_ainda_existe
FROM products 
WHERE name = 'Panela de Pressão';
