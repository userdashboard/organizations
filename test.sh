if [ ! -d node_modules/puppeteer ] || [ ! -d node_modules/@userdashboard/dashboard ]; then
  npm install puppeteer @userdashboard/dashboard --no-save
fi
PARAMS="--recursive"
if [ ! -z "$1" ]; then
  PARAMS="$PARAMS -- $1"
  if [ ! -z "$2" ]; then
  PARAMS="$PARAMS $2"
    if [ ! -z "$3" ]; then
    PARAMS="$PARAMS $3"
    fi
  fi
fi
NODE_ENV=testing \
FAST_START=true \
PORT=8003 \
DASHBOARD_SERVER="http://localhost:8003" \
DOMAIN="localhost" \
STORAGE_PATH=/tmp/organizations \
npm test $PARAMS