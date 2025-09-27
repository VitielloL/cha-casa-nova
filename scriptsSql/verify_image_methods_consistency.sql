-- Script para verificar consistência dos métodos de salvar imagens
-- Execute este script para verificar se todos os métodos estão corretos

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

-- 2. Verificar se há imagens com dados em formato incorreto (hex string)
SELECT 
    'IMAGENS COM FORMATO INCORRETO' as info,
    COUNT(*) as total_incorrect_format
FROM images 
WHERE image_data::text LIKE '\\x%';

-- 3. Verificar se há imagens com dados corretos (binary)
SELECT 
    'IMAGENS COM FORMATO CORRETO' as info,
    COUNT(*) as total_correct_format
FROM images 
WHERE image_data IS NOT NULL 
AND image_data::text NOT LIKE '\\x%';

-- 4. Verificar tamanhos dos dados de imagem
SELECT 
    'ANÁLISE DE TAMANHOS' as info,
    MIN(LENGTH(image_data)) as min_size,
    MAX(LENGTH(image_data)) as max_size,
    AVG(LENGTH(image_data))::INTEGER as avg_size,
    COUNT(*) as total_images
FROM images 
WHERE image_data IS NOT NULL;

-- 5. Verificar consistência entre size_bytes e tamanho real
SELECT 
    'VERIFICAÇÃO DE CONSISTÊNCIA' as info,
    COUNT(*) as total_images,
    COUNT(CASE WHEN size_bytes = LENGTH(image_data) THEN 1 END) as consistent_sizes,
    COUNT(CASE WHEN size_bytes != LENGTH(image_data) THEN 1 END) as inconsistent_sizes
FROM images 
WHERE image_data IS NOT NULL;

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

-- 7. Listar exemplos de imagens problemáticas
SELECT 
    'EXEMPLOS DE IMAGENS PROBLEMÁTICAS' as info,
    id,
    filename,
    mime_type,
    size_bytes,
    LENGTH(image_data) as actual_size,
    LEFT(image_data::text, 50) as data_preview
FROM images 
WHERE image_data::text LIKE '\\x%'
LIMIT 5;

-- 8. Listar exemplos de imagens corretas
SELECT 
    'EXEMPLOS DE IMAGENS CORRETAS' as info,
    id,
    filename,
    mime_type,
    size_bytes,
    LENGTH(image_data) as actual_size,
    LEFT(encode(image_data, 'hex'), 50) as hex_preview
FROM images 
WHERE image_data IS NOT NULL 
AND image_data::text NOT LIKE '\\x%'
LIMIT 5;
