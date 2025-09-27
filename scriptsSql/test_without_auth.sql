-- Script para testar se o problema é de autenticação
-- Este script simula uma operação sem autenticação (como o frontend pode estar fazendo)

-- 1. Verificar se as políticas RLS permitem operações sem autenticação
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

-- 2. Verificar se há alguma política que exige autenticação
SELECT 
    'VERIFICAÇÃO DE POLÍTICAS RESTRITIVAS' as info,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products' 
AND (qual LIKE '%auth%' OR with_check LIKE '%auth%' OR qual LIKE '%user%' OR with_check LIKE '%user%');

-- 3. Testar uma atualização simples
UPDATE products 
SET 
    reservation_status = 'received',
    received_at = NOW(),
    reserved = true
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING id, name, reservation_status, received_at;

-- 4. Verificar se funcionou
SELECT 
    'RESULTADO DO TESTE' as info,
    id,
    name,
    reservation_status,
    received_at,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 5. Se funcionou, o problema pode ser no frontend
-- Se não funcionou, o problema é nas políticas RLS
SELECT 
    'DIAGNÓSTICO' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM products WHERE reservation_status = 'received' AND received_at > NOW() - INTERVAL '1 minute')
        THEN '✅ Atualização funcionou - problema está no frontend'
        ELSE '❌ Atualização não funcionou - problema está nas políticas RLS'
    END as resultado;
