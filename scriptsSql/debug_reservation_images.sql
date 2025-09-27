-- Script para debugar imagens de reserva
-- Verifica se as imagens estão sendo salvas e consultadas corretamente

-- 1. Verificar se existem produtos com reservation_image_id
SELECT 
    p.id,
    p.name,
    p.reservation_image_id,
    p.reservation_message,
    p.reservation_status,
    p.reserved_by,
    p.is_anonymous
FROM products p 
WHERE p.reservation_image_id IS NOT NULL
ORDER BY p.created_at DESC;

-- 2. Verificar se as imagens existem na tabela images
SELECT 
    i.id,
    i.filename,
    i.mime_type,
    i.size_bytes,
    i.width,
    i.height,
    i.created_at
FROM images i
WHERE i.id IN (
    SELECT DISTINCT p.reservation_image_id 
    FROM products p 
    WHERE p.reservation_image_id IS NOT NULL
)
ORDER BY i.created_at DESC;

-- 3. Verificar se há imagens órfãs (imagens que não estão sendo usadas)
SELECT 
    i.id,
    i.filename,
    i.created_at
FROM images i
WHERE i.id NOT IN (
    SELECT DISTINCT p.reservation_image_id 
    FROM products p 
    WHERE p.reservation_image_id IS NOT NULL
)
AND i.id NOT IN (
    SELECT DISTINCT p.image_id 
    FROM products p 
    WHERE p.image_id IS NOT NULL
)
ORDER BY i.created_at DESC;

-- 4. Verificar se há produtos com reservation_image_id mas sem imagem correspondente
SELECT 
    p.id,
    p.name,
    p.reservation_image_id,
    p.reservation_status
FROM products p 
WHERE p.reservation_image_id IS NOT NULL
AND p.reservation_image_id NOT IN (
    SELECT id FROM images
);

-- 5. Contar quantas imagens de reserva existem
SELECT 
    COUNT(*) as total_reservation_images,
    COUNT(DISTINCT p.reservation_image_id) as unique_reservation_images
FROM products p 
WHERE p.reservation_image_id IS NOT NULL;

-- 6. Verificar se há problemas com o tipo de dados
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'reservation_image_id';

-- 7. Verificar se há problemas com a tabela images
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'images' 
AND column_name = 'id';
