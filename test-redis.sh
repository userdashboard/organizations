#!/bin/sh
if [ ! -d node_modules/puppeteer ] || [ ! -d node_modules/@userdashboard/dashboard ] || [ ! -d node_modules/@userdashboard/storage-redis ]; then
  npm install @userdashboard/dashboard @userdashboard/storage-redis puppeteer@2.1.1 --no-save
fi
PARAMS=""
if [ ! -z "$1" ]; then
  PARAMS="$PARAMS -- --grep $1"
fi
NODE_ENV=testing \
STORAGE_ENGINE="@userdashboard/storage-redis" \
REDIS_URL=redis://localhost:6379 \
FAST_START=true \
DASHBOARD_SERVER="http://localhost" \
DOMAIN="localhost" \
ENCRYPTION_SECRET=12345678901234567890123456789012 \
ENCRYPTION_SECRET_IV=1234123412341234 \
GENERATE_SITEMAP_TXT=false \
GENERATE_API_TXT=false \
npm test $PARAMS
