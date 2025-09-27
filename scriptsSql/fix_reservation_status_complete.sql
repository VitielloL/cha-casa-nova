-- Script COMPLETO para corrigir problemas de reservation_status
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna reservation_status se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'reservation_status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN reservation_status TEXT DEFAULT 'available';
    END IF;
END $$;

-- 2. Adicionar constraint para valores válidos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'products_reservation_status_check'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_reservation_status_check 
        CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled'));
    END IF;
END $$;

-- 3. Adicionar colunas de timestamp se não existirem
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- 4. Sincronizar dados: atualizar reservation_status baseado no campo 'reserved'
UPDATE products 
SET reservation_status = CASE 
    WHEN reserved = true THEN 'reserved'
    WHEN reserved = false THEN 'available'
    ELSE COALESCE(reservation_status, 'available')
END
WHERE reservation_status IS NULL 
   OR (reserved = true AND reservation_status = 'available')
   OR (reserved = false AND reservation_status = 'reserved');

-- 5. Corrigir produtos que estão como 'reserved' mas não têm dados de reserva
UPDATE products 
SET reservation_status = 'available',
    reserved = false,
    reserved_by = NULL,
    reserved_contact = NULL
WHERE reservation_status = 'reserved' 
  AND (reserved_by IS NULL OR reserved_contact IS NULL);

-- 6. Atualizar especificamente a Panela de Pressão para available
UPDATE products 
SET reservation_status = 'available',
    reserved = false,
    reserved_by = NULL,
    reserved_contact = NULL,
    received_at = NULL,
    cancelled_at = NULL
WHERE name ILIKE '%panela%' OR name ILIKE '%pressão%';

-- 7. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as status,
    reservation_status,
    COUNT(*) as quantidade
FROM products
GROUP BY reservation_status
ORDER BY quantidade DESC;

-- 8. Mostrar todos os produtos após correção
SELECT 
    id,
    name,
    reserved,
    reservation_status,
    reserved_by,
    reserved_contact,
    CASE 
        WHEN received_at IS NOT NULL THEN 'Recebido: ' || received_at::text
        WHEN cancelled_at IS NOT NULL THEN 'Cancelado: ' || cancelled_at::text
        ELSE 'Disponível'
    END as status_info
FROM products
ORDER BY name;

-- 9. Verificar se ainda há inconsistências
SELECT 
    'VERIFICAÇÃO DE INCONSISTÊNCIAS' as check_type,
    COUNT(*) as total_inconsistencies
FROM products
WHERE (reserved = true AND reservation_status != 'reserved')
   OR (reserved = false AND reservation_status = 'reserved')
   OR (reservation_status NOT IN ('available', 'reserved', 'received', 'cancelled'));
