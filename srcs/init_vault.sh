#!/bin/bash

set -e

VAULT_ADDR="http://localhost:8200"
VAULT_TOKEN="root"

until curl -s ${VAULT_ADDR}/v1/sys/health | grep -q "initialized" ; do
    echo "Waiting for vault..."
    sleep 2
done


echo "Vault is ready!"

export VAULT_ADDR=${VAULT_ADDR}
export VAULT_TOKEN=${VAULT_TOKEN}

echo "Checking vault status..."

vault status || true

echo "Enabling KV v2 secrets engine..."
vault secrets enable -path=secret kv-v2 2>/dev/null || echo "KV v2 already anabled"

echo "Enabling Kubernetes authentication..."
vault auth enable kubernetes 2>/dev/null || echo "Kubernetes auth already enabled"

echo "Configure Kubernetes authentication..."
vault write auth/kubernetes/config \
    kubernetes_host="https://kubernetes.default.svc:443" \
    kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
    token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token

echo "Creating Policies..."

vault policy write main-service - << EOF
path "secret/data/main-service/*" {
    capabilities = [ "read", "list" ]
}
EOF

vault policy write quiz-service - << EOF
path "secret/data/quiz-service/*" {
    capabilities = [ "read", "list" ]
}
EOF

vault policy write mariadb - << EOF
path "secret/data/mariadb/*" {
    capabilities = [ "read", "list" ]
}
EOF

vault policy write ai-service - << EOF
path "secret/data/ai-service/*" {
    capabilities = [ "read", "list" ]
}
EOF

echo "Storing secrets in vault..."
vault kv put secret/mariadb/credentials \
    MYSQL_ROOT_PASSWORD="change-me" \
    MYSQL_DATABASE="hirefy" \
    MYSQL_USER="hirefy" \
    MYSQL_PASSWORD="change-me-too"

vault kv put secret/main-service/database \
    DATABASE_URL="mysql://hirefy:change-me-too@mariadb:3306/hirefy"

vault kv put secret/main-service/jwt \
    JWT_SECRET="your-super-secret-jwt-key-change-this" \
    JWT_EXPIRES_IN="24h"

# vault kv put secret/main-service/oauth \
#     GOOGLE_CLIENT_ID="your-google-client-id" \
#     GOOGLE_CLIENT_SECRET="your-google-client-secret" \
#     GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# vault kv put secret/quiz-service/database \
#     DATABASE_URL="mysql://hirefy:change-me-too@mariadb:3306/hirefy"

# vault kv put secret/ai-service/api-keys \
#     OPENAI_API_KEY="your-openai-api-key"
echo "===== Vault initialization complete! ====="
echo "Secrets stored:"
echo "  - MariaDB credentials (passwords only)"
echo "  - Main Service: database URL, JWT secrets, OAuth credentials"
echo "  - Quiz Service: database URL"
echo "  - AI Service: API keys"
echo ""
echo "Note: Non-sensitive configuration (PORT, NODE_ENV, etc.) is managed via ConfigMaps"
echo ""
echo "You can verify by running:"
echo "  vault kv list secret/"