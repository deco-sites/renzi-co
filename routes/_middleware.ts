import { FreshContext } from "$fresh/server.ts";


export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  // Continua para a próxima rota para obter a resposta original
  const response = await ctx.next();

  // Define o cabeçalho Content-Security-Policy para permitir a incorporação
  // pelo seu próprio domínio ('self') e pelo painel da deco.cx.
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://deco.cx;",
  );

  return response;
}
