-- Habilitar Row Level Security (RLS) para as tabelas
-- Execute este script após criar as tabelas

-- Habilitar RLS nas tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas para categories (todos podem ler)
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Políticas para stores (todos podem ler)
CREATE POLICY "Stores are viewable by everyone" ON stores
    FOR SELECT USING (true);

-- Políticas para products (todos podem ler)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Políticas para permitir inserção de produtos e lojas (para o formulário de cadastro)
CREATE POLICY "Anyone can insert products" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert stores" ON stores
    FOR INSERT WITH CHECK (true);

-- Políticas para permitir atualização de produtos (para reservas)
CREATE POLICY "Anyone can update products" ON products
    FOR UPDATE USING (true);

-- Políticas para permitir inserção de categorias
CREATE POLICY "Anyone can insert categories" ON categories
    FOR INSERT WITH CHECK (true);
