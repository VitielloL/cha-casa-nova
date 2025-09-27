-- Script para testar exatamente o que o painel admin está fazendo
-- Execute este script e compare com os logs do console do navegador

-- 1. Verificar produtos que podem ser testados
SELECT 
    'PRODUTOS PARA TESTE' as info,
    id,
    name,
    reservation_status,
    reserved,
    reserved_by,
    received_at,
    cancelled_at
FROM products 
WHERE reservation_status IN ('reserved', 'received', 'available')
ORDER BY updated_at DESC
LIMIT 5;

-- 2. Testar MARCAR COMO RECEBIDO (como no painel admin)
-- Simular exatamente o que o frontend faz
UPDATE products 
SET 
    reservation_status = 'received',
    received_at = NOW(),
    cancelled_at = NULL,
    reserved = true
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

-- 4. Testar LIBERAR PRODUTO (voltar para disponível)
UPDATE products 
SET 
    reservation_status = 'available',
    reserved_by = NULL,
    reserved_contact = NULL,
    received_at = NULL,
    cancelled_at = NULL,
    reserved = false
WHERE id = (SELECT id FROM products WHERE reservation_status = 'received' LIMIT 1)
RETURNING 
    id, 
    name, 
    reservation_status, 
    reserved, 
    reserved_by,
    received_at,
    updated_at;

-- 5. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 6. Verificar se há algum problema específico
SELECT 
    'DIAGNÓSTICO' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM products WHERE reservation_status = 'received' AND received_at > NOW() - INTERVAL '1 minute')
        THEN '✅ Atualizações funcionam no banco - problema está no frontend'
        ELSE '❌ Atualizações não funcionam no banco - problema está nas políticas RLS'
    END as resultado;
