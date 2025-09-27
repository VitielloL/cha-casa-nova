-- Script para verificar e corrigir colunas da tabela products
-- Este script verifica se os campos necessários existem e os adiciona se necessário

-- 1. Verificar estrutura atual da tabela products
SELECT 
    'ESTRUTURA ATUAL DA TABELA PRODUCTS' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 2. Verificar se os campos de reserva existem
SELECT 
    'VERIFICAÇÃO DE CAMPOS DE RESERVA' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reservation_message') 
        THEN '✅ reservation_message: EXISTE'
        ELSE '❌ reservation_message: NÃO EXISTE'
    END as campo_reservation_message,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reservation_image_id') 
        THEN '✅ reservation_image_id: EXISTE'
        ELSE '❌ reservation_image_id: NÃO EXISTE'
    END as campo_reservation_image_id;

-- 3. Adicionar campos que não existem
DO $$
BEGIN
    -- Adicionar reservation_message se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reservation_message'
    ) THEN
        ALTER TABLE products ADD COLUMN reservation_message TEXT;
        RAISE NOTICE 'Campo reservation_message adicionado';
    ELSE
        RAISE NOTICE 'Campo reservation_message já existe';
    END IF;

    -- Adicionar reservation_image_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reservation_image_id'
    ) THEN
        ALTER TABLE products ADD COLUMN reservation_image_id UUID REFERENCES images(id);
        RAISE NOTICE 'Campo reservation_image_id adicionado';
    ELSE
        RAISE NOTICE 'Campo reservation_image_id já existe';
    END IF;
END $$;

-- 4. Verificar estrutura após correções
SELECT 
    'ESTRUTURA APÓS CORREÇÕES' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- 5. Testar uma atualização completa
SELECT 
    'TESTE DE ATUALIZAÇÃO COMPLETA' as info;

-- Fazer uma atualização de teste com todos os campos
UPDATE products 
SET 
    reservation_status = 'received',
    reserved = true,
    received_at = NOW(),
    reservation_message = 'Teste de mensagem',
    updated_at = NOW()
WHERE id = (SELECT id FROM products WHERE reservation_status = 'reserved' LIMIT 1)
RETURNING 
    id, 
    name, 
    reservation_status, 
    reserved, 
    received_at, 
    reservation_message,
    updated_at;

-- 6. Verificar se a atualização funcionou
SELECT 
    'VERIFICAÇÃO FINAL' as info,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN reservation_status = 'received' THEN 1 END) as produtos_recebidos,
    COUNT(CASE WHEN reservation_message IS NOT NULL THEN 1 END) as com_mensagem
FROM products;
