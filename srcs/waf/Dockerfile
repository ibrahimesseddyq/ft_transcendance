FROM owasp/modsecurity-crs:nginx

COPY waf/nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY ./allow_patch.conf /etc/modsecurity.d/allow_patch.conf;

# Ensure expected directory exists
RUN mkdir -p /etc/nginx/modsecurity.d


RUN if [ -f /etc/modsecurity.d/unicode.mapping ]; then \
      cp /etc/modsecurity.d/unicode.mapping /etc/nginx/modsecurity.d/unicode.mapping; \
    else \
      echo "WARNING: /etc/modsecurity.d/unicode.mapping not found in base image"; \
    fi