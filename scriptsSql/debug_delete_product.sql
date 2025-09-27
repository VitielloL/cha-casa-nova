-- Script para debugar problemas de exclusão de produtos
-- Execute este script para identificar o que está impedindo a exclusão

-- 1. Verificar se há produtos com status 'received'
SELECT 
    'PRODUTOS RECEBIDOS' as info,
    id,
    name,
    reservation_status,
    reserved,
    received_at,
    created_at
FROM products 
WHERE reservation_status = 'received'
ORDER BY created_at DESC;

-- 2. Verificar relacionamentos que podem estar impedindo a exclusão
SELECT 
    'RELACIONAMENTOS PRODUCT_PURCHASE_METHODS' as info,
    COUNT(*) as total_methods,
    COUNT(CASE WHEN product_id IS NOT NULL THEN 1 END) as com_product_id
FROM product_purchase_methods;

-- 3. Verificar relacionamentos com reservation_images
SELECT 
    'RELACIONAMENTOS RESERVATION_IMAGES' as info,
    COUNT(*) as total_images,
    COUNT(CASE WHEN product_id IS NOT NULL THEN 1 END) as com_product_id
FROM reservation_images;

-- 4. Verificar se há constraints que podem estar bloqueando
SELECT 
    'CONSTRAINTS DA TABELA PRODUCTS' as info,
    constraint_name,
    constraint_type,
    is_deferrable,
    initially_deferred
FROM information_schema.table_constraints 
WHERE table_name = 'products'
AND constraint_type IN ('CHECK', 'FOREIGN KEY', 'UNIQUE', 'PRIMARY KEY');

-- 5. Verificar se há triggers que podem estar interferindo
SELECT 
    'TRIGGERS NA TABELA PRODUCTS' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'products';

-- 6. Verificar se RLS está habilitado e quais políticas existem
SELECT 
    'POLÍTICAS RLS DA TABELA PRODUCTS' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 7. Verificar se há algum problema com tipos de dados
SELECT 
    'VERIFICAÇÃO DE TIPOS DE DADOS' as info,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 8. Testar uma exclusão manual simples (se houver produtos de teste)
-- CUIDADO: Este comando vai tentar deletar um produto de teste
-- Descomente apenas se quiser testar
/*
DELETE FROM products 
WHERE name = 'PRODUTO TESTE DELETE'
RETURNING id, name, reservation_status;
*/

-- 9. Verificar se há algum problema com permissões
SELECT 
    'VERIFICAÇÃO DE PERMISSÕES' as info,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'products'
AND grantee = 'authenticated';

-- 10. Verificar se há algum problema com índices
SELECT 
    'ÍNDICES DA TABELA PRODUCTS' as info,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'products'
ORDER BY indexname;
