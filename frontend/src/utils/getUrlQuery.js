import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);

export default () => parsed;

export const isAdmin = () => parsed.admin && parsed.admin === 'true' ? true : false;
