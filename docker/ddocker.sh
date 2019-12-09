#!/bin/bash

echo "start in docker"

docker kill yesbot

cd ..
docker build -f ./docker/Dockerfile --rm -t local/yesbot -t 025221494343.dkr.ecr.us-east-1.amazonaws.com/rileystech:yesbot .



#docker run -d --rm --privileged -p 80:80 -p 9000 --network proxynet --ip 172.30.0.13 --name guardbot local/guardbot

cd docker

if [ "$1" = "push" ]; then
$(aws ecr get-login --no-include-email)
docker push 025221494343.dkr.ecr.us-east-1.amazonaws.com/rileystech:yesbot
fi
