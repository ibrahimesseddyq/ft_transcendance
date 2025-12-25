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