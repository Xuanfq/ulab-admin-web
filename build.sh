#!/bin/bash
#
#
# clean old build docker and image
docker rm -f ulab-admin-web-build
docker image rm ulab-admin-web-build

# build web
docker compose up ulab-admin-web-build
