-- Remover campo antigo de meio preferencial (se existir)
ALTER TABLE products DROP COLUMN IF EXISTS preferred_purchase_method_id;

-- Criar tabela de meios de compra por produto
CREATE TABLE IF NOT EXISTS public.product_purchase_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('link', 'address', 'photo', 'text', 'phone', 'email')),
  content text NOT NULL,
  description text,
  icon text,
  color text DEFAULT 'blue',
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_product_id 
  ON product_purchase_methods(product_id);

CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_is_primary 
  ON product_purchase_methods(is_primary);

CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_order 
  ON product_purchase_methods(order_index);

CREATE INDEX IF NOT EXISTS idx_product_purchase_methods_active 
  ON product_purchase_methods(is_active);

-- Função ensure_single_primary_purchase_method (só cria se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'ensure_single_primary_purchase_method'
    ) THEN
        CREATE FUNCTION ensure_single_primary_purchase_method()
        RETURNS TRIGGER AS $f$
        BEGIN
            IF NEW.is_primary = true THEN
                UPDATE product_purchase_methods 
                SET is_primary = false 
                WHERE product_id = NEW.product_id 
                AND id != NEW.id;
            END IF;
            RETURN NEW;
        END;
        $f$ LANGUAGE plpgsql;
    END IF;
END$$;

-- Trigger ensure_single_primary_purchase_method (só cria se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'ensure_single_primary_purchase_method_trigger'
    ) THEN
        CREATE TRIGGER ensure_single_primary_purchase_method_trigger
            BEFORE INSERT OR UPDATE ON product_purchase_methods
            FOR EACH ROW
            EXECUTE FUNCTION ensure_single_primary_purchase_method();
    END IF;
END$$;

-- Função update_product_purchase_methods_timestamp (só cria se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_product_purchase_methods_timestamp'
    ) THEN
        CREATE FUNCTION update_product_purchase_methods_timestamp()
        RETURNS TRIGGER AS $f$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $f$ LANGUAGE plpgsql;
    END IF;
END$$;

-- Trigger update_product_purchase_methods_timestamp (só cria se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_purchase_methods_timestamp_trigger'
    ) THEN
        CREATE TRIGGER update_product_purchase_methods_timestamp_trigger
            BEFORE UPDATE ON product_purchase_methods
            FOR EACH ROW
            EXECUTE FUNCTION update_product_purchase_methods_timestamp();
    END IF;
END$$;

-- Ativar RLS
ALTER TABLE product_purchase_methods ENABLE ROW LEVEL SECURITY;

-- Criar políticas (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read product purchase methods'
    ) THEN
        CREATE POLICY "Anyone can read product purchase methods" 
            ON product_purchase_methods
            FOR SELECT USING (is_active = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can modify product purchase methods'
    ) THEN
        CREATE POLICY "Only admins can modify product purchase methods" 
            ON product_purchase_methods
            FOR ALL USING (true);
    END IF;
END$$;

-- Inserir exemplos (só se não existirem ainda)
INSERT INTO product_purchase_methods (product_id, name, type, content, description, icon, color, is_primary, order_index) 
SELECT 
  p.id,
  'Magazine Luiza',
  'link',
  'https://www.magazineluiza.com.br',
  'Compre com segurança e receba em casa',
  '🛒',
  'purple',
  true,
  1
FROM products p 
WHERE p.name = 'Jogo de Pratos'
AND NOT EXISTS (
    SELECT 1 FROM product_purchase_methods ppm 
    WHERE ppm.product_id = p.id AND ppm.name = 'Magazine Luiza'
)
LIMIT 1;

INSERT INTO product_purchase_methods (product_id, name, type, content, description, icon, color, is_primary, order_index) 
SELECT 
  p.id,
  'Loja Física - Casa & Cia',
  'address',
  'Rua das Flores, 123 - Centro - São Paulo/SP',
  'Visite nossa loja física',
  '🏪',
  'green',
  false,
  2
FROM products p 
WHERE p.name = 'Jogo de Pratos'
AND NOT EXISTS (
    SELECT 1 FROM product_purchase_methods ppm 
    WHERE ppm.product_id = p.id AND ppm.name = 'Loja Física - Casa & Cia'
)
LIMIT 1;

-- Comentários explicativos (só se ainda não existirem)
COMMENT ON TABLE product_purchase_methods IS 'Meios de compra específicos para cada produto';
COMMENT ON COLUMN product_purchase_methods.type IS 'Tipo do meio: link, address, photo, text, phone, email';
COMMENT ON COLUMN product_purchase_methods.content IS 'Conteúdo específico: URL, endereço, texto, etc.';
COMMENT ON COLUMN product_purchase_methods.is_primary IS 'Se é o meio principal (apenas um por produto)';
