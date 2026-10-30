import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SITE, jsonLd } from "@/lib/seo";

const DESC = "Atividades para crianças da alfabetização ao 5º ano: trilhas de Português, Matemática e Ciências alinhadas à BNCC, livros infantis, jogos, experimentos, apostilas para imprimir e diário de aprendizagem. Gratuito.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Atlas do Aprender · atividades, livros e jogos da alfabetização ao 5º ano", template: "%s · Atlas do Aprender" },
  description: DESC,
  applicationName: "Atlas do Aprender",
  authors: [{ name: "Stephanie Kamarry" }],
  creator: "Stephanie Kamarry",
  keywords: ["atividades para crianças", "alfabetização", "atividades 1º ano", "atividades 3º ano", "BNCC", "homeschooling", "educação domiciliar", "livros infantis", "paradidáticos", "jogos educativos", "experimentos para crianças", "apostila para imprimir", "reforço escolar"],
  openGraph: { type: "website", locale: "pt_BR", siteName: "Atlas do Aprender", title: "Atlas do Aprender", description: DESC, images: [{ url: "/og.png", width: 1200, height: 630, alt: "Atlas do Aprender" }] },
  twitter: { card: "summary_large_image", title: "Atlas do Aprender", description: DESC, images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  category: "education",
  verification: { google: "ZS7mXHNp0CLZ-B_OHIzd_YjPMHhrHnpK5899w4tuslQ" },
  // Verificação do domínio no Gerenciador de Negócios da Meta (portfólio Ada).
  other: { "facebook-domain-verification": "zcgy8bgim3uv2f5aqv35e08jxqy3r9" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const tema = `try{var t=localStorage.getItem("tema");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: tema }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "Atlas do Aprender", inLanguage: "pt-BR", description: DESC, publisher: { "@id": `${SITE}/#org` } },
            { "@type": "Organization", "@id": `${SITE}/#org`, name: "Atlas do Aprender", url: SITE, logo: `${SITE}/logo.png`, founder: { "@type": "Person", name: "Stephanie Kamarry" }, sameAs: ["https://www.instagram.com/stephaniekamarry"] },
          ],
        })} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Caveat:wght@700&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </Providers>
        <VercelAnalytics />
      </body>
    </html>
  );
}
