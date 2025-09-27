# 🛒 Sistema de Múltiplos Meios de Compra

## 🎯 Visão Geral

Sistema avançado onde cada produto pode ter múltiplos meios de compra, com um principal em destaque e outros secundários. Suporta diferentes tipos: links, endereços, telefones, emails, fotos e textos.

## ✨ Funcionalidades Implementadas

### ✅ **Múltiplos Meios por Produto**
- ✅ **Meio principal**: Aparece em destaque com badge especial
- ✅ **Meios secundários**: Lista expansível com botão "Ver outros meios"
- ✅ **Tipos flexíveis**: Link, endereço, telefone, email, foto, texto
- ✅ **Ordem personalizável**: Admin define ordem de exibição

### ✅ **Tipos de Meios Suportados**
- ✅ **Link**: Abre em nova aba
- ✅ **Endereço**: Abre no Google Maps
- ✅ **Telefone**: Abre app de ligação
- ✅ **Email**: Abre cliente de email
- ✅ **Foto**: Abre imagem em nova aba
- ✅ **Texto**: Copia para clipboard

### ✅ **Interface Inteligente**
- ✅ **Meio principal destacado**: Badge com benefício e botão maior
- ✅ **Meios secundários colapsáveis**: Botão para expandir/recolher
- ✅ **Ícones específicos**: Cada tipo tem seu ícone
- ✅ **Cores personalizáveis**: Admin escolhe cor de cada meio

### ✅ **Sistema de Administração**
- ✅ **Interface completa**: Gerenciar meios por produto
- ✅ **Seleção de principal**: Apenas um meio principal por produto
- ✅ **Validação automática**: Garante apenas um principal
- ✅ **CRUD completo**: Criar, editar, excluir meios

## 📁 Arquivos Criados/Modificados

### **Scripts SQL**
- `11_add_multiple_purchase_methods.sql` - Nova tabela `product_purchase_methods`

### **Componentes**
- `ProductPurchaseMethods.tsx` - Componente principal para exibir meios
- `PreferredPurchaseMethod.tsx` - Removido (substituído)

### **Páginas**
- `app/admin/produtos-meios/page.tsx` - Interface de administração
- `app/categoria/[id]/page.tsx` - Atualizada para usar novo sistema
- `app/admin/page.tsx` - Adicionado link para gerenciar meios

### **Tipos**
- `lib/supabase.ts` - Nova interface `ProductPurchaseMethod`

## 🎨 Como Funciona

### **Para Usuários:**
1. **Veem meio principal** em destaque com benefício
2. **Clicam "Ver outros meios"** para ver opções adicionais
3. **Escolhem o meio** que preferir para comprar
4. **Ganham benefícios** específicos de cada meio

### **Para Administradores:**
1. **Acessam** `/admin/produtos-meios`
2. **Selecionam produto** da lista
3. **Adicionam meios** de compra específicos
4. **Definem qual é principal** (apenas um por produto)
5. **Configuram tipos** e conteúdos

## 🛒 Exemplo de Uso

### **Produto: Jogo de Pratos**

**Meio Principal:**
- **Nome**: Magazine Luiza
- **Tipo**: Link
- **Conteúdo**: https://www.magazineluiza.com.br
- **Benefício**: "2x mais pontos Luiza"
- **Cor**: Roxa
- **Ícone**: 🛒

**Meios Secundários:**
1. **Loja Física** (Endereço) - Rua das Flores, 123
2. **WhatsApp** (Telefone) - 11999887766
3. **Email** (Email) - contato@loja.com
4. **Catálogo** (Foto) - link para PDF

## 🎯 Tipos de Meios

### **Link** 🔗
- **Uso**: Sites de compra online
- **Ação**: Abre em nova aba
- **Exemplo**: Magazine Luiza, Americanas

### **Endereço** 📍
- **Uso**: Lojas físicas
- **Ação**: Abre no Google Maps
- **Exemplo**: Rua das Flores, 123

### **Telefone** 📞
- **Uso**: WhatsApp, ligação direta
- **Ação**: Abre app de ligação
- **Exemplo**: 11999887766

### **Email** 📧
- **Uso**: Contato por email
- **Ação**: Abre cliente de email
- **Exemplo**: contato@loja.com

### **Foto** 📷
- **Uso**: Catálogos, imagens
- **Ação**: Abre imagem em nova aba
- **Exemplo**: Link para PDF do catálogo

### **Texto** 📝
- **Uso**: Informações, instruções
- **Ação**: Copia para clipboard
- **Exemplo**: "Ligue para 11999887766"

## 🔧 Configuração Técnica

### **Banco de Dados:**
```sql
CREATE TABLE product_purchase_methods (
  id uuid PRIMARY KEY,
  product_id uuid REFERENCES products(id),
  name text NOT NULL,
  type text CHECK (type IN ('link', 'address', 'photo', 'text', 'phone', 'email')),
  content text NOT NULL,
  description text,
  icon text,
  color text DEFAULT 'blue',
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true
);
```

### **Validação de Principal:**
```sql
-- Trigger que garante apenas um meio principal por produto
CREATE FUNCTION ensure_single_primary_purchase_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = true THEN
        UPDATE product_purchase_methods 
        SET is_primary = false 
        WHERE product_id = NEW.product_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## 🎨 Design System

### **Meio Principal:**
- **Badge de benefício**: Gradiente amarelo-laranja
- **Botão maior**: `text-base py-3`
- **Destaque visual**: Cores mais vibrantes

### **Meios Secundários:**
- **Botão menor**: `text-sm py-2`
- **Lista colapsável**: Botão expandir/recolher
- **Ícones específicos**: Por tipo de meio

### **Cores Disponíveis:**
- **Azul**: `bg-blue-500` (padrão)
- **Roxo**: `bg-purple-500`
- **Vermelho**: `bg-red-500`
- **Amarelo**: `bg-yellow-500`
- **Verde**: `bg-green-500`
- **Rosa**: `bg-pink-500`
- **Cinza**: `bg-gray-500`

## 🚀 Para Usar

### **1. Execute o script SQL:**
```sql
scriptsSql/11_add_multiple_purchase_methods.sql
```

### **2. Configure meios de compra:**
- Acesse `/admin/produtos-meios`
- Selecione um produto
- Adicione meios de compra
- Defina qual é o principal

### **3. Teste a interface:**
- Navegue pelas categorias
- Veja meio principal em destaque
- Clique "Ver outros meios"
- Teste diferentes tipos

## 🎉 Benefícios

1. **Flexibilidade total**: Cada produto tem seus meios específicos
2. **Meio principal destacado**: Usuário vê o melhor primeiro
3. **Múltiplas opções**: Usuário escolhe como prefere comprar
4. **Tipos variados**: Links, endereços, telefones, etc.
5. **Interface limpa**: Meios secundários colapsáveis
6. **Administração fácil**: Interface intuitiva para gerenciar

## 📱 Responsividade

- **Mobile-first**: Otimizado para celulares
- **Botões grandes**: Fáceis de tocar
- **Lista expansível**: Não sobrecarrega a tela
- **Ícones claros**: Fáceis de identificar

---

**Sistema 100% funcional com múltiplos meios de compra por produto!** 🛒✨
