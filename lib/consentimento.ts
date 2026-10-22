/**
 * Fase 1 dos anúncios: medir tudo, sem aviso de cookies.
 * false → Google Analytics e Pixel da Meta carregam para todos, sem aviso; a página de Privacidade
 *         e o botão "Preferências de cookies" ficam fora do ar.
 * true  → volta ao modelo com consentimento (aviso, Privacidade e preferências no rodapé).
 * Para restaurar, basta trocar para true.
 */
export const PEDIR_CONSENTIMENTO = false;
