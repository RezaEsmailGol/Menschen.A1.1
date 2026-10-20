// Shareable URLs for every learning screen. Unknown URLs fall back to Home.
export const ROUTES = Object.freeze({
  home: '/', course: '/lessons', practice: '/practice', progress: '/progress',
  workbook: '/workbook', srs: '/review', builder: '/sentences', exam: '/lesson-test',
  numbers: '/numbers', pronunciation: '/pronunciation', flash: '/flashcards',
  listen: '/dictation', words: '/first-words', alphabet: '/alphabet', verbs: '/verbs'
});

export const WORKBOOK_PAGES = Object.freeze(['start','alphabet','sounds','numbers','verbs','dialog','checkpoint']);

export function normalizeRoute(route) {
  if (typeof route!=='string') return 'home';
  const sanitized=route.trim().replace(/^\/+|\/+$/g,'');
  if (sanitized==='workbook') return 'workbook';
  if (sanitized.startsWith('workbook/')) {
    const page=sanitized.slice('workbook/'.length);
    return WORKBOOK_PAGES.includes(page) ? 'workbook/'+page : 'workbook';
  }
  return Object.prototype.hasOwnProperty.call(ROUTES,sanitized)?sanitized:'home';
}

export function pathForRoute(route) {
  const id=normalizeRoute(route);
  if (id.startsWith('workbook/')) return '/workbook/'+id.slice('workbook/'.length);
  return ROUTES[id]||'/';
}

export function routeFromPath(pathname) {
  const path=String(pathname||'/').replace(/\/+$/,'') || '/';
  if (path.startsWith('/workbook/')) {
    const page=path.slice('/workbook/'.length);
    return WORKBOOK_PAGES.includes(page) ? 'workbook/'+page : 'home';
  }
  const found=Object.keys(ROUTES).find(id=>ROUTES[id]===path);
  return found||'home';
}
