/**
 * Configuration de production (remplace environment.ts via fileReplacements).
 *
 * Par defaut : la meme origine que le front (l'API est servie derriere un
 * reverse proxy, ex. /api -> backend Express). Pour un backend sur un autre
 * domaine, definir window.__API_BASE__ dans le HTML de deploiement, sans
 * reconstruire l'application.
 */
export const environment = {
  apiBase: '',
};
