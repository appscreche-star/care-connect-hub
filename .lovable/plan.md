

# Plano: Login rápido do Educador usando perfil cadastrado no banco

## Problema
O botão "Entrar como Educador" cria um usuário genérico com `id: '2'` e `nome: 'Professor'`. O usuário quer que use o educador real cadastrado pelo admin no Supabase (da tabela `perfis`).

## Alterações

### 1. `src/contexts/AuthContext.tsx` — Expandir função `login` para aceitar dados completos
- Adicionar sobrecarga: `login(role, userData?)` onde `userData` é opcional com `{id, nome, email}`
- Quando `userData` for passado, usar esses dados em vez dos genéricos

### 2. `src/pages/Login.tsx` — Buscar perfis reais do banco
- Importar `useData` do DataProvider
- Ao clicar "Entrar como Educador", buscar o primeiro perfil com `role === 'Professor'` da lista de `perfis`
- Passar os dados reais (id, nome, email) para a função `login`
- Se não houver educador cadastrado, mostrar toast informando que nenhum educador foi encontrado
- Mesmo tratamento para Admin e Responsável: buscar primeiro perfil com o role correspondente

### 3. `src/pages/educador/HomeEducador.tsx` — Ajustar filtro de turmas
- Remover fallback `|| !t.professor_id` do filtro — mostrar apenas turmas efetivamente vinculadas ao educador logado

## Fluxo Esperado
1. Admin cadastra um educador na tela de Educadores
2. Admin vincula esse educador a turmas na tela de Turmas
3. Na tela de login, "Entrar como Educador" busca esse perfil do banco e loga com seus dados reais
4. HomeEducador filtra e mostra apenas as turmas onde `professor_id` bate com o id do perfil

