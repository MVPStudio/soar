export const getIsAdmin = location => location.hash.replace('#', '') === 'admin';
export const getUrlSearchTerm = location => location.search.replace('?', '');