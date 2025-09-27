-- Script para debugar por que as atualizações não estão indo para o banco
-- Execute este script para identificar o problema

-- 1. Verificar estrutura atual da tabela products
SELECT 
    'ESTRUTURA DA TABELA PRODUCTS' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Verificar se há políticas RLS conflitantes
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

-- 3. Verificar se RLS está habilitado
SELECT 
    'STATUS RLS' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'products';

-- 4. Testar uma atualização manual simples
SELECT 
    'TESTE DE ATUALIZAÇÃO MANUAL' as info,
    'Antes da atualização' as status;

-- Mostrar estado antes
SELECT 
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- Fazer uma atualização de teste
UPDATE products 
SET updated_at = NOW()
WHERE id = (SELECT id FROM products LIMIT 1)
RETURNING id, name, reservation_status, updated_at;

-- Mostrar estado depois
SELECT 
    'Após atualização manual' as status,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 5. Verificar se há triggers que podem estar interferindo
SELECT 
    'TRIGGERS NA TABELA PRODUCTS' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'products';

-- 6. Verificar se há constraints que podem estar bloqueando
SELECT 
    'CONSTRAINTS NA TABELA PRODUCTS' as info,
    constraint_name,
    constraint_type,
    is_deferrable,
    initially_deferred
FROM information_schema.table_constraints 
WHERE table_name = 'products';

-- 7. Verificar se há campos que não existem na tabela
-- (Isso pode causar erro silencioso)
SELECT 
    'VERIFICAÇÃO DE CAMPOS' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reservation_message') 
        THEN 'reservation_message: EXISTE'
        ELSE 'reservation_message: NÃO EXISTE'
    END as campo_reservation_message,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reservation_image_id') 
        THEN 'reservation_image_id: EXISTE'
        ELSE 'reservation_image_id: NÃO EXISTE'
    END as campo_reservation_image_id;

-- 8. Testar atualização com campos que sabemos que existem
SELECT 
    'TESTE COM CAMPOS CONHECIDOS' as info;

UPDATE products 
SET reservation_status = 'received',
    received_at = NOW(),
    reserved = true
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING id, name, reservation_status, received_at, reserved;

-- 9. Verificar logs de erro (se disponível)
SELECT 
    'VERIFICAÇÃO FINAL' as info,
    'Se a atualização acima funcionou, o problema pode estar no frontend' as observacao;
