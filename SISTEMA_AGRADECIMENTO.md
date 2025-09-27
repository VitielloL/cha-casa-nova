# 🎉 Sistema de Agradecimento WhatsApp

## 📋 Visão Geral

Sistema completo para envio de mensagens de agradecimento via WhatsApp quando produtos são recebidos, com validação de números e mensagens configuráveis.

## 🚀 Funcionalidades

### ✅ **Validação de Números**
- **Indicador de país**: Suporte para códigos de país (55 para Brasil, 1 para EUA, etc.)
- **Formatação automática**: Converte números locais para formato internacional
- **Validação**: Verifica se o número é válido para WhatsApp
- **Teste rápido**: Botão para testar números antes de salvar

### ✅ **Mensagens Configuráveis**
- **Placeholders**: Use `{{PRODUCT_NAME}}` para incluir o nome do produto
- **Personalização**: Mensagem totalmente editável pelo admin
- **Preview**: Visualização da mensagem formatada

### ✅ **Botão de Agradecimento**
- **Automático**: Aparece quando produto é marcado como "recebido"
- **Inteligente**: Só aparece se houver contato da pessoa
- **Direto**: Abre WhatsApp com mensagem pré-formatada

## 📁 Arquivos Criados

### **Scripts SQL**
- `scriptsSql/07_add_thank_you_config.sql` - Tabela de configurações

### **Componentes**
- `components/WhatsAppConfig.tsx` - Interface de configuração
- `lib/whatsappUtils.ts` - Utilitários de validação e formatação

### **Páginas**
- `app/admin/configuracoes/page.tsx` - Página de configurações
- `app/admin/reservas/page.tsx` - Atualizada com botão de agradecimento

## 🔧 Como Usar

### **1. Configurar Números**
1. Acesse `/admin/configuracoes`
2. Digite o **número principal** (ex: `5521986189443`)
3. Digite o **número do admin** para dúvidas
4. Clique em "Testar" para verificar se funciona

### **2. Configurar Mensagem**
1. Na mesma página, edite a **mensagem de agradecimento**
2. Use `{{PRODUCT_NAME}}` onde quiser o nome do produto
3. Exemplo: `"Oi! Obrigado(a) pelo presente! Recebi o produto {{PRODUCT_NAME}} e estou muito feliz! 🎉"`

### **3. Enviar Agradecimento**
1. No painel `/admin/reservas`
2. Marque um produto como "recebido"
3. Clique em "Enviar Agradecimento"
4. WhatsApp abre com mensagem formatada

## 📱 Exemplo de Uso

### **Número de Entrada:**
```
21986189443
```

### **Número Formatado:**
```
+55 21 98618-9443
```

### **Mensagem Configurada:**
```
Oi! Obrigado(a) pelo presente! Recebi o produto {{PRODUCT_NAME}} e estou muito feliz! 🎉
```

### **Mensagem Final:**
```
Oi! Obrigado(a) pelo presente! Recebi o produto Jogo de Pratos e estou muito feliz! 🎉
```

### **URL WhatsApp:**
```
https://wa.me/5521986189443?text=Oi!%20Obrigado(a)%20pelo%20presente!%20Recebi%20o%20produto%20Jogo%20de%20Pratos%20e%20estou%20muito%20feliz!%20🎉
```

## 🌍 Suporte a Países

### **Códigos Suportados:**
- 🇧🇷 **Brasil**: `55`
- 🇺🇸 **EUA**: `1`
- 🇦🇷 **Argentina**: `54`
- 🇨🇱 **Chile**: `56`
- 🇨🇴 **Colômbia**: `57`
- 🇲🇽 **México**: `52`
- 🇵🇪 **Peru**: `51`
- 🇺🇾 **Uruguai**: `598`
- 🇵🇾 **Paraguai**: `595`
- 🇧🇴 **Bolívia**: `591`
- 🇪🇨 **Equador**: `593`
- 🇻🇪 **Venezuela**: `58`
- 🇵🇹 **Portugal**: `351`
- 🇪🇸 **Espanha**: `34`
- 🇫🇷 **França**: `33`
- 🇩🇪 **Alemanha**: `49`
- 🇮🇹 **Itália**: `39`
- 🇬🇧 **Reino Unido**: `44`

## ⚙️ Configuração Técnica

### **Tabela `app_config`:**
```sql
CREATE TABLE app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Configurações Padrão:**
- `whatsapp_number`: Número principal para agradecimentos
- `thank_you_message`: Mensagem de agradecimento
- `admin_whatsapp_number`: Número do admin para dúvidas

## 🔒 Segurança

- **Validação**: Números são validados antes de salvar
- **RLS**: Políticas de segurança no Supabase
- **Sanitização**: Entrada é limpa e validada
- **Permissões**: Apenas admins podem configurar

## 🎯 Benefícios

1. **Automatização**: Agradecimentos automáticos
2. **Personalização**: Mensagens únicas por produto
3. **Validação**: Números sempre corretos
4. **Facilidade**: Interface simples e intuitiva
5. **Flexibilidade**: Suporte a múltiplos países
6. **Eficiência**: Um clique para enviar agradecimento

## 🚀 Próximos Passos

1. Execute o script SQL `07_add_thank_you_config.sql`
2. Configure números e mensagem em `/admin/configuracoes`
3. Teste o sistema marcando um produto como recebido
4. Envie agradecimentos com um clique!

---

**Sistema 100% funcional e pronto para uso!** 🎉
