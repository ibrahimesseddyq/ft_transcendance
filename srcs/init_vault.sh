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

vault policy write main_service_db - << 'EOF'
path "secret/data/main_service_db/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write quiz_service_db - << 'EOF'
path "secret/data/quiz_service_db/*" { capabilities = [ "read", "list" ] }
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

vault write auth/kubernetes/role/quiz-service \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=quiz-service \
    ttl=24h

vault write auth/kubernetes/role/ai-service \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=ai-service \
    ttl=24h

vault write auth/kubernetes/role/main_service_db \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=main_service_db \
    ttl=24h

vault write auth/kubernetes/role/quiz_service_db \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=quiz_service_db \
    ttl=24h

echo "Storing secrets in vault..."
vault kv put secret/main_service_db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_MAIN_ROOT_PASSWORD}" \
  MARIADB_DATABASE="hirefy" \
  MARIADB_USER="hirefy" \
  MARIADB_PASSWORD="${MARIADB_MAIN_PASSWORD}"
## change those to env!!!!!!!!!!!!!
vault kv put secret/quiz_service_db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_QUIZ_ROOT_PASSWORD}" \
  MARIADB_DATABASE="hirefy" \
  MARIADB_USER="hirefy" \
  MARIADB_PASSWORD="${MARIADB_QUIZ_PASSWORD}"

vault kv put secret/quiz-service/database \
  DATABASE_URL="mysql://${MARIADB_QUIZ_USER}:${MARIADB_QUIZ_PASSWORD}@quiz_service_db:3306/hirefy"

vault kv put secret/quiz-service/jwt \
  ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
  REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"

vault kv put secret/main-service/oauth \
  GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}" \
  GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}" 

vault kv put secret/main-service/database \
  DATABASE_URL="mysql://${MARIADB_MAIN_USER}:${MARIADB_MAIN_PASSWORD}@main_service_db:3306/hirefy"
echo "Storing AI service secrets..."

vault kv put secret/ai-service/config \
  AI_MODEL_NAME="gpt-3.5-turbo" \
  AI_API_KEY="your-api-key-here"

vault kv put secret/main-service/jwt \
  ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
  REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"

vault kv put secret/main-service/other \
  RECRUITER_PASS="${RECRUITER_PASS}" \
  AI_INTERNAL_API_KEY="${AI_INTERNAL_API_KEY}"\
  USER_EMAIL="${USER_EMAIL}"\
  USER_PASSWORD="${USER_PASSWORD}"\
  QUIZ_PUBLIC_API_KEY="${QUIZ_PUBLIC_API_KEY}"\
  INTERNAL_API_KEY="${INTERNAL_API_KEY}"
echo "===== Vault initialization complete! ====="