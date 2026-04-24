# Build stage
FROM node:24-slim AS builder

ARG CASHLY_API_URL
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Inject API URL into environment file
RUN sed -i "s|CASHLY_API_URL_PLACEHOLDER|${CASHLY_API_URL}|g" src/environments/environment.prod.ts


# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Copy built application
COPY --from=builder /app/dist/cashly/browser /usr/share/nginx/html/cashly

# Custom nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]