import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  // Continua o processamento normal da requisição para gerar a página
  const resp = await ctx.next();

  // --- Sites que podem incorporar esta página ---
  // Adicione todas as URLs permitidas, separadas por espaço.
  const allowedAncestors = [
    "https://localhost--renzi-co.deco.site",
    "https://localhost--renzi-co.deco.site/",
    "https://deco-sites-renzi-co--task11973.deno.dev/",
    "https://deco-sites-renzi-co--task11973.deno.dev",
    "https://sites-renzi-co--vdqi85.decocdn.com",
    "https://sites-renzi-co--vdqi85.decocdn.com/",
    "https://u10pfz-mz.myshopify.com",
    "https://u10pfz-mz.myshopify.com/",
  ].join(" "); // O método join() vai criar a string separada por espaço

  // Define o cabeçalho de segurança para permitir que o domínio acima incorpore esta página
  resp.headers.set(
    "Content-Security-Policy",
    `frame-ancestors ${allowedAncestors};`
  );

  // Retorna a resposta com o novo cabeçalho
  return resp;
}