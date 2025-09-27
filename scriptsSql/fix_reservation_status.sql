-- Script para corrigir o campo reservation_status
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna reservation_status se não existir
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS reservation_status TEXT DEFAULT 'available' 
CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled'));

-- 2. Atualizar produtos existentes baseado no campo 'reserved'
UPDATE products 
SET reservation_status = CASE 
    WHEN reserved = true THEN 'reserved'
    ELSE 'available'
END
WHERE reservation_status IS NULL;

-- 3. Adicionar colunas de timestamp se não existirem
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- 4. Verificar se a atualização funcionou
SELECT id, name, reserved, reservation_status, reserved_by, reserved_contact
FROM products
ORDER BY name;

-- 5. Atualizar especificamente a Panela de Pressão para available
UPDATE products 
SET reservation_status = 'available',
    reserved_by = NULL,
    reserved_contact = NULL,
    reserved = false
WHERE name = 'Panela de Pressão';

-- 6. Verificar resultado final
SELECT id, name, reserved, reservation_status, reserved_by, reserved_contact
FROM products
WHERE name = 'Panela de Pressão';
