import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "Atlas do Aprender", template: "%s · Atlas do Aprender" },
  description:
    "Trilhas de Português, Matemática e Ciências da alfabetização ao 5º ano, com livros, jogos, experimentos e diário de aprendizagem. Criado por Stephanie Kamarry.",
  authors: [{ name: "Stephanie Kamarry" }],
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const tema = `try{var t=localStorage.getItem("tema");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: tema }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
