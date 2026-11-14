import type { CapacitorConfig } from "@capacitor/cli";

// O app carrega o site publicado: qualquer atualização no Atlas aparece no app
// sem precisar enviar nova versão para as lojas.
const config: CapacitorConfig = {
  appId: "br.com.atlasdoaprender.app",
  appName: "Atlas do Aprender",
  webDir: "mobile/www",
  server: {
    url: "https://www.atlasdoaprender.com.br/?origem=app",
    cleartext: false,
    allowNavigation: ["www.atlasdoaprender.com.br", "*.supabase.co"],
  },
  ios: { contentInset: "always", backgroundColor: "#FFF8EC" },
  android: { backgroundColor: "#FFF8EC" },
};

export default config;
