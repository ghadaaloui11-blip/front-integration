/** Navigation unique de l'application : plus aucune liste de liens dupliquée dans les templates. */

export type UtilisateurRole = 'citoyen' | 'association' | 'admin';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  /** Roles autorisés. Absent = disponible pour tous les utilisateurs connectés. */
  roles?: UtilisateurRole[];
}

export interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Découvrir',
    icon: 'bi bi-compass',
    items: [
      { label: 'Recherche', path: '/recherche', icon: 'bi bi-search' },
      { label: "Fil d’actualités", path: '/fil-actualites', icon: 'bi bi-newspaper' },
      { label: 'Campagnes', path: '/campagnes', icon: 'bi bi-megaphone' },
      { label: 'Événements solidaires', path: '/evenements', icon: 'bi bi-calendar-event' },
      { label: 'Défis solidaires', path: '/defis', icon: 'bi bi-trophy' },
      { label: 'Associations', path: '/associations', icon: 'bi bi-buildings' },
    ],
  },
  {
    label: 'Signalements',
    icon: 'bi bi-exclamation-triangle',
    items: [
      { label: 'Signalements publics', path: '/signalements-publics', icon: 'bi bi-list-check' },
      { label: 'Carte des signalements', path: '/signalements-carte', icon: 'bi bi-map' },
      { label: 'Nouveau signalement', path: '/signalement', icon: 'bi bi-plus-circle', roles: ['citoyen'] },
      { label: 'Mes signalements', path: '/mes-signalements', icon: 'bi bi-list-ul', roles: ['citoyen'] },
      { label: 'Signalements reçus', path: '/association-reports', icon: 'bi bi-inbox', roles: ['association'] },
      { label: 'Signaler un contenu abusif', path: '/signaler-abuse', icon: 'bi bi-shield-exclamation' },
      { label: 'Mes signalements de contenu', path: '/mes-signalisations-abuse', icon: 'bi bi-shield' },
    ],
  },
  {
    label: 'Solidarité & dons',
    icon: 'bi bi-heart',
    items: [
      { label: "Demander de l’aide", path: '/demander-aide', icon: 'bi bi-hand-thumbs-up', roles: ['citoyen'] },
      { label: 'Devenir bénévole', path: '/devenir-benevole', icon: 'bi bi-people', roles: ['citoyen'] },
      { label: 'Mes dons', path: '/mes-dons', icon: 'bi bi-cash-coin', roles: ['citoyen'] },
      { label: 'Mes dons récurrents', path: '/mes-dons-recurrents', icon: 'bi bi-arrow-repeat', roles: ['citoyen'] },
      { label: 'Dons en nature', path: '/dons-nature', icon: 'bi bi-gift', roles: ['citoyen'] },
      { label: 'Mes défis', path: '/mes-defis', icon: 'bi bi-star', roles: ['citoyen'] },
    ],
  },
  {
    label: 'Espace association',
    icon: 'bi bi-buildings',
    items: [
      { label: 'Mes campagnes', path: '/mes-campagnes', icon: 'bi bi-megaphone', roles: ['association'] },
      { label: 'Mes événements', path: '/mes-evenements', icon: 'bi bi-calendar-event', roles: ['association'] },
      { label: "Demandes d’aide", path: '/demandes-recues', icon: 'bi bi-inbox', roles: ['association'] },
      { label: 'Mes documents', path: '/mes-documents', icon: 'bi bi-file-earmark-text', roles: ['association'] },
    ],
  },
  {
    label: 'Administration',
    icon: 'bi bi-shield-check',
    items: [
      { label: 'Tableau de bord', path: '/admin/dashboard', icon: 'bi bi-speedometer2', roles: ['admin'] },
      { label: 'Modération signalements', path: '/admin/moderation', icon: 'bi bi-check2-square', roles: ['admin'] },
      { label: 'Contenus abusifs', path: '/admin/signalements-abuse', icon: 'bi bi-shield-exclamation', roles: ['admin'] },
      { label: 'Gestion associations', path: '/admin/associations', icon: 'bi bi-person-gear', roles: ['admin'] },
      { label: 'Créer un défi', path: '/defis/nouveau', icon: 'bi bi-plus-circle', roles: ['admin'] },
    ],
  },
  {
    label: 'Mon espace',
    icon: 'bi bi-person-circle',
    items: [
      { label: 'Mon profil', path: '/profil', icon: 'bi bi-person' },
      { label: 'Mes activités', path: '/mes-activites', icon: 'bi bi-clock-history' },
    ],
  },
];

/** Liens publics partagés par la page d’accueil et l’en-tête visiteur. */
export const PUBLIC_LINKS: NavItem[] = [
  { label: 'Recherche', path: '/recherche', icon: 'bi bi-search' },
  { label: 'Actualités', path: '/fil-actualites', icon: 'bi bi-newspaper' },
  { label: 'Campagnes', path: '/campagnes', icon: 'bi bi-megaphone' },
  { label: 'Associations', path: '/associations', icon: 'bi bi-buildings' },
  { label: 'Événements', path: '/evenements', icon: 'bi bi-calendar-event' },
  { label: 'Défis solidaires', path: '/defis', icon: 'bi bi-trophy' },
  { label: 'Signalements', path: '/signalements-publics', icon: 'bi bi-exclamation-triangle' },
  { label: 'Carte', path: '/signalements-carte', icon: 'bi bi-map' },
];

export function itemsVisibles(groupe: NavGroup, role: string | null): NavItem[] {
  return groupe.items.filter(
    (item) => !item.roles || (role !== null && item.roles.includes(role as UtilisateurRole)),
  );
}

const TOUS_LES_LIENS: NavItem[] = [
  ...PUBLIC_LINKS,
  ...NAV_GROUPS.flatMap((groupe) => groupe.items),
];

/** Libellé de la page courante, utilisé dans la barre supérieure et le titre du navigateur. */
export function libellePourUrl(url: string): string {
  const chemin = url.split('?')[0];
  if (chemin === '/' || chemin === '/accueil') return 'Accueil';

  const correspondances = TOUS_LES_LIENS.filter(
    (item) => chemin === item.path || chemin.startsWith(`${item.path}/`),
  ).sort((a, b) => b.path.length - a.path.length);

  return correspondances[0]?.label ?? 'MennaFina';
}
