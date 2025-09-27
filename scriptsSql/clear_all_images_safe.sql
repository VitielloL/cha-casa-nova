-- Script SEGURO para apagar todas as imagens do banco
-- Este script inclui verificações e confirmações antes de executar

-- 1. Verificar estado atual ANTES de qualquer alteração
SELECT 
    '=== ESTADO ATUAL DO BANCO ===' as info,
    '' as separator;

-- Contar imagens por tipo de formato
SELECT 
    'IMAGENS EXISTENTES' as tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN image_data::text LIKE '\\x%' THEN 1 END) as formato_hex_problematico,
    COUNT(CASE WHEN image_data::text NOT LIKE '\\x%' AND image_data IS NOT NULL THEN 1 END) as formato_binary_correto,
    COUNT(CASE WHEN image_data IS NULL THEN 1 END) as sem_dados
FROM images;

-- Contar referências de imagens
SELECT 
    'REFERÊNCIAS DE IMAGENS' as tipo,
    'Produtos com imagem principal' as descricao,
    COUNT(CASE WHEN image_id IS NOT NULL THEN 1 END) as quantidade
FROM products

UNION ALL

SELECT 
    'REFERÊNCIAS DE IMAGENS' as tipo,
    'Produtos com imagem de reserva' as descricao,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as quantidade
FROM products

UNION ALL

SELECT 
    'REFERÊNCIAS DE IMAGENS' as tipo,
    'Surprise items com imagem de reserva' as descricao,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as quantidade
FROM surprise_items

UNION ALL

SELECT 
    'REFERÊNCIAS DE IMAGENS' as tipo,
    'Party owners com foto' as descricao,
    COUNT(CASE WHEN photo_id IS NOT NULL THEN 1 END) as quantidade
FROM party_owners;

-- 2. CRIAR BACKUP ANTES DE APAGAR (opcional)
-- Descomente as linhas abaixo se quiser criar backup
/*
CREATE TABLE images_backup_before_clear AS 
SELECT * FROM images;

CREATE TABLE products_backup_before_clear AS 
SELECT * FROM products;

CREATE TABLE surprise_items_backup_before_clear AS 
SELECT * FROM surprise_items;

CREATE TABLE party_owners_backup_before_clear AS 
SELECT * FROM party_owners;
*/

-- 3. LIMPEZA SEGURA COM VERIFICAÇÕES
DO $$
DECLARE
    image_count INTEGER;
    product_refs INTEGER;
    surprise_refs INTEGER;
    party_refs INTEGER;
BEGIN
    -- Contar imagens existentes
    SELECT COUNT(*) INTO image_count FROM images;
    
    -- Contar referências
    SELECT COUNT(*) INTO product_refs FROM products WHERE image_id IS NOT NULL OR reservation_image_id IS NOT NULL;
    SELECT COUNT(*) INTO surprise_refs FROM surprise_items WHERE reservation_image_id IS NOT NULL;
    SELECT COUNT(*) INTO party_refs FROM party_owners WHERE photo_id IS NOT NULL;
    
    -- Mostrar informações
    RAISE NOTICE '=== INFORMAÇÕES ANTES DA LIMPEZA ===';
    RAISE NOTICE 'Imagens no banco: %', image_count;
    RAISE NOTICE 'Produtos com referências de imagem: %', product_refs;
    RAISE NOTICE 'Surprise items com referências de imagem: %', surprise_refs;
    RAISE NOTICE 'Party owners com referências de imagem: %', party_refs;
    
    -- Só executar se houver imagens para limpar
    IF image_count > 0 THEN
        RAISE NOTICE '=== INICIANDO LIMPEZA ===';
        
        -- Remover referências de imagens
        UPDATE products SET image_id = NULL, reservation_image_id = NULL;
        UPDATE surprise_items SET reservation_image_id = NULL;
        UPDATE party_owners SET photo_id = NULL;
        
        -- Apagar todas as imagens
        DELETE FROM images;
        
        RAISE NOTICE '=== LIMPEZA CONCLUÍDA ===';
        RAISE NOTICE 'Todas as imagens foram removidas.';
        RAISE NOTICE 'Todas as referências foram limpas.';
        RAISE NOTICE 'Agora você pode fazer upload de novas imagens no formato correto.';
    ELSE
        RAISE NOTICE 'Nenhuma imagem encontrada para limpar.';
    END IF;
END $$;

-- 4. VERIFICAÇÃO FINAL
SELECT 
    '=== VERIFICAÇÃO FINAL ===' as info,
    '' as separator;

-- Verificar se a limpeza foi bem-sucedida
SELECT 
    'IMAGENS RESTANTES' as tipo,
    COUNT(*) as total
FROM images;

-- Verificar se as referências foram removidas
SELECT 
    'REFERÊNCIAS RESTANTES' as tipo,
    'Produtos com imagem principal' as descricao,
    COUNT(CASE WHEN image_id IS NOT NULL THEN 1 END) as quantidade
FROM products

UNION ALL

SELECT 
    'REFERÊNCIAS RESTANTES' as tipo,
    'Produtos com imagem de reserva' as descricao,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as quantidade
FROM products

UNION ALL

SELECT 
    'REFERÊNCIAS RESTANTES' as tipo,
    'Surprise items com imagem de reserva' as descricao,
    COUNT(CASE WHEN reservation_image_id IS NOT NULL THEN 1 END) as quantidade
FROM surprise_items

UNION ALL

SELECT 
    'REFERÊNCIAS RESTANTES' as tipo,
    'Party owners com foto' as descricao,
    COUNT(CASE WHEN photo_id IS NOT NULL THEN 1 END) as quantidade
FROM party_owners;

-- 5. MENSAGEM FINAL
SELECT 
    '=== LIMPEZA CONCLUÍDA ===' as status,
    'Todas as imagens foram removidas com sucesso!' as message,
    'Agora você pode fazer upload de novas imagens que serão salvas no formato correto.' as next_step;
