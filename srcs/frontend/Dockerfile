# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install js-cookie
COPY . .
ARG VITE_API_URL=http://13.38.15.15
ARG VITE_MAIN_API_URL=/api/main
ARG VITE_QUIZ_API_URL=/api/quiz
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MAIN_API_URL=$VITE_MAIN_API_URL
ENV VITE_QUIZ_API_URL=$VITE_QUIZ_API_URL
RUN npx vite build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]