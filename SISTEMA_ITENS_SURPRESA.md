# 🎁 Sistema de Itens Surpresa

## 🎯 Visão Geral

Sistema completo que permite aos convidados enviarem itens surpresa personalizados para os anfitriões, com opção de anonimato total e diferentes níveis de informação.

## ✨ Funcionalidades Implementadas

### ✅ **Sistema de Itens Surpresa**
- ✅ **Envio anônimo**: Opção de manter mistério total
- ✅ **Informações flexíveis**: Pode dar dicas ou deixar surpresa completa
- ✅ **Categorização**: Sugestão de categoria pelo usuário
- ✅ **Tipos de item**: Principal ou adicional
- ✅ **Visibilidade controlada**: Admin pode ocultar itens

### ✅ **Interface de Usuário**
- ✅ **Página de envio**: `/item-surpresa` - Formulário intuitivo
- ✅ **Página de visualização**: `/itens-surpresa` - Lista todos os itens
- ✅ **Modo detetive**: Ícones especiais para itens anônimos
- ✅ **Estatísticas**: Contadores de itens por tipo

### ✅ **Sistema de Administração**
- ✅ **Gerenciamento completo**: `/admin/itens-surpresa`
- ✅ **Controle de visibilidade**: Mostrar/ocultar itens
- ✅ **Notas internas**: Admin pode adicionar observações
- ✅ **Status de reserva**: Gerenciar recebimento
- ✅ **Exclusão**: Remover itens se necessário

### ✅ **Integração com Progresso**
- ✅ **Barra de progresso**: Inclui itens surpresa nas estatísticas
- ✅ **Cálculo automático**: Percentual de recebimento
- ✅ **Resumo geral**: Total de reservados e recebidos

## 📁 Arquivos Criados/Modificados

### **Scripts SQL**
- `12_add_surprise_items.sql` - Nova tabela `surprise_items`

### **Páginas**
- `app/item-surpresa/page.tsx` - Envio de itens surpresa
- `app/itens-surpresa/page.tsx` - Visualização pública
- `app/admin/itens-surpresa/page.tsx` - Administração

### **Componentes**
- `ProgressBars.tsx` - Atualizado para incluir itens surpresa

### **Tipos**
- `lib/supabase.ts` - Nova interface `SurpriseItem`

### **Navegação**
- `app/page.tsx` - Links para itens surpresa (condicionais)

## 🎨 Como Funciona

### **Para Convidados:**

#### **1. Enviar Item Surpresa**
- Acessam `/item-surpresa`
- Preenchem formulário com:
  - **Nome**: Pode ser genérico ("Item Surpresa")
  - **Descrição**: Opcional, pode dar dicas ou deixar vazio
  - **Categoria**: Sugestão (Cozinha, Sala, etc.)
  - **Tipo**: Principal ou Adicional
  - **Anônimo**: Checkbox para mistério total

#### **2. Ver Itens Surpresa**
- Acessam `/itens-surpresa`
- Veem lista de todos os itens enviados
- Itens anônimos aparecem como "Item Misterioso"
- Estatísticas de quantos foram enviados

### **Para Administradores:**

#### **1. Gerenciar Itens**
- Acessam `/admin/itens-surpresa`
- Veem todos os itens (visíveis e ocultos)
- Podem:
  - Marcar como recebido
  - Cancelar item
  - Ocultar/mostrar
  - Adicionar notas internas
  - Excluir item

#### **2. Controle de Visibilidade**
- Itens podem ser ocultados da visualização pública
- Útil para itens inapropriados ou duplicados
- Admin mantém controle total

## 🎯 Tipos de Itens Surpresa

### **Surpresa Total** 🕵️
- **Nome**: "Item Misterioso"
- **Descrição**: Vazia
- **Anônimo**: Sim
- **Resultado**: Mistério completo!

### **Dica Sutil** 💡
- **Nome**: "Presente Especial"
- **Descrição**: "Algo que vai fazer a diferença na casa nova"
- **Anônimo**: Não
- **Resultado**: Pista sem revelar

### **Informação Completa** 📝
- **Nome**: "Jogo de Pratos"
- **Descrição**: "Conjunto completo de 12 peças"
- **Anônimo**: Não
- **Resultado**: Informação total

### **Surpresa em Grupo** 👥
- **Nome**: "Item Misterioso"
- **Descrição**: "Presente coletivo da família"
- **Anônimo**: Sim
- **Resultado**: Mistério compartilhado

## 🔧 Configuração Técnica

### **Banco de Dados:**
```sql
CREATE TABLE surprise_items (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text,
  is_anonymous boolean DEFAULT false,
  reserved_by text,
  reserved_contact text,
  reservation_status text DEFAULT 'available',
  item_type text DEFAULT 'adicional',
  is_visible boolean DEFAULT true,
  admin_notes text,
  received_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Políticas RLS:**
- **Leitura pública**: Apenas itens visíveis
- **Escrita**: Apenas admins
- **Controle total**: Admin pode gerenciar tudo

## 🎨 Design System

### **Modo Detetive** 🕵️
- **Ícone**: `EyeOff` (olho fechado)
- **Título**: "Item Misterioso"
- **Badge**: "Modo Detetive"
- **Cor**: Cinza para mistério

### **Modo Normal** 🎁
- **Ícone**: `Gift` (presente)
- **Título**: Nome do item
- **Informações**: Descrição e categoria
- **Cor**: Rosa para destaque

### **Status de Reserva**
- **Disponível**: Verde
- **Reservado**: Amarelo
- **Recebido**: Azul
- **Cancelado**: Vermelho

## 🚀 Para Usar

### **1. Execute o script SQL:**
```sql
scriptsSql/12_add_surprise_items.sql
```

### **2. Teste o sistema:**
- Acesse `/item-surpresa`
- Envie um item surpresa
- Veja em `/itens-surpresa`
- Gerencie em `/admin/itens-surpresa`

### **3. Configure visibilidade:**
- Admin pode ocultar itens inapropriados
- Itens ocultos não aparecem na lista pública
- Admin mantém controle total

## 🎉 Benefícios

1. **Flexibilidade total**: Cada convidado escolhe o nível de mistério
2. **Anonimato opcional**: Perfeito para surpresas em grupo
3. **Informações graduais**: De surpresa total a informação completa
4. **Controle administrativo**: Admin gerencia visibilidade e status
5. **Integração completa**: Incluído nas barras de progresso
6. **Interface intuitiva**: Fácil de usar para todos

## 📱 Responsividade

- **Mobile-first**: Otimizado para celulares
- **Formulário simples**: Campos claros e objetivos
- **Navegação fácil**: Botões grandes e intuitivos
- **Feedback visual**: Confirmações e status claros

## 🔒 Segurança

- **RLS ativo**: Controle de acesso por nível
- **Validação de dados**: Campos obrigatórios
- **Sanitização**: Prevenção de XSS
- **Controle de visibilidade**: Admin decide o que é público

---

**Sistema 100% funcional para itens surpresa personalizados!** 🎁✨
