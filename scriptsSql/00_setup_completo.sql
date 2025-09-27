-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO - CHÁ DE CASA NOVA
-- =====================================================
-- Execute este script no Supabase SQL Editor
-- Este script cria todas as tabelas e configurações necessárias

-- 1. CRIAR TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lojas
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens
CREATE TABLE IF NOT EXISTS images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    image_data BYTEA NOT NULL,
    thumbnail_data BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_id UUID REFERENCES images(id) ON DELETE SET NULL,
    reserved BOOLEAN DEFAULT FALSE,
    reserved_by TEXT,
    reserved_contact TEXT,
    reservation_status TEXT DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled')),
    item_type TEXT DEFAULT 'principal' CHECK (item_type IN ('principal', 'adicional')),
    received_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações da aplicação
CREATE TABLE IF NOT EXISTS app_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de anfitriões da festa
CREATE TABLE IF NOT EXISTS party_owners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    photo_id UUID REFERENCES images(id) ON DELETE SET NULL,
    bio TEXT,
    relationship TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de endereço de entrega
CREATE TABLE IF NOT EXISTS delivery_address (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    instructions TEXT,
    contact TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métodos de compra em destaque
CREATE TABLE IF NOT EXISTS featured_purchase_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    link TEXT,
    is_affiliate BOOLEAN DEFAULT FALSE,
    commission TEXT,
    icon TEXT,
    color TEXT DEFAULT 'blue',
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métodos de compra por produto
CREATE TABLE IF NOT EXISTS product_purchase_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('link', 'address', 'photo', 'text', 'phone', 'email')),
    content TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT 'blue',
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens surpresa
CREATE TABLE IF NOT EXISTS surprise_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    reserved_by TEXT,
    reserved_contact TEXT,
    reservation_status TEXT DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled')),
    item_type TEXT DEFAULT 'adicional' CHECK (item_type IN ('principal', 'adicional')),
    is_visible BOOLEAN DEFAULT TRUE,
    admin_notes TEXT,
    received_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_address ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_purchase_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_purchase_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE surprise_items ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS RLS (PERMITIR ACESSO PÚBLICO)
-- =====================================================

-- Políticas para admins
CREATE POLICY "Allow public read access" ON admins FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON admins FOR UPDATE USING (true);

-- Políticas para categorias
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON categories FOR DELETE USING (true);

-- Políticas para lojas
CREATE POLICY "Allow public read access" ON stores FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON stores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON stores FOR DELETE USING (true);

-- Políticas para imagens
CREATE POLICY "Allow public read access" ON images FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON images FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON images FOR DELETE USING (true);

-- Políticas para produtos
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON products FOR DELETE USING (true);

-- Políticas para configurações
CREATE POLICY "Allow public read access" ON app_config FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON app_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON app_config FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON app_config FOR DELETE USING (true);

-- Políticas para anfitriões
CREATE POLICY "Allow public read access" ON party_owners FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON party_owners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON party_owners FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON party_owners FOR DELETE USING (true);

-- Políticas para endereço de entrega
CREATE POLICY "Allow public read access" ON delivery_address FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON delivery_address FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON delivery_address FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON delivery_address FOR DELETE USING (true);

-- Políticas para métodos de compra em destaque
CREATE POLICY "Allow public read access" ON featured_purchase_methods FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON featured_purchase_methods FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON featured_purchase_methods FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON featured_purchase_methods FOR DELETE USING (true);

-- Políticas para métodos de compra por produto
CREATE POLICY "Allow public read access" ON product_purchase_methods FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON product_purchase_methods FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON product_purchase_methods FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON product_purchase_methods FOR DELETE USING (true);

-- Políticas para itens surpresa
CREATE POLICY "Allow public read access" ON surprise_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON surprise_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON surprise_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON surprise_items FOR DELETE USING (true);

-- 4. INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir administrador padrão
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@chacasanova.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador')
ON CONFLICT (email) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, description) VALUES 
('Cozinha', 'Utensílios e eletrodomésticos para a cozinha'),
('Quarto', 'Itens para o quarto do casal'),
('Sala', 'Decoração e móveis para a sala'),
('Banheiro', 'Itens para o banheiro'),
('Lavanderia', 'Itens para a área de serviço'),
('Outros', 'Outros itens diversos')
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão
INSERT INTO app_config (key, value, description) VALUES 
('whatsapp_number', '5511999999999', 'Número do WhatsApp para contato'),
('thank_you_message', 'Obrigado pela sua contribuição! Seu item foi reservado com sucesso.', 'Mensagem de agradecimento'),
('app_title', 'Chá de Casa Nova', 'Título da aplicação'),
('app_description', 'Lista de presentes para o chá de casa nova', 'Descrição da aplicação')
ON CONFLICT (key) DO NOTHING;

-- Inserir endereço de entrega padrão
INSERT INTO delivery_address (title, address, instructions, contact) VALUES 
('Endereço Principal', 'Rua das Flores, 123 - Centro - São Paulo/SP', 'Entregar na portaria. Favor avisar com antecedência.', 'WhatsApp: (11) 99999-9999')
ON CONFLICT DO NOTHING;

-- Inserir anfitriões padrão
INSERT INTO party_owners (name, bio, relationship, order_index) VALUES 
('Maria e João', 'Os anfitriões desta festa especial!', 'Noivos', 1)
ON CONFLICT DO NOTHING;

-- 5. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_reservation_status ON products(reservation_status);
CREATE INDEX IF NOT EXISTS idx_products_item_type ON products(item_type);
CREATE INDEX IF NOT EXISTS idx_surprise_items_reservation_status ON surprise_items(reservation_status);
CREATE INDEX IF NOT EXISTS idx_surprise_items_item_type ON surprise_items(item_type);
CREATE INDEX IF NOT EXISTS idx_surprise_items_is_visible ON surprise_items(is_visible);
CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_product_id ON product_purchase_methods(product_id);
CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_is_primary ON product_purchase_methods(is_primary);

-- 6. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'admins', 'categories', 'stores', 'images', 'products', 
        'app_config', 'party_owners', 'delivery_address', 
        'featured_purchase_methods', 'product_purchase_methods', 'surprise_items'
    )
ORDER BY tablename;

-- Verificar se o admin foi inserido
SELECT email, name, created_at FROM admins;

-- Verificar se as categorias foram inseridas
SELECT name, description FROM categories ORDER BY name;

-- Verificar se as configurações foram inseridas
SELECT key, value, description FROM app_config ORDER BY key;

-- =====================================================
-- SCRIPT CONCLUÍDO COM SUCESSO!
-- =====================================================
