-- Script para criar tabela de imagens
-- Execute este script após os scripts anteriores

-- Tabela de imagens
CREATE TABLE images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    image_data BYTEA NOT NULL,
    thumbnail_data BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por nome
CREATE INDEX idx_images_filename ON images(filename);
CREATE INDEX idx_images_created_at ON images(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_images_updated_at 
    BEFORE UPDATE ON images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS na tabela de imagens
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Políticas para images (todos podem ler)
CREATE POLICY "Images are viewable by everyone" ON images
    FOR SELECT USING (true);

-- Políticas para permitir inserção de imagens (para upload)
CREATE POLICY "Anyone can insert images" ON images
    FOR INSERT WITH CHECK (true);

-- Políticas para permitir atualização de imagens
CREATE POLICY "Anyone can update images" ON images
    FOR UPDATE USING (true);

-- Políticas para permitir exclusão de imagens
CREATE POLICY "Anyone can delete images" ON images
    FOR DELETE USING (true);

-- Atualizar tabela products para referenciar imagens
ALTER TABLE products 
ADD COLUMN image_id UUID REFERENCES images(id) ON DELETE SET NULL;

-- Índice para busca por image_id
CREATE INDEX idx_products_image_id ON products(image_id);
