-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO INICIAL COMPLETO
-- SISTEMA CHÁ DE CASA NOVA - GABRIEL VILELA
-- © 2025 Gabriel Vilela - Propriedade exclusiva - Licença: R$ 1.000.000,00
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Este script cria todas as tabelas, políticas e dados iniciais
-- 3. Após a execução, o sistema estará pronto para uso
-- 4. Credenciais padrão: admin@chacasanova.com / admin123
--
-- =====================================================

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
    is_anonymous BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
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

-- 4. CRIAR FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
CREATE TRIGGER update_images_timestamp_trigger
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_app_config_timestamp_trigger
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_party_owners_timestamp_trigger
    BEFORE UPDATE ON party_owners
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_delivery_address_timestamp_trigger
    BEFORE UPDATE ON delivery_address
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_featured_purchase_methods_timestamp_trigger
    BEFORE UPDATE ON featured_purchase_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_purchase_methods_timestamp_trigger
    BEFORE UPDATE ON product_purchase_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_surprise_items_timestamp_trigger
    BEFORE UPDATE ON surprise_items
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 5. INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir administrador padrão
-- Senha: admin123 (hash bcrypt)
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
('Jardim', 'Itens para o jardim e área externa'),
('Outros', 'Outros itens diversos')
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão
INSERT INTO app_config (key, value, description) VALUES 
('whatsapp_number', '5511999999999', 'Número do WhatsApp para contato'),
('admin_whatsapp_number', '5511999999999', 'Número do WhatsApp do admin para dúvidas'),
('thank_you_message', 'Oi! Obrigado(a) pelo presente! Recebi o produto {{PRODUCT_NAME}} e estou muito feliz! 🎉', 'Mensagem de agradecimento (use {{PRODUCT_NAME}} para nome do produto)'),
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

-- Inserir métodos de compra em destaque
INSERT INTO featured_purchase_methods (name, description, link, is_affiliate, commission, icon, color, order_index) VALUES 
('Magazine Luiza', 'Compre com segurança e receba em casa', 'https://www.magazineluiza.com.br', true, '2x mais pontos Luiza', '🛒', 'purple', 1),
('Americanas', 'Entrega rápida e preços competitivos', 'https://www.americanas.com.br', true, '5% de cashback', '🏪', 'red', 2),
('Mercado Livre', 'Maior marketplace do Brasil', 'https://www.mercadolivre.com.br', false, '', '🛍️', 'yellow', 3)
ON CONFLICT DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO products (category_id, name, description, reservation_status, item_type) VALUES 
((SELECT id FROM categories WHERE name = 'Cozinha'), 'Jogo de Pratos', 'Conjunto com 6 pratos de porcelana branca', 'available', 'principal'),
((SELECT id FROM categories WHERE name = 'Cozinha'), 'Panela de Pressão', 'Panela de pressão 5L inox', 'available', 'principal'),
((SELECT id FROM categories WHERE name = 'Sala'), 'Sofá 3 Lugares', 'Sofá cinza 3 lugares com pés de madeira', 'available', 'principal'),
((SELECT id FROM categories WHERE name = 'Sala'), 'Mesa de Centro', 'Mesa de centro de vidro com base de madeira', 'available', 'principal'),
((SELECT id FROM categories WHERE name = 'Quarto'), 'Cama Box', 'Cama box queen com cabeceira estofada', 'available', 'principal'),
((SELECT id FROM categories WHERE name = 'Banheiro'), 'Jogo de Toalhas', 'Conjunto com 4 toalhas de banho', 'available', 'principal')
ON CONFLICT DO NOTHING;

-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_reservation_status ON products(reservation_status);
CREATE INDEX IF NOT EXISTS idx_products_item_type ON products(item_type);
CREATE INDEX IF NOT EXISTS idx_products_is_anonymous ON products(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_surprise_items_reservation_status ON surprise_items(reservation_status);
CREATE INDEX IF NOT EXISTS idx_surprise_items_item_type ON surprise_items(item_type);
CREATE INDEX IF NOT EXISTS idx_surprise_items_is_visible ON surprise_items(is_visible);
CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_product_id ON product_purchase_methods(product_id);
CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_is_primary ON product_purchase_methods(is_primary);
CREATE INDEX IF NOT EXISTS idx_party_owners_order ON party_owners(order_index);
CREATE INDEX IF NOT EXISTS idx_delivery_address_active ON delivery_address(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_purchase_methods_active ON featured_purchase_methods(active);
CREATE INDEX IF NOT EXISTS idx_featured_purchase_methods_order ON featured_purchase_methods(order_index);

-- 7. VERIFICAÇÃO FINAL
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

-- Verificar se os produtos foram inseridos
SELECT p.name, c.name as category, p.reservation_status 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id 
ORDER BY c.name, p.name;

-- =====================================================
-- SCRIPT CONCLUÍDO COM SUCESSO!
-- =====================================================
-- 
-- PRÓXIMOS PASSOS:
-- 1. Configure as variáveis de ambiente no arquivo .env.local
-- 2. Execute: npm run dev
-- 3. Acesse: http://localhost:3000
-- 4. Faça login com: admin@chacasanova.com / admin123
-- 5. Configure os números do WhatsApp nas configurações
-- 6. Adicione produtos e personalize o sistema
-- =====================================================
