// These values are replaced at Docker build time by build args
// See frontend/Dockerfile and docker-compose.yml
export const environment = {
  production: true,
  apiUrl: '/lafa-magazzino-api/api',
  signalrUrl: '/lafa-magazzino-api/hubs/warehouse',
};
