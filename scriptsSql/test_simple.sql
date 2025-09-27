-- Script SIMPLES para testar e corrigir
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura atual
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('reserved', 'reservation_status', 'reserved_by', 'reserved_contact')
ORDER BY column_name;

-- 2. Ver todos os produtos
SELECT 
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact
FROM products
ORDER BY name;

-- 3. Adicionar coluna se não existir
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS reservation_status TEXT DEFAULT 'available';

-- 4. Atualizar baseado no campo 'reserved'
UPDATE products 
SET reservation_status = CASE 
    WHEN reserved = true THEN 'reserved'
    ELSE 'available'
END;

-- 5. Corrigir Panela de Pressão especificamente
UPDATE products 
SET reservation_status = 'available',
    reserved = false,
    reserved_by = NULL,
    reserved_contact = NULL
WHERE name ILIKE '%panela%';

-- 6. Verificar resultado
SELECT 
    name,
    reserved,
    reservation_status,
    reserved_by
FROM products
ORDER BY name;
