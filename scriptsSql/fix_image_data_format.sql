-- Script para corrigir o formato dos dados de imagem
-- Converte image_data de string hexadecimal para bytea (binary)

-- 1. Verificar o estado atual dos dados de imagem
SELECT 
    'ESTADO ATUAL' as status,
    COUNT(*) as total_images,
    COUNT(CASE WHEN image_data::text LIKE '\\x%' THEN 1 END) as hex_format,
    COUNT(CASE WHEN image_data::text NOT LIKE '\\x%' THEN 1 END) as other_format
FROM images;

-- 2. Verificar alguns exemplos de dados atuais
SELECT 
    id,
    filename,
    mime_type,
    size_bytes,
    LEFT(image_data::text, 50) as image_data_preview,
    LENGTH(image_data::text) as data_length
FROM images 
WHERE image_data IS NOT NULL
LIMIT 5;

-- 3. Converter image_data de hex string para bytea
-- ATENÇÃO: Faça backup antes de executar esta operação!
UPDATE images 
SET image_data = decode(
    substring(image_data::text from 3), -- Remove o prefixo \x
    'hex'
)
WHERE image_data::text LIKE '\\x%';

-- 4. Verificar se a conversão foi bem-sucedida
SELECT 
    'APÓS CONVERSÃO' as status,
    COUNT(*) as total_images,
    COUNT(CASE WHEN image_data IS NOT NULL THEN 1 END) as has_data,
    COUNT(CASE WHEN LENGTH(image_data::text) > 100 THEN 1 END) as has_substantial_data
FROM images;

-- 5. Verificar alguns exemplos após a conversão
SELECT 
    id,
    filename,
    mime_type,
    size_bytes,
    LENGTH(image_data) as binary_length,
    LEFT(encode(image_data, 'hex'), 50) as hex_preview
FROM images 
WHERE image_data IS NOT NULL
LIMIT 5;

-- 6. Verificar se há imagens de reserva afetadas
SELECT 
    'IMAGENS DE RESERVA' as tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN i.image_data IS NOT NULL THEN 1 END) as with_data
FROM products p
LEFT JOIN images i ON p.reservation_image_id = i.id
WHERE p.reservation_image_id IS NOT NULL;

-- 7. Testar uma consulta específica para verificar se os dados estão corretos
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.reservation_image_id,
    i.filename,
    i.mime_type,
    i.size_bytes,
    LENGTH(i.image_data) as binary_data_length,
    CASE 
        WHEN i.image_data IS NULL THEN 'SEM DADOS'
        WHEN LENGTH(i.image_data) = 0 THEN 'DADOS VAZIOS'
        WHEN LENGTH(i.image_data) < 100 THEN 'DADOS MUITO PEQUENOS'
        ELSE 'DADOS OK'
    END as data_status
FROM products p
LEFT JOIN images i ON p.reservation_image_id = i.id
WHERE p.reservation_image_id IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;
