#!/bin/sh
set -e

export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_TOKEN="root"
export MARIADB_MAIN_ROOT_PASSWORD=root
export MARIADB_MAIN_DATABASE=hirefy
export MARIADB_MAIN_USER=user1
export MARIADB_MAIN_PASSWORD=pass
export MARIADB_QUIZ_ROOT_PASSWORD=root
export MARIADB_QUIZ_DATABASE=hirefy
export MARIADB_QUIZ_USER=user2
export MARIADB_QUIZ_PASSWORD=pass

############# Global ###################
export DATABASE_URL="mysql://user1:pass@localhost:3306/hirefy"
export PORT=3000
export HOST=localhost
export NODE_ENV=development
export BCRYPT_ROUNDS=10

export GOOGLE_CLIENT_ID=103278425538-0iqof4oahn4rfkl1j51tbd4t8bvu6655.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=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
export CALLBACK_URL=/api/main/auth/google/callback

export ACCESS_TOKEN_SECRET=96c2401320859efdd13ac8b2043d93ffce79dc76d93872e61a210c556582b1c4e4865ea773b185805bb5ab92dcba4c5a8334cb4d334197bd71c7efa0680858d9
export ACCESS_TOKEN_EXPIRY="1d"
export REFRESH_TOKEN_SECRET=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad
export REFRESH_TOKEN_EXPIRY="7d"

export VERIFY_SECRET=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad
export VERIFY_SECRET_EXPIRY="7d"
export USER_EMAIL=fttranscendencefttranscendence@gmail.com
export USER_PASSWORD=mqsuowqknwrumsmp
export FRONTEND_URL=http://localhost:5173
export BACKEND_URL=http://localhost:3000/
export INTERNAL_API_KEY=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad
export QUIZ_SERVICE_URL=http://localhost:3308/
export AI_INTERNAL_API_KEY=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad
export RECRUITER_PASS=Abdellatif123@@ 

export VERIFY_TOKEN_SECRET=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad

export EMP_TOKEN_SECRET=8da503b92526d94b65daa2661d8ea91fd84679bac7aace7398e1064826e2ad
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

vault policy write main-service-db - << 'EOF'
path "secret/data/main-service-db/*" { capabilities = [ "read", "list" ] }
EOF

vault policy write quiz-service-db - << 'EOF'
path "secret/data/quiz-service-db/*" { capabilities = [ "read", "list" ] }
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

echo "Storing secrets in vault..."
vault kv put secret/main-service-db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_MAIN_ROOT_PASSWORD}" \
  MARIADB_DATABASE="${MARIADB_MAIN_DATABASE}" \
  MARIADB_USER="${MARIADB_MAIN_USER}" \
  MARIADB_PASSWORD="${MARIADB_MAIN_PASSWORD}"
## change those to env!!!!!!!!!!!!!
vault kv put secret/quiz-service-db/config \
  MARIADB_ROOT_PASSWORD="${MARIADB_QUIZ_ROOT_PASSWORD}" \
  MARIADB_DATABASE="${MARIADB_MAIN_DATABASE}" \
  MARIADB_USER="${MARIADB_MAIN_USER}" \
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

# vault kv put secret/ai-service/config \
#   AI_MODEL_NAME="gpt-3.5-turbo" \
#   AI_API_KEY="your-api-key-here"

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
echo "===== Vault initialization complete! ====="