build:
	# cd srcs/backend/gateway && ./gradlew clean bootJar
	true
up: build
	docker compose -f srcs/compose.yml -f srcs/compose.prod.yml build --no-cache 
	docker compose -f srcs/compose.yml -f srcs/compose.prod.yml up

down-dev:
	docker compose -f srcs/compose.yml down

down: down-dev
	docker compose -f srcs/compose.prod.yml down

clean-dev:
	docker compose -f srcs/compose.yml down --remove-orphans
clean: clean-dev
	docker compose -f srcs/compose.prod.yml down --remove-orphans
	docker system prune -f

re: clean  up

dev:
	# cd srcs/backend/gateway && ./gradlew bootRun --args='--spring.profiles.active=dev' &
	cd srcs/backend/main_service && npm install && npm run dev &
	# cd srcs/backend/quiz_service && npm install && npm run dev &
	docker compose -f srcs/compose.yml  build --no-cache 
	docker compose -f srcs/compose.yml  up
	# wait

.PHONY: clear

clear: clean-dev
	@echo "Cleaning dev processes and ports..."
	-@pgrep -af "nodemon|node server.js" || true
	-@pkill -f "nodemon" || true
	-@pkill -f "node server.js" || true
	-@kill -9 $$(lsof -t -i:3000) 2>/dev/null || true
	-@kill -9 $$(lsof -t -i:3306) 2>/dev/null || true
	-@kill -9 $$(lsof -t -i:3307) 2>/dev/null || true
	@echo "Done."
