-- Script para criar as tabelas do chá de casa nova
-- Execute este script no Supabase SQL Editor

-- Tabela de categorias
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lojas
CREATE TABLE stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    store_link TEXT,
    store_address TEXT,
    reserved BOOLEAN DEFAULT FALSE,
    reserved_by TEXT,
    reserved_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias de exemplo
INSERT INTO categories (name) VALUES 
('Cozinha'),
('Sala'),
('Quarto'),
('Banheiro'),
('Lavanderia'),
('Jardim'),
('Decoração');

-- Inserir lojas de exemplo
INSERT INTO stores (name, address, link) VALUES 
('Casa & Cia', 'Rua das Flores, 123 - Centro', 'https://casaecia.com.br'),
('Mobly', 'Shopping Center - Loja 45', 'https://mobly.com.br'),
('Tok&Stok', 'Av. Principal, 456', 'https://tokstok.com.br');

-- Inserir produtos de exemplo
INSERT INTO products (category_id, name, description, image_url, store_link, store_address) VALUES 
((SELECT id FROM categories WHERE name = 'Cozinha'), 'Jogo de Pratos', 'Conjunto com 6 pratos de porcelana branca', 'https://via.placeholder.com/300x300', 'https://casaecia.com.br/pratos', 'Rua das Flores, 123 - Centro'),
((SELECT id FROM categories WHERE name = 'Cozinha'), 'Panela de Pressão', 'Panela de pressão 5L inox', 'https://via.placeholder.com/300x300', 'https://casaecia.com.br/panelas', 'Rua das Flores, 123 - Centro'),
((SELECT id FROM categories WHERE name = 'Sala'), 'Sofá 3 Lugares', 'Sofá cinza 3 lugares com pés de madeira', 'https://via.placeholder.com/300x300', 'https://mobly.com.br/sofas', 'Shopping Center - Loja 45'),
((SELECT id FROM categories WHERE name = 'Sala'), 'Mesa de Centro', 'Mesa de centro de vidro com base de madeira', 'https://via.placeholder.com/300x300', 'https://tokstok.com.br/mesas', 'Av. Principal, 456'),
((SELECT id FROM categories WHERE name = 'Quarto'), 'Cama Box', 'Cama box queen com cabeceira estofada', 'https://via.placeholder.com/300x300', 'https://mobly.com.br/camas', 'Shopping Center - Loja 45'),
((SELECT id FROM categories WHERE name = 'Banheiro'), 'Jogo de Toalhas', 'Conjunto com 4 toalhas de banho', 'https://via.placeholder.com/300x300', 'https://casaecia.com.br/toalhas', 'Rua das Flores, 123 - Centro');
