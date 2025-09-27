-- Script para apagar todas as imagens do banco
-- ATENÇÃO: Este script remove TODAS as imagens permanentemente
-- Execute apenas se tiver certeza que quer limpar tudo

-- 1. Verificar quantas imagens existem antes da limpeza
SELECT 
    'ANTES DA LIMPEZA' as status,
    COUNT(*) as total_images,
    COUNT(CASE WHEN image_data::text LIKE '\\x%' THEN 1 END) as hex_format,
    COUNT(CASE WHEN image_data::text NOT LIKE '\\x%' THEN 1 END) as binary_format
FROM images;

-- 2. Verificar produtos que referenciam imagens
SELECT 
    'PRODUTOS COM IMAGENS' as info,
    COUNT(*) as products_with_images,
    COUNT(CASE WHEN image_id IS NOT NULL THEN 1 END) as with_main_image,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as with_reservation_image
FROM products;

-- 3. Verificar surprise_items que referenciam imagens
SELECT 
    'SURPRISE ITEMS COM IMAGENS' as info,
    COUNT(*) as surprise_items_with_images,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as with_reservation_image
FROM surprise_items;

-- 4. Verificar party_owners que referenciam imagens
SELECT 
    'PARTY OWNERS COM IMAGENS' as info,
    COUNT(*) as party_owners_with_images,
    COUNT(CASE WHEN photo_id IS NOT NULL THEN 1 END) as with_photo
FROM party_owners;

-- 5. LIMPAR TODAS AS REFERÊNCIAS DE IMAGENS
-- Primeiro, remover referências de imagens de produtos
UPDATE products 
SET image_id = NULL, 
    reservation_image_id = NULL;

-- Remover referências de imagens de surprise_items
UPDATE surprise_items 
SET reservation_image_id = NULL;

-- Remover referências de imagens de party_owners
UPDATE party_owners 
SET photo_id = NULL;

-- 6. APAGAR TODAS AS IMAGENS
DELETE FROM images;

-- 7. Verificar se a limpeza foi bem-sucedida
SELECT 
    'APÓS A LIMPEZA' as status,
    COUNT(*) as total_images_remaining
FROM images;

-- 8. Verificar se as referências foram removidas
SELECT 
    'REFERÊNCIAS APÓS LIMPEZA' as info,
    COUNT(CASE WHEN image_id IS NOT NULL THEN 1 END) as products_with_main_image,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as products_with_reservation_image
FROM products;

SELECT 
    'SURPRISE ITEMS APÓS LIMPEZA' as info,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as surprise_items_with_reservation_image
FROM surprise_items;

SELECT 
    'PARTY OWNERS APÓS LIMPEZA' as info,
    COUNT(CASE WHEN photo_id IS NOT NULL THEN 1 END) as party_owners_with_photo
FROM party_owners;

-- 9. Verificar se a tabela images está vazia
SELECT 
    'TABELA IMAGES' as info,
    COUNT(*) as total_records
FROM images;

-- 10. Mensagem de confirmação
SELECT 
    'LIMPEZA CONCLUÍDA' as status,
    'Todas as imagens foram removidas. Agora você pode fazer upload de novas imagens que serão salvas no formato correto.' as message;
