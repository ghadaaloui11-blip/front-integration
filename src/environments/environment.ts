/**
 * Configuration de developpement (utilisee par ng serve et ng build par defaut).
 * Le backend Express tourne sur le port 5000 en local.
 */
export const environment = {
  /** URL de base de l'API. Surchargeable au demarrage via window.__API_BASE__. */
  apiBase: 'http://localhost:5000',
   googleClientId: '392355876241-20biprsuqnumps0end23534p2h30hl39.apps.googleusercontent.com'
};
