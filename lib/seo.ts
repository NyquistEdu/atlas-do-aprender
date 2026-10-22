/** Endereço oficial do site, usado em links canônicos, sitemap e dados estruturados. */
export const SITE = "https://www.atlasdoaprender.com.br";
export const NOME = "Atlas do Aprender";
export const url = (path = "/") => `${SITE}${path === "/" ? "" : path}`;

/** Script de dados estruturados (schema.org) para o Google. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
