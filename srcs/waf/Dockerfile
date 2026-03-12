# ---------- Stage 1: build frontend ----------
FROM node:20 AS builder
USER root
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


# ---------- Stage 2: WAF server ----------
FROM owasp/modsecurity-crs:nginx

COPY --from=builder /app/dist /usr/share/nginx/html
COPY waf/nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY waf/modsecurity.conf /etc/modsecurity.d/modsecurity.conf
# RUN chown -R nginx:nginx /etc/modsecurity.d
# USER nginx