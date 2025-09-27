-- Script de DEBUG para verificar status de reservas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela products
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar todos os produtos e seus status
SELECT 
    id,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact,
    received_at,
    cancelled_at,
    created_at
FROM products
ORDER BY name;

-- 3. Contar produtos por status
SELECT 
    reservation_status,
    COUNT(*) as quantidade
FROM products
GROUP BY reservation_status
ORDER BY quantidade DESC;

-- 4. Verificar especificamente a Panela de Pressão
SELECT 
    id,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact,
    received_at,
    cancelled_at
FROM products
WHERE name ILIKE '%panela%' OR name ILIKE '%pressão%';

-- 5. Verificar se há inconsistências entre 'reserved' e 'reservation_status'
SELECT 
    name,
    reserved,
    reservation_status,
    CASE 
        WHEN reserved = true AND reservation_status = 'available' THEN 'INCONSISTENTE: reserved=true mas status=available'
        WHEN reserved = false AND reservation_status = 'reserved' THEN 'INCONSISTENTE: reserved=false mas status=reserved'
        ELSE 'OK'
    END as status_check
FROM products
WHERE (reserved = true AND reservation_status = 'available') 
   OR (reserved = false AND reservation_status = 'reserved');

-- 6. Verificar se a coluna reservation_status existe e tem valores válidos
SELECT 
    CASE 
        WHEN reservation_status IS NULL THEN 'NULL'
        WHEN reservation_status NOT IN ('available', 'reserved', 'received', 'cancelled') THEN 'INVÁLIDO: ' || reservation_status
        ELSE 'VÁLIDO: ' || reservation_status
    END as status_validation,
    COUNT(*) as quantidade
FROM products
GROUP BY 
    CASE 
        WHEN reservation_status IS NULL THEN 'NULL'
        WHEN reservation_status NOT IN ('available', 'reserved', 'received', 'cancelled') THEN 'INVÁLIDO: ' || reservation_status
        ELSE 'VÁLIDO: ' || reservation_status
    END;

-- 7. Mostrar produtos que estão como 'reserved' mas deveriam estar 'available'
SELECT 
    id,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact
FROM products
WHERE reservation_status = 'reserved' 
  AND (reserved_by IS NULL OR reserved_contact IS NULL);

-- 8. Verificar timestamps de atualização
SELECT 
    name,
    reservation_status,
    received_at,
    cancelled_at,
    CASE 
        WHEN received_at IS NOT NULL THEN 'Recebido em: ' || received_at::text
        WHEN cancelled_at IS NOT NULL THEN 'Cancelado em: ' || cancelled_at::text
        ELSE 'Sem timestamp'
    END as timestamp_info
FROM products
WHERE reservation_status IN ('received', 'cancelled')
ORDER BY name;
