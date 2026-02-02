build:
	cd srcs/backend/gateway && ./gradlew clean bootJar
	cd srcs/backend/eureka && ./gradlew clean bootJar

up: build
	docker compose -f srcs/docker-compose.yml build --no-cache 
	docker compose -f srcs/docker-compose.yml up


down:
	docker compose -f srcs/docker-compose.yml down

clean:
	docker compose -f srcs/docker-compose.yml down --remove-orphans
	docker system prune -f

re: clean  up

dev:
	cd srcs/backend/eureka && ./gradlew bootRun --args='--spring.profiles.active=dev' &
	cd srcs/backend/gateway && ./gradlew bootRun --args='--spring.profiles.active=dev' &
	cd srcs/backend/main_service && npm install && npm run dev &
	cd srcs/backend/quiz_service && npm install && npm run dev &
	wait

kube-build:
	docker build -t eureka:dev ./srcs/backend/eureka
	docker build -t gateway:dev ./srcs/backend/gateway
	docker build -t main-service:dev ./srcs/backend/main_service
	docker build -t quiz-service:dev ./srcs/backend/quiz_service
	docker build -t ai-service:dev ./srcs/backend/ai_service

kube-load: kube-build
	@CONTEXT=$$(kubectl config current-context); \
	if echo $$CONTEXT | grep -q "kind"; then \
		CLUSTER=$$(echo $$CONTEXT | sed 's/kind-//'); \
		kind load docker-image eureka:dev gateway:dev main-service:dev quiz-service:dev ai-service:dev --name $$CLUSTER; \
	fi

kube-deploy:
	kubectl apply -f srcs/k8s/base/namespace.yaml
	kubectl apply -f srcs/k8s/base/vault.yaml
	kubectl wait --for=condition=ready pod -l app=vault -n hirefy --timeout=300s
	@echo "Initializing Vault..."
	kubectl cp init-vault.sh hirefy/$$(kubectl get pod -n hirefy -l app=vault -o jsonpath='{.items[0].metadata.name}'):/tmp/init-vault.sh
	kubectl exec -n hirefy $$(kubectl get pod -n hirefy -l app=vault -o jsonpath='{.items[0].metadata.name}') -- /bin/sh /tmp/init-vault.sh
	kubectl apply -f srcs/k8s/base/mariadb-pvc.yaml
	kubectl apply -f srcs/k8s/base/mariadb.yaml
	kubectl wait --for=condition=ready pod -l app=mariadb -n hirefy --timeout=300s
	kubectl apply -f srcs/k8s/base/main-service.yaml
	kubectl apply -f srcs/k8s/base/quiz-service.yaml
	kubectl apply -f srcs/k8s/base/ai-service.yaml
	kubectl apply -f srcs/k8s/base/gateway.yaml

	kubectl get pods -n hirefy

kube: kube-load kube-deploy kube-forward



vault-init:
	@echo "=== Initializing Vault Secrets ==="
	chmod +x init-vault.sh
	kubectl port-forward -n hirefy svc/vault 8200:8200 &
	@sleep 5
	./init-vault.sh
	@killall kubectl || true

vault-ui:
	@echo "=== Opening Vault UI ==="
	@echo "Access Vault UI at: http://localhost:8200"
	@echo "Token: root"
	kubectl port-forward -n hirefy svc/vault 8200:8200

vault-logs:
	kubectl logs -n hirefy -l app=vault -f

vault-status:
	kubectl exec -n hirefy deployment/vault -- vault status

# Combined target for full Vault deployment
kube-vault: kube-load vault-deploy kube-forward

kube-status:
	kubectl get all -n hirefy

kube-logs:
	kubectl logs -n hirefy deployment/main-service -f

kube-forward:
	kubectl port-forward -n hirefy svc/gateway 8081:8081 & \
	kubectl port-forward -n hirefy svc/main-service 3000:3000 & \
	# kubectl port-forward -n hirefy svc/eureka 8761:8761 & \
	kubectl port-forward -n hirefy svc/vault 8200:8200 & \
	wait

kube-restart:
	kubectl rollout restart deployment -n hirefy --all

kube-down:
	kubectl delete namespace hirefy

# Helper commands
vault-secret-list:
	@echo "=== Listing Vault Secrets ==="
	kubectl exec -n hirefy deployment/vault -- vault kv list secret/

vault-secret-get:
	@echo "=== Getting Vault Secret ==="
	@read -p "Enter secret path (e.g., main-service/database): " path; \
	kubectl exec -n hirefy deployment/vault -- vault kv get secret/$$path

vault-secret-put:
	@echo "=== Updating Vault Secret ==="
	@read -p "Enter secret path (e.g., main-service/database): " path; \
	@read -p "Enter key: " key; \
	@read -p "Enter value: " value; \
	kubectl exec -n hirefy deployment/vault -- vault kv put secret/$$path $$key="$$value"
