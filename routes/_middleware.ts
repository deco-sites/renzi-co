import { FreshContext } from "$fresh/server.ts";

export async function handler(_req: Request, ctx: FreshContext) {
  // Continua o processamento normal da requisição para gerar a página
  const resp = await ctx.next();

  // --- Sites que podem incorporar esta página ---
  // Adicione todas as URLs permitidas, separadas por espaço.
  const allowedAncestors = [
    "https://u10pfz-mz.myshopify.com",
    "*.deco.cx",
    "*.deco.site",
    "*.deno.dev",
    "*.decocdn.com",
  ].join(" "); // O método join() vai criar a string separada por espaço

  // Define o cabeçalho de segurança para permitir que o domínio acima incorpore esta página
  resp.headers.set(
    "Content-Security-Policy",
    `frame-ancestors 'self' ${allowedAncestors};` // Adicionar 'self' é uma boa prática
  );

  // Retorna a resposta com o novo cabeçalho
  return resp;
}