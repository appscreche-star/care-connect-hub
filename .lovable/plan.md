

# Plano: Corrigir logo e nome na tela de login

## Problema
A tela de login ainda mostra "Elo Creche" e a logo não aparece corretamente. O código em `AuthContext.tsx` já tem o nome correto ("Escola ABC da Criança"), mas a imagem pode não ter sido salva corretamente ou o formato está errado.

## Alterações

1. **Copiar a nova imagem** (`user-uploads://360029951_766779905226815_8058445071438461323_n_1.png`) para `public/images/logo-escola.png`

2. **`src/contexts/AuthContext.tsx`** — Atualizar `logo_url` de `/images/logo-escola.jpg` para `/images/logo-escola.png`

3. **`src/pages/Login.tsx`** — Aumentar o container da logo para acomodar melhor a nova imagem (que tem 3 personagens e é mais larga), ex: `h-32 w-32` no container e `h-28 w-28` no `<img>`

