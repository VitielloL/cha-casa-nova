-- Script para forçar sincronização do reservation_status
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estado atual
SELECT 
    'ANTES DA SINCRONIZAÇÃO' as etapa,
    reservation_status,
    COUNT(*) as quantidade
FROM products
GROUP BY reservation_status;

-- 2. Sincronizar baseado no campo 'reserved'
UPDATE products 
SET reservation_status = CASE 
    WHEN reserved = true THEN 'reserved'
    WHEN reserved = false THEN 'available'
    ELSE 'available'
END;

-- 3. Limpar dados de reserva para produtos que não estão reservados
UPDATE products 
SET reserved_by = NULL,
    reserved_contact = NULL
WHERE reserved = false;

-- 4. Verificar resultado
SELECT 
    'APÓS SINCRONIZAÇÃO' as etapa,
    reservation_status,
    COUNT(*) as quantidade
FROM products
GROUP BY reservation_status;

-- 5. Mostrar todos os produtos
SELECT 
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact
FROM products
ORDER BY name;

-- 6. Verificar especificamente a Panela de Pressão
SELECT 
    'PANELA DE PRESSÃO' as produto,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact
FROM products
WHERE name ILIKE '%panela%';
