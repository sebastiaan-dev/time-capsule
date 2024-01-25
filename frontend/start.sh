#!/bin/bash

cd /usr/share/nginx/html

./import-meta-env-alpine -x .env.example -p index.html || exit 1

nginx -g "daemon off;"
