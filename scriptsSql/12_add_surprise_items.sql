-- Script para sistema de itens surpresa para anfitriões
-- Execute este script após os scripts anteriores

-- Criar tabela de itens surpresa
CREATE TABLE IF NOT EXISTS public.surprise_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text, -- Categoria sugerida pelo usuário
  is_anonymous boolean DEFAULT false,
  reserved_by text,
  reserved_contact text,
  reservation_status text DEFAULT 'available' CHECK (reservation_status IN ('available', 'reserved', 'received', 'cancelled')),
  item_type text DEFAULT 'adicional' CHECK (item_type IN ('principal', 'adicional')),
  is_visible boolean DEFAULT true, -- Admin pode ocultar itens
  admin_notes text, -- Notas do admin sobre o item
  received_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar índices para performance
CREATE INDEX idx_surprise_items_reservation_status ON surprise_items(reservation_status);
CREATE INDEX idx_surprise_items_item_type ON surprise_items(item_type);
CREATE INDEX idx_surprise_items_is_visible ON surprise_items(is_visible);
CREATE INDEX idx_surprise_items_created_at ON surprise_items(created_at);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_surprise_items_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp
CREATE TRIGGER update_surprise_items_timestamp_trigger
    BEFORE UPDATE ON surprise_items
    FOR EACH ROW
    EXECUTE FUNCTION update_surprise_items_timestamp();

-- Políticas RLS
ALTER TABLE surprise_items ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública (apenas itens visíveis)
CREATE POLICY "Anyone can read visible surprise items" ON surprise_items
    FOR SELECT USING (is_visible = true);

-- Políticas de escrita para admins
CREATE POLICY "Only admins can modify surprise items" ON surprise_items
    FOR ALL USING (true);

-- Inserir alguns exemplos de itens surpresa
INSERT INTO surprise_items (name, description, category, is_anonymous, item_type) VALUES
('Item Misterioso #1', 'Uma surpresa especial para os anfitriões!', 'Cozinha', true, 'adicional'),
('Presente Especial', 'Algo que vai fazer a diferença na casa nova', 'Sala', false, 'principal'),
('Surpresa Secreta', 'Nem eu sei o que é, mas vai ser incrível!', 'Quarto', true, 'adicional');

-- Comentários explicativos
COMMENT ON TABLE surprise_items IS 'Itens surpresa enviados por convidados para os anfitriões';
COMMENT ON COLUMN surprise_items.name IS 'Nome do item (pode ser genérico para surpresa)';
COMMENT ON COLUMN surprise_items.description IS 'Descrição opcional do item';
COMMENT ON COLUMN surprise_items.category IS 'Categoria sugerida pelo usuário';
COMMENT ON COLUMN surprise_items.is_anonymous IS 'Se o item foi enviado anonimamente';
COMMENT ON COLUMN surprise_items.is_visible IS 'Se o item está visível para todos';
COMMENT ON COLUMN surprise_items.admin_notes IS 'Notas internas do admin sobre o item';
