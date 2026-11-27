/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/kit-observacao", destination: "/olhar-atento", permanent: true }];
  },
  async headers() {
    return [
      // PDFs ficam fora da busca: quem procura cai na página da apostila (que pede a conta grátis)
      // TEMP upload Kiwify
      { source: "/k000ea06c17259967/:f*", headers: [{ key: "Access-Control-Allow-Origin", value: "https://dashboard.kiwify.com.br" }] },
      { source: "/(.*\\.pdf)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
