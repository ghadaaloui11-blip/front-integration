/** Source unique des categories cote frontend (alignee sur le backend). */

export const CATEGORIES_EVENEMENT: readonly string[] = [
  'Distribution alimentaire',
  'Maraude solidaire',
  'Collecte de dons',
  'Aide aux devoirs',
  'Nettoyage écologique',
  'Visite aux personnes isolées',
  'Autre',
];

export const CATEGORIES_SIGNALEMENT: readonly string[] = [
  'Environnement',
  'Infrastructure',
  'Santé',
  'Éducation',
  'Social',
  'Urgence',
  'Autre',
];

export const CATEGORIES_CAMPAGNE: readonly string[] = [
  'Environnement',
  'Social',
  'Santé',
  'Éducation',
  'Urgence',
  'Autre',
];

/** Les associations utilisent la meme typologie que les campagnes. */
export const CATEGORIES_ASSOCIATION: readonly string[] = CATEGORIES_CAMPAGNE;
