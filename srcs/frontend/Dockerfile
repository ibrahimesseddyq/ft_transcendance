# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install js-cookie
COPY . .
ARG VITE_API_URL=http://13.36.189.126 
ARG VITE_MAIN_API_URL=/api/main
ARG VITE_QUIZ_API_URL=/api/quiz
ARG VITE_AI_API_URL=/api/ai
ARG VITE_RAG_API_URL=/api/rag
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MAIN_API_URL=$VITE_MAIN_API_URL
ENV VITE_QUIZ_API_URL=$VITE_QUIZ_API_URL
ENV VITE_AI_API_URL=$VITE_AI_API_URL
ENV VITE_RAG_API_URL=$VITE_RAG_API_URL
RUN npx vite build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid
USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]