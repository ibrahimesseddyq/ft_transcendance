#!/bin/sh
set -e

export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_TOKEN="root"

# Wait until Vault API is up (no curl required)
until vault status >/dev/null 2>&1; do
  echo "Waiting for vault..."
  sleep 2
done

echo "Vault is ready!"
vault status || true

echo "Enabling KV v2 secrets engine..."
vault secrets enable -path=secret kv-v2 2>/dev/null || echo "KV v2 already enabled"

echo "Enabling Kubernetes authentication..."
vault auth enable kubernetes 2>/dev/null || echo "Kubernetes auth already enabled"

echo "Configure Kubernetes authentication..."
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token



echo "Creating Policies..."
vault policy write main-service - << 'EOF'
path "secret/data/main-service/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write quiz-service - << 'EOF'
path "secret/data/quiz-service/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write mariadb - << 'EOF'
path "secret/data/mariadb/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write ai-service - << 'EOF'
path "secret/data/ai-service/*" { capabilities = [ "read", "list" ] }
EOF
#service account
vault write auth/kubernetes/role/main-service \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=main-service \
    ttl=24h

# vault write auth/kubernetes/role/quiz-service \
#     bound_service_account_names=app-service-account \
#     bound_service_account_namespaces=hirefy \
#     policies=quiz-service \
#     ttl=24h

# vault write auth/kubernetes/role/ai-service \
#     bound_service_account_names=app-service-account \
#     bound_service_account_namespaces=hirefy \
#     policies=ai-service \
#     ttl=24h

vault write auth/kubernetes/role/mariadb \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=mariadb \
    ttl=24h

echo "Storing secrets in vault..."
vault kv put secret/mariadb/config \
  MYSQL_ROOT_PASSWORD="change-me" \
  MYSQL_DATABASE="hirefy" \
  MYSQL_USER="hirefy" \
  MYSQL_PASSWORD="change-me-too"

vault kv put secret/main-service/database \
  DATABASE_URL="mysql://hirefy:change-me-too@mariadb:3306/hirefy"

vault kv put secret/main-service/jwt \
  JWT_SECRET="your-super-secret-jwt-key-change-this" \
  JWT_EXPIRES_IN="24h"

echo "===== Vault initialization complete! ====="