// These values are replaced at Docker build time by build args
// See frontend/Dockerfile and docker-compose.yml
export const environment = {
  production: true,
  apiUrl: '/api',
  signalrUrl: '/hubs/warehouse',
};
