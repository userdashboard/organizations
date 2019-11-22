if [ ! -d node_modules/@userdashboard/dashboard ] || [ ! -d node_modules/puppeteer ] || [ ! -d node_modules/@userdashboard/storage-redis ]; then
  npm install puppeteer @userdashboard/dashboard @userdashboard/storage-redis --no-save
fi

NODE_ENV=testing \
STORAGE_ENGINE="@userdashboard/storage-redis" \
REDIS_URL=redis://localhost:6379 \
FAST_START=true \
DASHBOARD_SERVER="http://localhost:8003" \
PORT=8003 \
STORAGE_PATH=/tmp/organizations-data \
ENCRYPTION_SECRET=12345678901234567890123456789012 \
ENCRYPTION_SECRET_IV=1234123412341234 \
GENERATE_SITEMAP_TXT=false \
GENERATE_API_TXT=false \
npm test