-- Script simples para testar atualizações na tabela products
-- Execute este script para verificar se as atualizações básicas funcionam

-- 1. Verificar produtos existentes
SELECT 
    'PRODUTOS EXISTENTES' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 5;

-- 2. Fazer uma atualização simples (apenas reservation_status)
UPDATE products 
SET reservation_status = 'received'
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING id, name, reservation_status, updated_at;

-- 3. Verificar se a atualização funcionou
SELECT 
    'APÓS ATUALIZAÇÃO SIMPLES' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 5;

-- 4. Fazer uma atualização com mais campos
UPDATE products 
SET 
    reservation_status = 'available',
    reserved = false,
    reserved_by = null,
    reserved_contact = null
WHERE id = (SELECT id FROM products WHERE reservation_status = 'received' LIMIT 1)
RETURNING id, name, reservation_status, reserved, reserved_by, updated_at;

-- 5. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 5;
