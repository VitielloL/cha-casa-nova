-- Script para simular exatamente o que o frontend está tentando fazer
-- Execute este script para testar se as atualizações funcionam no banco

-- 1. Verificar estado atual
SELECT 
    'ESTADO ATUAL' as info,
    id,
    name,
    reservation_status,
    reserved,
    reserved_by,
    reserved_contact,
    received_at,
    cancelled_at,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 2. Simular exatamente o que o frontend faz para marcar como RECEBIDO
-- (baseado no código do frontend)
UPDATE products 
SET 
    reservation_status = 'received',
    received_at = NOW(),
    cancelled_at = NULL,
    reserved = true,
    updated_at = NOW()
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING 
    id, 
    name, 
    reservation_status, 
    reserved, 
    received_at, 
    cancelled_at,
    updated_at;

-- 3. Verificar se funcionou
SELECT 
    'APÓS MARCAR COMO RECEBIDO' as info,
    id,
    name,
    reservation_status,
    reserved,
    received_at,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 4. Simular LIBERAR produto (voltar para disponível)
UPDATE products 
SET 
    reservation_status = 'available',
    reserved_by = NULL,
    reserved_contact = NULL,
    received_at = NULL,
    cancelled_at = NULL,
    reserved = false,
    updated_at = NOW()
WHERE id = (SELECT id FROM products WHERE reservation_status = 'received' LIMIT 1)
RETURNING 
    id, 
    name, 
    reservation_status, 
    reserved, 
    reserved_by,
    reserved_contact,
    received_at,
    cancelled_at,
    updated_at;

-- 5. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as info,
    id,
    name,
    reservation_status,
    reserved,
    reserved_by,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 6. Verificar se há algum problema com RLS
SELECT 
    'VERIFICAÇÃO RLS' as info,
    'Se as atualizações acima funcionaram, o problema está no frontend' as observacao;

-- 7. Verificar políticas RLS específicas
SELECT 
    'POLÍTICAS RLS PARA UPDATE' as info,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products' 
AND cmd = 'UPDATE';
