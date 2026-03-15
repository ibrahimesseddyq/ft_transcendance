FROM owasp/modsecurity-crs:nginx

COPY --from=builder /app/dist /usr/share/nginx/html
COPY waf/nginx.conf /etc/nginx/templates/conf.d/default.conf.template

# Ensure expected directory exists
RUN mkdir -p /etc/nginx/modsecurity.d
# RUN rm -f /etc/nginx/templates/conf.d/modsecurity.conf.template

# Put unicode.mapping where the NGINX/ModSecurity config expects it
# Copy is more reliable than symlink across images/layers
RUN if [ -f /etc/modsecurity.d/unicode.mapping ]; then \
      cp /etc/modsecurity.d/unicode.mapping /etc/nginx/modsecurity.d/unicode.mapping; \
    else \
      echo "WARNING: /etc/modsecurity.d/unicode.mapping not found in base image"; \
    fi