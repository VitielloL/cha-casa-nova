-- Script para adicionar sistema de reserva anônima
-- Execute este script após os scripts anteriores

-- Adicionar campo de anonimato na tabela products
ALTER TABLE products 
ADD COLUMN is_anonymous BOOLEAN DEFAULT false;

-- Criar índice para performance
CREATE INDEX idx_products_is_anonymous ON products(is_anonymous);

-- Atualizar políticas RLS se necessário
-- (As políticas existentes já permitem as operações necessárias)

-- Comentário explicativo
COMMENT ON COLUMN products.is_anonymous IS 'Indica se a reserva foi feita anonimamente';
