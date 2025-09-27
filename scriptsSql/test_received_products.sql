-- Script para testar a funcionalidade de produtos recebidos
-- Cria alguns produtos de exemplo com diferentes status

-- 1. Verificar produtos existentes e seus status
SELECT 
    'PRODUTOS EXISTENTES' as info,
    reservation_status,
    COUNT(*) as quantidade
FROM products 
GROUP BY reservation_status
ORDER BY reservation_status;

-- 2. Criar alguns produtos de exemplo para testar (se não existirem)
INSERT INTO products (name, description, category_id, item_type, reservation_status, reserved_by, reserved_contact, received_at)
SELECT 
    'Panela de Pressão Elétrica',
    'Panela de pressão elétrica 6L, ideal para cozinhar rápido e saudável',
    (SELECT id FROM categories LIMIT 1),
    'principal',
    'received',
    'Maria Silva',
    'maria@email.com',
    NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Panela de Pressão Elétrica');

INSERT INTO products (name, description, category_id, item_type, reservation_status, reserved_by, reserved_contact, received_at)
SELECT 
    'Jogo de Pratos de Porcelana',
    'Jogo completo de pratos de porcelana para 12 pessoas',
    (SELECT id FROM categories LIMIT 1),
    'principal',
    'received',
    'João Santos',
    '(11) 99999-9999',
    NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Jogo de Pratos de Porcelana');

INSERT INTO products (name, description, category_id, item_type, reservation_status, reserved_by, reserved_contact, received_at)
SELECT 
    'Liquidificador Profissional',
    'Liquidificador 1000W com 12 velocidades',
    (SELECT id FROM categories LIMIT 1),
    'principal',
    'received',
    'Ana Costa',
    'ana.costa@email.com',
    NOW() - INTERVAL '3 hours'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Liquidificador Profissional');

-- 3. Verificar produtos recebidos
SELECT 
    'PRODUTOS RECEBIDOS' as info,
    p.id,
    p.name,
    p.reserved_by,
    p.reserved_contact,
    p.received_at,
    p.reservation_status,
    c.name as categoria
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.reservation_status = 'received'
ORDER BY p.received_at DESC;

-- 4. Verificar estatísticas por status
SELECT 
    'ESTATÍSTICAS POR STATUS' as info,
    reservation_status as status,
    COUNT(*) as total,
    COUNT(CASE WHEN received_at IS NOT NULL THEN 1 END) as com_data_recebimento,
    COUNT(CASE WHEN reserved_by IS NOT NULL THEN 1 END) as com_reservador
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

-- 5. Testar mudança de status (exemplo)
-- Descomente as linhas abaixo para testar mudanças de status

/*
-- Marcar um produto como recebido
UPDATE products 
SET reservation_status = 'received', 
    received_at = NOW()
WHERE name = 'Panela de Pressão Elétrica' 
AND reservation_status = 'reserved';

-- Voltar um produto recebido para reservado
UPDATE products 
SET reservation_status = 'reserved', 
    received_at = NULL
WHERE name = 'Jogo de Pratos de Porcelana' 
AND reservation_status = 'received';

-- Liberar um produto recebido (voltar para disponível)
UPDATE products 
SET reservation_status = 'available', 
    reserved_by = NULL,
    reserved_contact = NULL,
    received_at = NULL
WHERE name = 'Liquidificador Profissional' 
AND reservation_status = 'received';
*/

-- 6. Verificar se as mudanças de status funcionam corretamente
SELECT 
    'VERIFICAÇÃO FINAL' as info,
    'Produtos recebidos devem ter received_at preenchido' as regra,
    COUNT(*) as total_recebidos,
    COUNT(CASE WHEN received_at IS NOT NULL THEN 1 END) as com_data_recebimento
FROM products 
WHERE reservation_status = 'received';
