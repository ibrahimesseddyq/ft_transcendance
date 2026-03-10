
# Use one shell per target (fixes & + wait, multi-line scripts)
.ONESHELL:
SHELL := /bin/sh
ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
DEV_COMPOSE  := docker compose -f srcs/compose.yml
PROD_COMPOSE := docker compose -f srcs/compose.yml -f srcs/compose.prod.yml

# ---------- Docker Compose (prod) ----------
up: build
	$(PROD_COMPOSE) build --no-cache
	$(PROD_COMPOSE) up
build:
	cd srcs/backend/gateway && ./gradlew clean bootJar
	true


down:
	$(PROD_COMPOSE) down

clean: clear
	$(PROD_COMPOSE) down --remove-orphans || true
	docker system prune -f


# ---------- Docker Compose (dev) ----------
down-dev:
	$(DEV_COMPOSE) down

clean-dev: clear
	$(DEV_COMPOSE) down --remove-orphans || true

# Main dev target
dev: clean-dev down-dev
	sudo npm install -g concurrently
	$(DEV_COMPOSE) build --no-cache
	$(DEV_COMPOSE) up -d
# 	@echo "Waiting for databases..."
# 	@until docker exec srcs-main_service_db-1 healthcheck.sh --connect --innodb_initialized 2>/dev/null && \
# 	       docker exec srcs-quiz_service_db-1 healthcheck.sh --connect --innodb_initialized 2>/dev/null; do \
# 	  echo "Waiting for DBs..."; sleep 2; \
# 	done
# 	@echo "Databases ready!"
	npx concurrently \
	  "cd srcs/backend/main_service && npm install && npx prisma generate && set -a && . ./.env.example && set +a && npx prisma db push && npm run seed && npm run dev" \
	  "cd srcs/backend/quiz_service && npm install && npx prisma generate && set -a && . ./.env.example && set +a && npx prisma db push && npm run dev" \
	  "cd srcs/frontend && npm install && npm run dev"
re: clean up

# Kill local dev processes/ports only (NO docker compose here)
clear:
	sudo fuser -k -HUP 3000/tcp 2>/dev/null; true
	sudo fuser -k -HUP 5173/tcp 2>/dev/null; true
	sudo fuser -k -HUP 3306/tcp 2>/dev/null; true
	sudo systemctl stop mariadb 2>/dev/null; true
	

# ---------- Kubernetes ----------
kube-build:
	echo $(ROOT)
	@mkdir -p logs
	@cd $(ROOT)srcs/backend/eureka  && ./gradlew clean bootJar
	@cd $(ROOT)srcs/backend/gateway && ./gradlew clean bootJar

	docker build -t waf:dev -f $(ROOT)srcs/waf/Dockerfile $(ROOT)srcs
	docker build -t gateway:dev     $(ROOT)srcs/backend/gateway
	docker build -t main-service:dev $(ROOT)srcs/backend/main_service
	docker build -t quiz-service:dev $(ROOT)srcs/backend/quiz_service
	docker build -t ai-service:dev   $(ROOT)srcs/backend/ai_service
	docker build -t frontend:dev   $(ROOT)srcs/frontend

kube-load: kube-build
	CONTEXT=$$(kubectl config current-context)
	if echo $$CONTEXT | grep -q "k3d"; then
		CLUSTER=$$(echo $$CONTEXT | sed 's/k3d-//')
		k3d image import  eureka:dev gateway:dev main-service:dev quiz-service:dev ai-service:dev frontend:dev  waf:dev -c $$CLUSTER
	fi

kube-deploy:
	# 1. Namespace first
	kubectl apply -f srcs/k8s/namespace.yaml
	# 2. Install/upgrade Vault via Helm
	helm repo add hashicorp https://helm.releases.hashicorp.com
	helm repo update
	helm upgrade --install vault hashicorp/vault \
		-n hirefy --create-namespace \
		-f srcs/k8s/vault-values.yaml
	# 3. Wait for Vault pod to be ready
	kubectl wait --for=condition=ready pod \
		-l app.kubernetes.io/name=vault \
		-n hirefy --timeout=300s
	# 4. Seed secrets into Vault
	echo "Initializing Vault..."
	POD=$$(kubectl get pod -n hirefy -l app.kubernetes.io/name=vault -o jsonpath='{.items[0].metadata.name}')
	kubectl cp srcs/init_vault.sh hirefy/$$POD:/tmp/init_vault.sh
	kubectl exec -n hirefy $$POD -- /bin/sh /tmp/init_vault.sh
	# 5. Service account (required before any Vault-injected pod)
	kubectl apply -f srcs/k8s/serviceaccount.yaml
	# 6. Database layer — wait for it to be ready before apps start
	kubectl apply -f srcs/k8s/main_service_db_pvc.yaml
	kubectl apply -f srcs/k8s/quiz_service_db_pvc.yaml

	kubectl apply -f srcs/k8s/main_service_db.yaml
	kubectl apply -f srcs/k8s/quiz_service_db.yaml

	kubectl wait --for=condition=ready pod -l app=main_service_db -n hirefy --timeout=300s
	kubectl wait --for=condition=ready pod -l app=quiz_service_db -n hirefy --timeout=300s

	# 7. Application services
	kubectl apply -f srcs/k8s/main-service.yaml
	kubectl apply -f srcs/k8s/quiz-service.yaml
	kubectl apply -f srcs/k8s/ai-service.yaml
	kubectl apply -f srcs/k8s/gateway.yaml
	kubectl apply -f srcs/k8s/waf.yaml
	kubectl apply -f srcs/k8s/tls-secret.yaml
	kubectl apply -f srcs/k8s/ingress.yaml
	kubectl apply -f srcs/k8s/adminer.yaml

	kubectl apply -f srcs/k8s/frontend.yaml
	kubectl get pods -n hirefy 

kube: kube-build kube-load kube-deploy 

kube-forward:
	kubectl port-forward -n hirefy svc/gateway 8081:8081 &
	kubectl port-forward -n hirefy svc/main-service 3000:3000 &
	kubectl port-forward -n hirefy svc/vault 8200:8200 &
	wait

kube-restart:
	kubectl rollout restart deployment -n hirefy --all

kube-down:
	kubectl delete namespace hirefy

# ---------- Vault helpers ----------
vault-init:
	echo "=== Initializing Vault Secrets ==="
	chmod +x srcs/init_vault.sh
	kubectl port-forward -n hirefy svc/vault 8200:8200 &
	PF_PID=$$!
	sleep 5
	./srcs/init_vault.sh
	kill $$PF_PID || true

vault-ui:
	echo "=== Opening Vault UI ==="
	echo "Access Vault UI at: http://localhost:8200"
	echo "Token: root"
	kubectl port-forward -n hirefy svc/vault 8200:8200

vault-logs:
	kubectl logs -n hirefy -l app=vault -f

vault-status:
	kubectl exec -n hirefy deployment/vault -- vault status

vault-secret-list:
	echo "=== Listing Vault Secrets ==="
	kubectl exec -n hirefy deployment/vault -- vault kv list secret/

vault-secret-get:
	echo "=== Getting Vault Secret ==="
	read -p "Enter secret path (e.g., main-service/database): " path
	kubectl exec -n hirefy deployment/vault -- vault kv get secret/$$path

vault-secret-put:
	echo "=== Updating Vault Secret ==="
	read -p "Enter secret path (e.g., main-service/database): " path
	read -p "Enter key: " key
	read -p "Enter value: " value
	kubectl exec -n hirefy deployment/vault -- vault kv put secret/$$path $$key="$$value"