-- Script para adicionar configurações de agradecimento
-- Execute este script após os scripts anteriores

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS public.app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Inserir configurações padrão
INSERT INTO public.app_config (key, value, description) VALUES
('whatsapp_number', '5521986189443', 'Número do WhatsApp com indicador de país (ex: 5521986189443)'),
('thank_you_message', 'Oi! Obrigado(a) pelo presente! Recebi o produto {{PRODUCT_NAME}} e estou muito feliz! 🎉', 'Mensagem de agradecimento (use {{PRODUCT_NAME}} para nome do produto)'),
('admin_whatsapp_number', '5521986189443', 'Número do WhatsApp do admin para dúvidas')
ON CONFLICT (key) DO NOTHING;

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_app_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_app_config_timestamp_trigger
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_app_config_timestamp();

-- Política RLS para permitir leitura pública
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app config" ON app_config
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update app config" ON app_config
    FOR UPDATE USING (true);
