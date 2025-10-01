compose_file_deploy = ./docker-compose.deploy.yml
compose_file_dev  = ./docker-compose.dev.yml
compose_file_test  = ./docker-compose.test.yml
compose_file_prod  = ./docker-compose.prod.yml

all: test

dev: build_dev up_dev

test: build_test up_test

prod: build_prod up_prod

build_prod:
	docker compose -f $(compose_file_prod) build --no-cache

up_prod:
	docker compose -f $(compose_file_prod) up

build_test:
	docker compose -f $(compose_file_test) build --no-cache

up_test:
	docker compose -f $(compose_file_test) up

compile:
	docker compose -f $(compose_file_deploy) build

deploy:
	docker compose -f $(compose_file_deploy) up

build_dev:
	docker compose -f $(compose_file_dev) build --no-cache

up_dev:
	docker compose -f $(compose_file_dev) up

stop:
	docker compose -f $(compose_file_deploy) stop
	docker compose -f $(compose_file_dev) stop
	docker compose -f $(compose_file_test) stop
	docker compose -f $(compose_file_prod) stop

clean down: stop
	docker compose -f $(compose_file_deploy) down
	docker compose -f $(compose_file_dev) down
	docker compose -f $(compose_file_test) down
	docker compose -f $(compose_file_prod) down

fclean purge: stop
	docker compose -f $(compose_file_deploy) down --volumes
	docker compose -f $(compose_file_dev) down --volumes
	docker compose -f $(compose_file_test) down --volumes
	docker compose -f $(compose_file_prod) down --volumes
	docker system prune --all --force --volumes

re: stop down all

re_dev: stop build_dev up_dev

.PHONY: build up stop down re purge fclean clean debug re_dev build_dev up_dev up_test build_test