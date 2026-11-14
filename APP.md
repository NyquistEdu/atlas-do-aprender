# App do Atlas (Android e iOS)

O app usa o Capacitor e abre o site publicado (`capacitor.config.ts`, campo `server.url`).
Assim, tudo que você publica no site aparece no app sem enviar nova versão às lojas.

- Android: `npx cap open android` (Android Studio) → Build > Generate Signed Bundle (.aab) → Google Play Console.
- iOS: precisa de um Mac com Xcode e conta Apple Developer. `npx cap open ios` → Product > Archive → App Store Connect.
- Depois de mudar `capacitor.config.ts`: `npx cap sync`.
- ID do app: `br.com.atlasdoaprender.app`.
