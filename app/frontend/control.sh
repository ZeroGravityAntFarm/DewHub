#!/bin/bash

name="dew-frontend"
port="8118"
domain="fileshare.zgaf.io"

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
        docker run -it --rm -d -p 127.0.0.1:$port:80 --name $name -v $PWD/frontend:/usr/share/nginx/html --label "traefik.http.routers.$name.rule=Host(\`$domain\`)" nginx
    fi
}

stop() {
    docker container kill $name
}

status() {
    docker ps -f name=$name
}

build() {
    echo "Not available"
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
       echo "Usage: $0 {start|stop|status|build|reload}"
esac

exit 0
