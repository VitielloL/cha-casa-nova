-- Script para testar imagens de reserva
-- Verifica se existem produtos com imagens de reserva e se as imagens existem

-- 1. Verificar produtos com reservation_image_id
SELECT 
    'PRODUTOS COM IMAGEM DE RESERVA' as tipo,
    COUNT(*) as total
FROM products 
WHERE reservation_image_id IS NOT NULL

UNION ALL

-- 2. Verificar se as imagens existem na tabela images
SELECT 
    'IMAGENS EXISTENTES' as tipo,
    COUNT(*) as total
FROM images 
WHERE id IN (
    SELECT DISTINCT reservation_image_id 
    FROM products 
    WHERE reservation_image_id IS NOT NULL
)

UNION ALL

-- 3. Verificar imagens órfãs (imagens que não estão sendo usadas)
SELECT 
    'IMAGENS ORFÃS' as tipo,
    COUNT(*) as total
FROM images 
WHERE id NOT IN (
    SELECT DISTINCT reservation_image_id 
    FROM products 
    WHERE reservation_image_id IS NOT NULL
)
AND id NOT IN (
    SELECT DISTINCT image_id 
    FROM products 
    WHERE image_id IS NOT NULL
);

-- 4. Listar produtos com imagens de reserva (detalhado)
SELECT 
    p.id,
    p.name,
    p.reservation_image_id,
    p.reservation_status,
    p.reserved_by,
    p.is_anonymous,
    p.reservation_message,
    i.filename,
    i.mime_type,
    i.size_bytes,
    i.width,
    i.height,
    i.created_at as image_created_at
FROM products p
LEFT JOIN images i ON p.reservation_image_id = i.id
WHERE p.reservation_image_id IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;

-- 5. Verificar se há problemas de referência
SELECT 
    'PRODUTOS COM IMAGE_ID INEXISTENTE' as problema,
    COUNT(*) as total
FROM products p
WHERE p.reservation_image_id IS NOT NULL
AND p.reservation_image_id NOT IN (SELECT id FROM images);

-- 6. Verificar tipos de dados das colunas
SELECT 
    'TIPO DE DADOS - PRODUCTS' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'reservation_image_id'

UNION ALL

SELECT 
    'TIPO DE DADOS - IMAGES' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'images' 
AND column_name = 'id';
