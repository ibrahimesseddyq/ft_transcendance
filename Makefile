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
	kubectl apply -f srcs/k8s/base/mariadb-secret.yaml
	kubectl apply -f srcs/k8s/base/mariadb-pvc.yaml
	kubectl apply -f srcs/k8s/base/mariadb.yaml
	kubectl wait --for=condition=ready pod -l app=mariadb -n hirefy --timeout=300s
	kubectl wait --for=condition=ready pod -l app=eureka -n hirefy --timeout=300s
	kubectl apply -f srcs/k8s/base/main-service-secret.yaml
	kubectl apply -f srcs/k8s/base/main-service.yaml
	kubectl apply -f srcs/k8s/base/quiz-service.yaml
	kubectl apply -f srcs/k8s/base/ai-service.yaml
	kubectl apply -f srcs/k8s/base/gateway.yaml
	kubectl get pods -n hirefy

kube: kube-load kube-deploy kube-forward

kube-status:
	kubectl get all -n hirefy

kube-logs:
	kubectl logs -n hirefy deployment/main-service -f

kube-forward:
	kubectl port-forward -n hirefy svc/gateway 8081:8081 & \
	kubectl port-forward -n hirefy svc/main-service 3000:3000 & \
	kubectl port-forward -n hirefy svc/eureka 8761:8761 & \
	wait

kube-restart:
	kubectl rollout restart deployment -n hirefy --all

kube-down:
	kubectl delete namespace hirefy
