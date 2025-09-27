-- Script para verificar configuração do Supabase e possíveis problemas
-- Execute este script para diagnosticar problemas de conexão

-- 1. Verificar se a tabela products está acessível
SELECT 
    'ACESSO À TABELA PRODUCTS' as info,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN reservation_status = 'available' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN reservation_status = 'reserved' THEN 1 END) as reservados,
    COUNT(CASE WHEN reservation_status = 'received' THEN 1 END) as recebidos,
    COUNT(CASE WHEN reservation_status = 'cancelled' THEN 1 END) as cancelados
FROM products;

-- 2. Verificar se há algum problema com constraints
SELECT 
    'VERIFICAÇÃO DE CONSTRAINTS' as info,
    constraint_name,
    constraint_type,
    is_deferrable,
    initially_deferred
FROM information_schema.table_constraints 
WHERE table_name = 'products'
AND constraint_type IN ('CHECK', 'FOREIGN KEY');

-- 3. Verificar se há triggers que podem estar interferindo
SELECT 
    'TRIGGERS ATIVOS' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'products';

-- 4. Verificar se há algum problema com tipos de dados
SELECT 
    'VERIFICAÇÃO DE TIPOS' as info,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('reservation_status', 'reserved', 'received_at', 'cancelled_at')
ORDER BY column_name;

-- 5. Testar inserção de um produto de teste (se não existir)
INSERT INTO products (name, description, category_id, item_type, reservation_status, reserved)
SELECT 
    'PRODUTO TESTE UPDATE',
    'Produto para testar atualizações',
    (SELECT id FROM categories LIMIT 1),
    'principal',
    'reserved',
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PRODUTO TESTE UPDATE')
RETURNING id, name, reservation_status, reserved;

-- 6. Testar atualização no produto de teste
UPDATE products 
SET 
    reservation_status = 'received',
    received_at = NOW(),
    reserved = true,
    updated_at = NOW()
WHERE name = 'PRODUTO TESTE UPDATE'
RETURNING id, name, reservation_status, received_at, updated_at;

-- 7. Verificar se a atualização funcionou
SELECT 
    'VERIFICAÇÃO DO TESTE' as info,
    id,
    name,
    reservation_status,
    received_at,
    updated_at
FROM products 
WHERE name = 'PRODUTO TESTE UPDATE';

-- 8. Limpar produto de teste
DELETE FROM products WHERE name = 'PRODUTO TESTE UPDATE';

-- 9. Verificar logs de erro (se disponível)
SELECT 
    'DIAGNÓSTICO FINAL' as info,
    'Se todas as operações acima funcionaram, o problema está na configuração do Supabase no frontend' as conclusao;
