-- Script para adicionar campos de mensagem e imagem nas reservas
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campos de mensagem e imagem na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS reservation_message TEXT,
ADD COLUMN IF NOT EXISTS reservation_image_id UUID REFERENCES images(id);

-- 2. Adicionar campos de mensagem e imagem na tabela surprise_items
ALTER TABLE surprise_items 
ADD COLUMN IF NOT EXISTS reservation_message TEXT,
ADD COLUMN IF NOT EXISTS reservation_image_id UUID REFERENCES images(id);

-- 3. Criar tabela para armazenar imagens de reservas (se não existir)
CREATE TABLE IF NOT EXISTS public.reservation_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  surprise_item_id uuid REFERENCES public.surprise_items(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  width integer,
  height integer,
  image_data bytea NOT NULL,
  thumbnail_data bytea,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_reservation_images_product_id ON reservation_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reservation_images_surprise_item_id ON reservation_images(surprise_item_id);

-- 5. Adicionar comentários para documentação
COMMENT ON COLUMN products.reservation_message IS 'Mensagem carinhosa deixada por quem reservou';
COMMENT ON COLUMN products.reservation_image_id IS 'Imagem fofa deixada por quem reservou';
COMMENT ON COLUMN surprise_items.reservation_message IS 'Mensagem carinhosa deixada por quem reservou';
COMMENT ON COLUMN surprise_items.reservation_image_id IS 'Imagem fofa deixada por quem reservou';

-- 6. Verificar se as colunas foram criadas
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('reservation_message', 'reservation_image_id')
ORDER BY column_name;

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'surprise_items' 
AND column_name IN ('reservation_message', 'reservation_image_id')
ORDER BY column_name;
