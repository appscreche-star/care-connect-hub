

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
- Sidebar fixa à esquerda com menu: Visão Geral, Turmas, Alunos, Educadores, Saúde, Configurações
- Header com sino de notificações (Sheet lateral com histórico)

### Páginas
1. **Dashboard** (`/admin/dashboard`): Cards resumo (total alunos, turmas, educadores), atividade recente, widgets de ocupação.
2. **Turmas** (`/admin/turmas`): Tabela CRUD com capacidade, faixa etária e alertas visuais de lotação e falta de regente.
3. **Alunos** (`/admin/alunos`): Prontuário digital completo com abas para Dados/Saúde, Família (múltiplos responsáveis) e Pessoas Autorizadas para Retirada. Validação de responsável financeiro.
4. **Educadores** (`/admin/educadores`): Gestão de RH completa com filtros por turno/especialidade, campos de CPF, formação acadêmica e contato de emergência.
5. **Saúde** (`/admin/saude`): Módulo de agendamento de medicamentos, livro de ocorrências/acidentes e controle de vacinação.
6. **Configurações** (`/admin/configuracoes`): Upload de logotipo + seletor de cor hexadecimal que atualiza `--primary` em tempo real.

---

## Fase 3: Área do Educador (Mobile-first)

### Layout
- Header simples com nome da turma e ícone offline
- Sem sidebar — navegação por cards e botão voltar

### Páginas
1. **Home da Turma** (`/educador/turma`): Grid de cards com foto e nome de cada aluno. Botão flutuante "Ação em Lote" (ex: marcar alimentação para todos).
2. **Perfil do Aluno** (`/educador/aluno/:id`): Painel com botões grandes de ícone organizados em grid:
   - **Presença**: Toggle Check-in / Check-out
   - **Bem-estar**: 4 ícones (Feliz, Tranquilo, Cansado, Manhosos)
   - **Alimentação**: 3 opções rápidas + ml
   - **Sono**: Botões Início/Fim
   - **Evacuação**: Botões Fralda Seca, Xixi, Cocô
   - **Saúde**: Lista de remédios cadastrados + botão check de administração.

---

## Rotas
- `/login`
- `/admin/dashboard`, `/admin/turmas`, `/admin/alunos`, `/admin/educadores`, `/admin/saude`, `/admin/configuracoes`
- `/educador/turma`, `/educador/aluno/:id`
- `/pais/hoje`, `/pais/galeria`, `/pais/mochila`, `/pais/calendario`

