# ✅ Checklist - Primeira Execução

Use este checklist para configurar o sistema rapidamente.

## 🗄️ Banco de Dados (Supabase)

- [ ] **Criar projeto no Supabase**
  - [ ] Nome: `chacasanova`
  - [ ] Senha forte para o banco
  - [ ] Região escolhida

- [ ] **Executar script SQL**
  - [ ] Abrir SQL Editor no Supabase
  - [ ] Executar `scriptsSql/00_SETUP_INICIAL_COMPLETO.sql`
  - [ ] Verificar se todas as tabelas foram criadas
  - [ ] Confirmar inserção do admin padrão

- [ ] **Obter credenciais**
  - [ ] Project URL copiado
  - [ ] Anon key copiado

## 💻 Frontend

- [ ] **Instalar dependências**
  ```bash
  cd frontend
  npm install
  ```

- [ ] **Configurar variáveis de ambiente**
  - [ ] Copiar `env.example` para `.env.local`
  - [ ] Adicionar `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Adicionar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Adicionar `NEXT_PUBLIC_WHATSAPP_NUMBER` (opcional)

- [ ] **Executar projeto**
  ```bash
  npm run dev
  ```
  - [ ] Acessar `http://localhost:3000`
  - [ ] Verificar se carrega sem erros

## 🔐 Primeiro Acesso

- [ ] **Fazer login**
  - [ ] Acessar `/login`
  - [ ] Email: `admin@chacasanova.com`
  - [ ] Senha: `admin123`
  - [ ] Verificar se entra no painel admin

## ⚙️ Configurações Básicas

- [ ] **Configurar WhatsApp**
  - [ ] Ir para Configurações
  - [ ] Adicionar número principal
  - [ ] Adicionar número do admin
  - [ ] Personalizar mensagem de agradecimento
  - [ ] Salvar configurações

- [ ] **Adicionar anfitriões**
  - [ ] Ir para Admin → Anfitriões
  - [ ] Adicionar nome dos noivos
  - [ ] Adicionar biografia
  - [ ] Definir relacionamento

- [ ] **Configurar endereço de entrega**
  - [ ] Ir para Admin → Endereço de Entrega
  - [ ] Adicionar endereço completo
  - [ ] Adicionar instruções
  - [ ] Adicionar contato

## 🛍️ Produtos e Categorias

- [ ] **Verificar categorias padrão**
  - [ ] Cozinha
  - [ ] Quarto
  - [ ] Sala
  - [ ] Banheiro
  - [ ] Lavanderia
  - [ ] Jardim
  - [ ] Outros

- [ ] **Adicionar primeiro produto**
  - [ ] Ir para Admin → Produtos
  - [ ] Clicar em "Adicionar Produto"
  - [ ] Preencher nome e descrição
  - [ ] Escolher categoria
  - [ ] Adicionar foto (opcional)
  - [ ] Salvar produto

## 🧪 Teste de Funcionamento

- [ ] **Teste de reserva**
  - [ ] Acessar página inicial
  - [ ] Clicar em uma categoria
  - [ ] Reservar um produto
  - [ ] Verificar se aparece no admin

- [ ] **Teste de WhatsApp**
  - [ ] Clicar no botão de dúvidas
  - [ ] Verificar se abre WhatsApp
  - [ ] Verificar se mensagem está correta

- [ ] **Teste de agradecimento**
  - [ ] No admin, marcar produto como "Recebido"
  - [ ] Clicar em "Enviar Agradecimento"
  - [ ] Verificar se abre WhatsApp com mensagem personalizada

## 🎨 Personalização (Opcional)

- [ ] **Alterar credenciais do admin**
  - [ ] Gerar novo hash de senha
  - [ ] Atualizar no banco de dados

- [ ] **Personalizar visual**
  - [ ] Editar `tailwind.config.js`
  - [ ] Alterar cores e estilos

- [ ] **Adicionar mais produtos**
  - [ ] Usar o painel admin
  - [ ] Adicionar fotos
  - [ ] Configurar métodos de compra

## ✅ Verificação Final

- [ ] **Sistema funcionando completamente**
  - [ ] Página inicial carrega
  - [ ] Categorias aparecem
  - [ ] Produtos podem ser reservados
  - [ ] Admin funciona
  - [ ] WhatsApp integrado
  - [ ] Mensagens personalizadas

- [ ] **Dados de teste**
  - [ ] Pelo menos 3 categorias
  - [ ] Pelo menos 5 produtos
  - [ ] Pelo menos 1 reserva de teste
  - [ ] Configurações salvas

---

## 🚨 Se algo não funcionar:

1. **Verificar logs do console** (F12 no navegador)
2. **Verificar logs do terminal** (onde roda `npm run dev`)
3. **Testar conexão Supabase** (SQL Editor)
4. **Verificar variáveis de ambiente** (`.env.local`)
5. **Executar script SQL novamente** (se necessário)

## 📞 Próximos passos:

- [ ] Testar com usuários reais
- [ ] Adicionar mais produtos
- [ ] Personalizar mensagens
- [ ] Configurar deploy em produção
- [ ] Fazer backup dos dados

---

**🎉 Parabéns! Seu sistema está pronto para uso!**