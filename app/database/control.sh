#!/bin/bash

name="dewshare-db"

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

start() {
    if [ ! "$(docker ps -q -f name=$name)" ]; then
        if [ "$(docker ps -aq -f status=exited -f name=$name)" ]; then
            echo "Old container found, removing..."
            docker rm $name
        fi
        docker run -d --name $name -e PGPASSWORD= -e POSTGRES_PASSWORD= -e POSTGRES_USER= -e PGDATA=/var/lib/postgresql/data/pgdata -v $PWD/postgres:/var/lib/postgresql/data/ -p 0.0.0.0:5432:5432 postgres:latest
    fi
}

stop() {
    docker container kill $name
}

status() {
    docker ps -f name=$name
}

reload() {
    docker kill -s HUP $name
}

backup() {
    docker exec -t $name pg_dump public -U postgres | gzip > dump_$(date +"%Y-%m-%d_%H_%M_%S").gz
}

case "$1" in
    start)
       start
       ;;
    stop)
       stop
       ;;
    reload)
       reload
       ;;
    backup)
       backup
       ;;
    status)
       status
       ;;
    *)
       echo "Usage: $0 {start|stop|status|reload|backup}"
esac

exit 0

