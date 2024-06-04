#!/bin/bash

name="dew-share"
port=""
domain="fileshare.com"
secrets="./secrets.var"

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
	docker run --restart=always -d --name $name -p 0.0.0.0:$port:8001 -v $PWD/static:/app/static --env-file $secrets --label "traefik.http.routers.$name-http.entrypoints=websecure" --label "traefik.http.routers.$name-http.rule=Host(\`$domain\`)" --label "traefik.http.routers.$name-http.tls.certResolver=zgaf" --label "traefik.http.routers.$name-http.tls" $name
    fi
}

debug() {
    if [ ! "$(docker ps -q -f name=$name)" ]; then
        if [ "$(docker ps -aq -f status=exited -f name=$name)" ]; then
            echo "Old container found, removing..."
            docker rm $name
        fi
        docker run --name $name -p 0.0.0.0:$port:8001 -v $PWD/static:/app/static --env-file $secrets --label "traefik.http.routers.$name-http.entrypoints=websecure" --label "traefik.http.routers.$name-http.rule=Host(\`$domain\`)" --label "traefik.http.routers.$name-http.tls.certResolver=zgaf" --label "traefik.http.routers.$name-http.tls" $name
    fi
}

stop() {
    docker container kill $name
}

login() {
    docker exec -it $name /bin/bash
}

status() {
    docker ps -f name=$name
}

build() {
    docker build -t $name .
}

reload() {
    docker kill -s HUP $name
}
case "$1" in
    start)
       start
       ;;
    stop)
       stop
       ;;
    login)
       login
       ;;
    debug)
       debug
       ;;
    reload)
       reload
       ;;
    build)
       build
       ;;
    status)
       status
       ;;
    *)
       echo "Usage: $0 {start|stop|login|debug|status|build|reload}"
esac

exit 0
