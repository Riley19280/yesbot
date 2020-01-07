#!/bin/bash

echo "start in docker"

docker kill yesbot

cd ..
docker build -f ./docker/Dockerfile --rm -t local/yesbot -t 025221494343.dkr.ecr.us-east-1.amazonaws.com/rileystech:yesbot .



#docker run -d --rm --privileged -p 80:80 -p 9000 --network proxynet --ip 172.30.0.22 --name yesbot local/yesbot

cd docker


if [ "$1" = "push" ]; then

if grep -q '?'  ../config.json; then
  echo -e "\033[0;31mERROR: Config file does not contain correct prefix \033[0m";
  exit
fi

$(aws ecr get-login --no-include-email)
docker push 025221494343.dkr.ecr.us-east-1.amazonaws.com/rileystech:yesbot
fi
