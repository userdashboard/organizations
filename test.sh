if [ ! -d node_modules/puppeteer ] || [ ! -d node_modules/@userdashboard/dashboard ]; then
  npm install puppeteer @userdashboard/dashboard --no-save
fi
NODE_ENV=testing \
FAST_START=true \
PORT=8003 \
DASHBOARD_SERVER="http://localhost:8003" \
STORAGE_PATH=/tmp/organizations \
npm test