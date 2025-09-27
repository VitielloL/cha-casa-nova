-- Script para adicionar sistema de status de reservas
-- Execute este script após os scripts anteriores

-- Adicionar campos de status e classificação na tabela products
ALTER TABLE products 
ADD COLUMN reservation_status TEXT DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled')),
ADD COLUMN item_type TEXT DEFAULT 'principal' CHECK (item_type IN ('principal', 'adicional')),
ADD COLUMN received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;

-- Atualizar produtos existentes que estão reservados
UPDATE products 
SET reservation_status = 'reserved' 
WHERE reserved = true;

-- Criar índices para performance
CREATE INDEX idx_products_reservation_status ON products(reservation_status);
CREATE INDEX idx_products_item_type ON products(item_type);
CREATE INDEX idx_products_received_at ON products(received_at);

-- Função para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION update_product_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar received_at quando status muda para 'received'
    IF NEW.reservation_status = 'received' AND OLD.reservation_status != 'received' THEN
        NEW.received_at = NOW();
    END IF;
    
    -- Atualizar cancelled_at quando status muda para 'cancelled'
    IF NEW.reservation_status = 'cancelled' AND OLD.reservation_status != 'cancelled' THEN
        NEW.cancelled_at = NOW();
    END IF;
    
    -- Limpar timestamps quando status muda para outros valores
    IF NEW.reservation_status NOT IN ('received', 'cancelled') THEN
        NEW.received_at = NULL;
        NEW.cancelled_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamps automaticamente
CREATE TRIGGER update_product_status_timestamps_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_status_timestamps();

-- Atualizar políticas RLS para incluir novos campos
DROP POLICY IF EXISTS "Anyone can update products" ON products;
CREATE POLICY "Anyone can update products" ON products
    FOR UPDATE USING (true);

-- Inserir alguns produtos de exemplo com diferentes tipos
UPDATE products 
SET item_type = 'principal' 
WHERE name IN ('Jogo de Pratos', 'Panela de Pressão', 'Sofá 3 Lugares', 'Mesa de Centro', 'Cama Box');

UPDATE products 
SET item_type = 'adicional' 
WHERE name IN ('Jogo de Toalhas');
