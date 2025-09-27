-- Script de diagnóstico para entender o estado atual dos dados de imagem
-- Execute este script ANTES de fazer qualquer correção

-- 1. Verificar estrutura da tabela images
SELECT 
    'ESTRUTURA DA TABELA IMAGES' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'images' 
ORDER BY ordinal_position;

-- 2. Contar total de imagens e status dos dados
SELECT 
    'CONTAGEM GERAL' as info,
    COUNT(*) as total_images,
    COUNT(CASE WHEN image_data IS NULL THEN 1 END) as null_data,
    COUNT(CASE WHEN image_data IS NOT NULL THEN 1 END) as has_data,
    COUNT(CASE WHEN LENGTH(image_data) = 0 THEN 1 END) as empty_data,
    COUNT(CASE WHEN LENGTH(image_data) > 0 THEN 1 END) as non_empty_data
FROM images;

-- 3. Analisar formato dos dados de imagem
SELECT 
    'ANÁLISE DE FORMATO' as info,
    CASE 
        WHEN image_data::text LIKE '\\x%' THEN 'HEX STRING (PROBLEMA)'
        WHEN image_data IS NULL THEN 'NULL'
        WHEN LENGTH(image_data) = 0 THEN 'VAZIO'
        ELSE 'BINARY (OK)'
    END as data_format,
    COUNT(*) as quantidade
FROM images 
WHERE image_data IS NOT NULL
GROUP BY 
    CASE 
        WHEN image_data::text LIKE '\\x%' THEN 'HEX STRING (PROBLEMA)'
        WHEN image_data IS NULL THEN 'NULL'
        WHEN LENGTH(image_data) = 0 THEN 'VAZIO'
        ELSE 'BINARY (OK)'
    END;

-- 4. Verificar exemplos de dados problemáticos (hex string)
SELECT 
    'EXEMPLOS DE DADOS HEX (PROBLEMÁTICOS)' as info,
    id,
    filename,
    mime_type,
    size_bytes,
    LEFT(image_data::text, 100) as data_preview,
    LENGTH(image_data::text) as text_length
FROM images 
WHERE image_data::text LIKE '\\x%'
LIMIT 5;

-- 5. Verificar exemplos de dados corretos (binary)
SELECT 
    'EXEMPLOS DE DADOS BINARY (CORRETOS)' as info,
    id,
    filename,
    mime_type,
    size_bytes,
    LENGTH(image_data) as binary_length,
    LEFT(encode(image_data, 'hex'), 100) as hex_preview
FROM images 
WHERE image_data IS NOT NULL 
AND image_data::text NOT LIKE '\\x%'
LIMIT 5;

-- 6. Verificar imagens de reserva especificamente
SELECT 
    'IMAGENS DE RESERVA' as info,
    COUNT(*) as total_reservation_images,
    COUNT(CASE WHEN i.image_data IS NULL THEN 1 END) as null_data,
    COUNT(CASE WHEN i.image_data::text LIKE '\\x%' THEN 1 END) as hex_format,
    COUNT(CASE WHEN i.image_data::text NOT LIKE '\\x%' AND i.image_data IS NOT NULL THEN 1 END) as binary_format
FROM products p
LEFT JOIN images i ON p.reservation_image_id = i.id
WHERE p.reservation_image_id IS NOT NULL;

-- 7. Listar produtos com imagens de reserva problemáticas
SELECT 
    'PRODUTOS COM IMAGENS PROBLEMÁTICAS' as info,
    p.id as product_id,
    p.name as product_name,
    p.reservation_image_id,
    i.filename,
    i.mime_type,
    CASE 
        WHEN i.image_data IS NULL THEN 'SEM DADOS'
        WHEN i.image_data::text LIKE '\\x%' THEN 'HEX STRING (PROBLEMA)'
        WHEN LENGTH(i.image_data) = 0 THEN 'DADOS VAZIOS'
        ELSE 'BINARY (OK)'
    END as data_status
FROM products p
LEFT JOIN images i ON p.reservation_image_id = i.id
WHERE p.reservation_image_id IS NOT NULL
AND (i.image_data IS NULL OR i.image_data::text LIKE '\\x%' OR LENGTH(i.image_data) = 0)
ORDER BY p.created_at DESC;

-- 8. Verificar se há inconsistências entre size_bytes e tamanho real dos dados
SELECT 
    'VERIFICAÇÃO DE CONSISTÊNCIA' as info,
    id,
    filename,
    size_bytes as declared_size,
    LENGTH(image_data) as actual_binary_size,
    LENGTH(image_data::text) as actual_text_size,
    CASE 
        WHEN size_bytes = LENGTH(image_data) THEN 'CONSISTENTE'
        WHEN size_bytes = LENGTH(image_data::text) THEN 'TAMANHO COMO TEXTO'
        ELSE 'INCONSISTENTE'
    END as consistency_status
FROM images 
WHERE image_data IS NOT NULL
AND (size_bytes != LENGTH(image_data) OR size_bytes != LENGTH(image_data::text))
LIMIT 10;
