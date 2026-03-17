#!/bin/sh
set -e

if [ -f .env ]; then
  # Export all vars, skip comments and blank lines
  set -a
  . ./.env
  set +a
else
  echo "ERROR: .env file not found"
  exit 1
fi
# Wait for vault to be reachable
until vault status >/dev/null 2>&1; do
  STATUS=$?
  if [ $STATUS -eq 2 ]; then
    echo "Vault is sealed but running, proceeding to unseal..."
    break
  fi
  echo "Waiting for vault..."
  sleep 2
done
if ! vault operator init -status >/dev/null 2>&1; then
  vault operator init -key-shares=1 -key-threshold=1 \
    -format=json > /vault/data/init.json

  # -A1 gets the line AFTER the key name, then strip spaces/quotes/commas
  UNSEAL_KEY=$(grep -A1 'unseal_keys_hex' /vault/data/init.json | tail -1 | tr -d ' [],\"')
  VAULT_TOKEN=$(grep 'root_token' /vault/data/init.json | cut -d'"' -f4)

  echo "DEBUG UNSEAL_KEY=$UNSEAL_KEY"
  echo "DEBUG VAULT_TOKEN=$VAULT_TOKEN"

  vault operator unseal "$UNSEAL_KEY"
  export VAULT_TOKEN
  vault login "$VAULT_TOKEN"
fi

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


# Creating Policies
echo "Creating Policies..."
vault policy write main-service - << 'EOF'
path "secret/data/main-service/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write quiz-service - << 'EOF'
path "secret/data/quiz-service/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write main-service-db - << 'EOF'
path "secret/data/main-service-db/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write quiz-service-db - << 'EOF'
path "secret/data/quiz-service-db/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write ai-service - << 'EOF'
path "secret/data/ai-service/*" { capabilities = [ "read", "list" ] }
EOF

# service account
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

vault write auth/kubernetes/role/main-service-db \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=main-service-db \
    ttl=24h

vault write auth/kubernetes/role/quiz-service-db \
    bound_service_account_names=app-service-account \
    bound_service_account_namespaces=hirefy \
    policies=quiz-service-db \
    ttl=24h

# Storing main service secrets
echo "Storing secrets in vault..."
vault kv put secret/main-service-db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_MAIN_ROOT_PASSWORD}" \
  MARIADB_DATABASE="${MARIADB_MAIN_DATABASE}" \
  MARIADB_USER="${MARIADB_MAIN_USER}" \
  MARIADB_PASSWORD="${MARIADB_MAIN_PASSWORD}"

vault kv put secret/main-service/oauth \
  GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}" \
  GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}" 

vault kv put secret/main-service/database \
  DATABASE_URL="mysql://${MARIADB_MAIN_USER}:${MARIADB_MAIN_PASSWORD}@main-service-db:3306/hirefy"
echo "Storing AI service secrets..."


vault kv put secret/main-service/jwt \
  ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
  REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"\
  VERIFY_TOKEN_SECRET="${VERIFY_TOKEN_SECRET}" \
  TEMP_TOKEN_SECRET="${TEMP_TOKEN_SECRET}"
  
vault kv put secret/main-service/other \
  RECRUITER_PASS="${RECRUITER_PASS}" \
  AI_INTERNAL_API_KEY="${AI_INTERNAL_API_KEY}"\
  USER_EMAIL="${USER_EMAIL}"\
  USER_PASSWORD="${USER_PASSWORD}"\
  QUIZ_PUBLIC_API_KEY="${QUIZ_PUBLIC_API_KEY}"\
  INTERNAL_API_KEY="${INTERNAL_API_KEY}"

# Storing quiz service secrets

vault kv put secret/quiz-service-db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_QUIZ_ROOT_PASSWORD}" \
  MARIADB_DATABASE="${MARIADB_MAIN_DATABASE}" \
  MARIADB_USER="${MARIADB_MAIN_USER}" \
  MARIADB_PASSWORD="${MARIADB_QUIZ_PASSWORD}"

vault kv put secret/quiz-service/database \
  DATABASE_URL="mysql://${MARIADB_QUIZ_USER}:${MARIADB_QUIZ_PASSWORD}@quiz-service-db:3306/hirefy"

vault kv put secret/quiz-service/jwt \
  ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
  REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"

vault kv put secret/quiz-service/other \
  QUIZ_PUBLIC_API_KEY="${QUIZ_PUBLIC_API_KEY}" \
  INTERNAL_API_KEY="${INTERNAL_API_KEY}"
  
# Storing ai service secrets

vault kv put secret/ai-service/config \
  AI_MODEL_NAME="${AI_MODEL_NAME}" \
  AI_API_KEY="${AI_API_KEY}"

vault kv put secret/ai-service/jwt \
  ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
  REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}"

vault kv put secret/ai-service/other \
  AI_INTERNAL_API_KEY="${AI_INTERNAL_API_KEY}" \
  INTERNAL_API_KEY="${INTERNAL_API_KEY}"
  
echo "===== Vault initialization complete! ====="