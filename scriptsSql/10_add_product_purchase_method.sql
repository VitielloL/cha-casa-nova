-- Script para adicionar meio de compra preferencial por produto
-- Execute este script após os scripts anteriores

-- Adicionar campo de meio de compra preferencial na tabela products
ALTER TABLE products 
ADD COLUMN preferred_purchase_method_id uuid REFERENCES public.featured_purchase_methods(id);

-- Criar índice para performance
CREATE INDEX idx_products_preferred_purchase_method ON products(preferred_purchase_method_id);

-- Comentário explicativo
COMMENT ON COLUMN products.preferred_purchase_method_id IS 'Meio de compra preferencial para este produto específico';

-- Atualizar alguns produtos de exemplo com meios de compra preferenciais
-- (Isso será feito via interface admin, mas aqui está um exemplo)
-- UPDATE products SET preferred_purchase_method_id = (SELECT id FROM featured_purchase_methods WHERE name = 'Magazine Luiza' LIMIT 1) WHERE name = 'Jogo de Pratos';
-- UPDATE products SET preferred_purchase_method_id = (SELECT id FROM featured_purchase_methods WHERE name = 'Americanas' LIMIT 1) WHERE name = 'Panela de Pressão';
