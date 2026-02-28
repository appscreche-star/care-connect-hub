

# Elo Creche — Plano de Implementação

## Visão Geral
Aplicativo web responsivo de gestão de creches com três áreas distintas (Admin, Educador, Responsável), sistema white-label, dados mockados e navegação completa.

---

## Fase 1: Fundação e Autenticação

### Tela de Login
- Logo da creche centralizado (mockado)
- Campos de e-mail e senha
- 3 botões temporários de acesso rápido: "Entrar como Admin", "Entrar como Educador", "Entrar como Pai"
- Redirecionamento automático por role

### Contexto Global
- Context API para usuário logado (role, nome, instituição)
- Variáveis CSS dinâmicas para white-label (`--primary` configurável)
- Indicador de status online/offline no header (ícone CloudOff)

---

## Fase 2: Área do Administrador (Desktop-first)

### Layout
- Sidebar fixa à esquerda com menu: Visão Geral, Turmas, Alunos, Educadores, Configurações
- Header com sino de notificações (Sheet lateral com histórico)

### Páginas
1. **Dashboard** (`/admin/dashboard`): Cards resumo (total alunos, turmas, educadores), atividade recente
2. **Turmas** (`/admin/turmas`): Tabela CRUD — criar, editar, excluir turmas
3. **Alunos** (`/admin/alunos`): Tabela com foto, nome, turma, ações (editar, vincular responsável)
4. **Educadores** (`/admin/educadores`): Tabela com alocação por turma
5. **Configurações** (`/admin/configuracoes`): Upload de logotipo + seletor de cor hexadecimal que atualiza `--primary` em tempo real

---

## Fase 3: Área do Educador (Mobile-first)

### Layout
- Header simples com nome da turma e ícone offline
- Sem sidebar — navegação por cards e botão voltar

### Páginas
1. **Home da Turma** (`/educador/turma`): Grid de cards com foto e nome de cada aluno. Botão flutuante "Ação em Lote" (ex: marcar alimentação para todos)
2. **Perfil do Aluno** (`/educador/aluno/:id`): Painel com botões grandes de ícone organizados em grid:
   - **Presença**: Toggle Check-in / Check-out
   - **Bem-estar**: 4 ícones (Feliz, Tranquilo, Cansado, Manhoso) — seleção instantânea com toast
   - **Alimentação**: 3 opções rápidas + campo opcional de ml
   - **Sono**: Botões Início/Fim com relógio
   - **Evacuação**: Botões Fralda Seca, Xixi, Cocô (Normal/Alterado)
   - **Mochila**: Botões "Solicitar Fralda/Pomada/Roupa" com modal de confirmação
   - **Álbum**: Upload de foto + legenda + checkbox "Primeira Vez"
   - **Recados**: Caixa de texto para anotações
   - **Saúde**: Lista de remédios cadastrados pelos pais + botão check "Administrado"

---

## Fase 4: Área do Responsável (Mobile-first)

### Layout
- Header com foto da criança, semáforo de bem-estar e botão fixo "Estou Chegando"
- Bottom Navigation: Hoje, Galeria, Saúde/Mochila, Calendário

### Páginas
1. **Hoje** (`/pais/hoje`): Timeline vertical cronológica com ícones coloridos (chegada, alimentação, fralda, sono). Empty state amigável quando não há registros
2. **Galeria** (`/pais/galeria`): Duas abas — "Dia a dia" e "Primeiras Vezes". Grid de fotos com opção de download
3. **Saúde/Mochila** (`/pais/mochila`): Lista de solicitações de reposição + formulário de envio de medicamentos (nome, horário, dosagem)
4. **Calendário** (`/pais/calendario`): Lista de eventos da creche com botão "Salvar no celular" (exporta .ics)

### Notificações
- Sino com badge no header
- Sheet lateral com histórico mockado

---

## Fase 5: Polish e UX

### Feedback Visual
- Toasts verdes de sucesso em todas as ações
- Modais de confirmação para ações sensíveis (solicitar item, marcar medicamento)
- Transições suaves (animate-fade-in, transition-all duration-300) em botões e abas

### Acessibilidade
- Touch targets mínimos de 44x44px em todas as áreas mobile
- Alto contraste textual (slate-900 / slate-600)
- Empty states com ilustrações amigáveis

### Optimistic UI
- Ações refletem sucesso instantaneamente na interface
- Ícone de status de conexão no header

---

## Dados Mockados
- **Instituição**: "Creche Arco-Íris", logo placeholder, cor primária #4F46E5
- **Turmas**: Berçário, Maternal I, Maternal II
- **Alunos**: Joãozinho (2 anos), Maria (1a6m), Pedro (2a3m), Ana (1a8m)
- **Timeline**: Eventos realistas com horários, ícones e cores
- **Notificações**: Solicitação de fralda, cardápio novo, aviso de chegada

## Rotas
- `/login`
- `/admin/dashboard`, `/admin/turmas`, `/admin/alunos`, `/admin/educadores`, `/admin/configuracoes`
- `/educador/turma`, `/educador/aluno/:id`
- `/pais/hoje`, `/pais/galeria`, `/pais/mochila`, `/pais/calendario`

