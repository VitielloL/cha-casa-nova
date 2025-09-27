-- Script para adicionar sistema de anfitriões da festa e endereço de entrega
-- Execute este script após os scripts anteriores

-- Tabela para informações dos anfitriões da festa
CREATE TABLE IF NOT EXISTS public.party_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_id uuid REFERENCES public.images(id),
  bio text,
  relationship text, -- ex: "Anfitriões", "Aniversariantes", "Casal"
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabela para endereço de entrega
CREATE TABLE IF NOT EXISTS public.delivery_address (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Endereço de Entrega',
  address text NOT NULL,
  instructions text,
  contact_phone text,
  contact_name text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabela para meios de compra em destaque
CREATE TABLE IF NOT EXISTS public.featured_purchase_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  link text NOT NULL,
  is_affiliate boolean DEFAULT false,
  affiliate_commission text, -- ex: "2x mais pontos", "5% de cashback"
  icon text, -- emoji ou nome do ícone
  color text DEFAULT 'blue', -- cor do botão
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Inserir dados padrão
INSERT INTO public.party_owners (name, bio, relationship, order_index) VALUES
('Maria Silva', 'Apaixonada por decoração e organização, Maria adora receber amigos em casa e criar ambientes aconchegantes.', 'Noiva', 1),
('João Santos', 'Engenheiro de formação, João é o responsável por todas as montagens e instalações da casa nova.', 'Noivo', 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.delivery_address (title, address, contact_name, contact_phone) VALUES
('Casa dos Noivos', 'Rua das Flores, 123 - Bairro Jardim - São Paulo/SP - CEP: 01234-567', 'Maria Silva', '11999887766')
ON CONFLICT DO NOTHING;

INSERT INTO public.featured_purchase_methods (name, description, link, is_affiliate, affiliate_commission, icon, color, order_index) VALUES
('Magazine Luiza', 'Compre com segurança e receba em casa', 'https://www.magazineluiza.com.br', true, '2x mais pontos Luiza', '🛒', 'purple', 1),
('Americanas', 'Entrega rápida e preços competitivos', 'https://www.americanas.com.br', true, '5% de cashback', '🏪', 'red', 2),
('Mercado Livre', 'Maior marketplace do Brasil', 'https://www.mercadolivre.com.br', false, '', '🛍️', 'yellow', 3)
ON CONFLICT DO NOTHING;

-- Funções para atualizar timestamps
CREATE OR REPLACE FUNCTION update_party_owners_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_delivery_address_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_featured_purchase_methods_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
CREATE TRIGGER update_party_owners_timestamp_trigger
    BEFORE UPDATE ON party_owners
    FOR EACH ROW
    EXECUTE FUNCTION update_party_owners_timestamp();

CREATE TRIGGER update_delivery_address_timestamp_trigger
    BEFORE UPDATE ON delivery_address
    FOR EACH ROW
    EXECUTE FUNCTION update_delivery_address_timestamp();

CREATE TRIGGER update_featured_purchase_methods_timestamp_trigger
    BEFORE UPDATE ON featured_purchase_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_featured_purchase_methods_timestamp();

-- Políticas RLS
ALTER TABLE party_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_address ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_purchase_methods ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Anyone can read party owners" ON party_owners
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read delivery address" ON delivery_address
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read featured purchase methods" ON featured_purchase_methods
    FOR SELECT USING (is_active = true);

-- Políticas de escrita para admins
CREATE POLICY "Only admins can modify party owners" ON party_owners
    FOR ALL USING (true);

CREATE POLICY "Only admins can modify delivery address" ON delivery_address
    FOR ALL USING (true);

CREATE POLICY "Only admins can modify featured purchase methods" ON featured_purchase_methods
    FOR ALL USING (true);

-- Índices para performance
CREATE INDEX idx_party_owners_order ON party_owners(order_index);
CREATE INDEX idx_delivery_address_active ON delivery_address(is_active);
CREATE INDEX idx_featured_purchase_methods_active ON featured_purchase_methods(is_active);
CREATE INDEX idx_featured_purchase_methods_order ON featured_purchase_methods(order_index);
