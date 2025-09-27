-- Script final para debugar o problema de atualizações
-- Execute este script e compare com os logs do frontend

-- 1. Verificar estado inicial
SELECT 
    'ESTADO INICIAL' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at
FROM products 
WHERE reservation_status = 'reserved'
LIMIT 1;

-- 2. Fazer exatamente a mesma atualização que o frontend faz
-- (copiado do código do frontend)
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
    'APÓS ATUALIZAÇÃO' as info,
    id,
    name,
    reservation_status,
    reserved,
    received_at,
    updated_at
FROM products 
ORDER BY updated_at DESC
LIMIT 3;

-- 4. Verificar se há algum problema com a sessão/autenticação
-- (Isso pode ser um problema se o frontend não estiver autenticado)
SELECT 
    'VERIFICAÇÃO DE SESSÃO' as info,
    'Se as atualizações acima funcionaram, o problema pode ser de autenticação no frontend' as observacao;

-- 5. Verificar se há algum problema com o campo updated_at
-- (Pode ser que o trigger não esteja funcionando)
SELECT 
    'VERIFICAÇÃO DE TRIGGERS' as info,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'products';

-- 6. Testar uma atualização manual do updated_at
UPDATE products 
SET updated_at = NOW()
WHERE id = (SELECT id FROM products WHERE reservation_status = 'received' LIMIT 1)
RETURNING id, name, updated_at;

-- 7. Verificar se o updated_at foi atualizado
SELECT 
    'VERIFICAÇÃO UPDATED_AT' as info,
    id,
    name,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - updated_at)) as segundos_atras
FROM products 
WHERE reservation_status = 'received'
ORDER BY updated_at DESC
LIMIT 1;
