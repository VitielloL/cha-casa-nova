-- Script para verificar se as atualizações de status estão sendo persistidas no banco
-- Execute este script para verificar o estado atual dos produtos

-- 1. Verificar todos os produtos e seus status
SELECT 
    'TODOS OS PRODUTOS' as info,
    id,
    name,
    reservation_status,
    reserved,
    reserved_by,
    reserved_contact,
    received_at,
    cancelled_at,
    created_at,
    updated_at
FROM products 
ORDER BY updated_at DESC;

-- 2. Verificar produtos por status
SELECT 
    'PRODUTOS POR STATUS' as info,
    reservation_status,
    COUNT(*) as quantidade,
    COUNT(CASE WHEN reserved = true THEN 1 END) as marcados_como_reservados,
    COUNT(CASE WHEN received_at IS NOT NULL THEN 1 END) as com_data_recebimento,
    COUNT(CASE WHEN cancelled_at IS NOT NULL THEN 1 END) as com_data_cancelamento
FROM products 
GROUP BY reservation_status
ORDER BY 
    CASE reservation_status
        WHEN 'available' THEN 1
        WHEN 'reserved' THEN 2
        WHEN 'received' THEN 3
        WHEN 'cancelled' THEN 4
        ELSE 5
    END;

-- 3. Verificar inconsistências entre reservation_status e reserved
SELECT 
    'INCONSISTÊNCIAS' as info,
    id,
    name,
    reservation_status,
    reserved,
    CASE 
        WHEN reservation_status = 'available' AND reserved = true THEN 'ERRO: Disponível mas marcado como reservado'
        WHEN reservation_status IN ('reserved', 'received', 'cancelled') AND reserved = false THEN 'ERRO: Reservado/Recebido/Cancelado mas não marcado como reservado'
        ELSE 'OK'
    END as status_consistency
FROM products 
WHERE (reservation_status = 'available' AND reserved = true)
   OR (reservation_status IN ('reserved', 'received', 'cancelled') AND reserved = false);

-- 4. Verificar produtos recebidos especificamente
SELECT 
    'PRODUTOS RECEBIDOS' as info,
    id,
    name,
    reserved_by,
    reserved_contact,
    received_at,
    reservation_status,
    reserved,
    updated_at
FROM products 
WHERE reservation_status = 'received'
ORDER BY received_at DESC;

-- 5. Verificar histórico de atualizações (últimos 10 produtos atualizados)
SELECT 
    'ÚLTIMAS ATUALIZAÇÕES' as info,
    id,
    name,
    reservation_status,
    reserved,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - updated_at)) as segundos_atras
FROM products 
ORDER BY updated_at DESC
LIMIT 10;

-- 6. Testar uma atualização manual para verificar se funciona
-- Descomente as linhas abaixo para testar uma atualização manual

/*
-- Exemplo: Marcar um produto como recebido
UPDATE products 
SET reservation_status = 'received',
    received_at = NOW(),
    reserved = true,
    updated_at = NOW()
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING id, name, reservation_status, received_at, updated_at;

-- Verificar se a atualização funcionou
SELECT 
    'TESTE DE ATUALIZAÇÃO' as info,
    id,
    name,
    reservation_status,
    received_at,
    updated_at
FROM products 
WHERE id = (SELECT id FROM products WHERE reservation_status = 'received' ORDER BY updated_at DESC LIMIT 1);
*/
