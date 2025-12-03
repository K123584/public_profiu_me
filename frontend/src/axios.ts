import axios from 'axios';

const securedAxios = axios.create({});

securedAxios.interceptors.request.use(config => {
  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
securedAxios.defaults.withCredentials = true;

export { securedAxios };