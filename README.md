# Portfólio — Gustavo Albuquerque

Site de portfólio profissional feito com Next.js 16, Tailwind CSS 4 e TypeScript, exportado como site estático.

## Editando o conteúdo

Todo o conteúdo fica em `src/content/`:

| Arquivo | O que contém |
| --- | --- |
| `profile.ts` | Nome, e-mail, links sociais, caminho do CV e foto (dados que não mudam por idioma) |
| `pt.ts` / `en.ts` | Textos em português e inglês (hero, sobre, skills, projetos, experiência, contato) |

Os dois idiomas precisam ter a mesma estrutura — um teste garante isso.

- **CV:** substitua `public/cv.pdf`.
- **Foto:** coloque a imagem em `public/` e defina `photoUrl: "/sua-foto.jpg"` em `profile.ts`.

## Scripts

```bash
npm run dev         # servidor de desenvolvimento (http://localhost:3000)
npm test            # testes (Vitest + Testing Library)
npm run test:watch  # testes em modo watch
npm run lint        # ESLint
npm run build       # gera o site estático em out/
```

## Deploy

O `npm run build` gera a pasta `out/`, que pode ser publicada em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
