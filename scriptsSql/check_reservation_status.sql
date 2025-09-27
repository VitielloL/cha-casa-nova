-- Script para verificar o campo reservation_status
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a coluna reservation_status existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
AND column_name = 'reservation_status';

-- 2. Verificar dados atuais dos produtos
SELECT id, name, reservation_status, reserved_by, reserved_contact
FROM products
ORDER BY name;

-- 3. Verificar se há produtos com status 'available'
SELECT COUNT(*) as total_available
FROM products
WHERE reservation_status = 'available';

-- 4. Verificar se há produtos com status 'reserved'
SELECT COUNT(*) as total_reserved
FROM products
WHERE reservation_status = 'reserved';

-- 5. Atualizar manualmente um produto para testar
UPDATE products 
SET reservation_status = 'available',
    reserved_by = NULL,
    reserved_contact = NULL
WHERE name = 'Panela de Pressão';

-- 6. Verificar se a atualização funcionou
SELECT id, name, reservation_status, reserved_by, reserved_contact
FROM products
WHERE name = 'Panela de Pressão';
