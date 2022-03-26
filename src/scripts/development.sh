#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

./node_modules/.bin/imploder --tsconfig metaproject/tsconfig.json

WHYNODERUNNINGIMPORT="global.whyIsNodeRunning = require('why-is-node-running');"
BUNDLE_FILE="metaproject/js/bundle.js"

# just for debugging purposes
#echo "$WHYNODERUNNINGIMPORT" | cat - "$BUNDLE_FILE" > /tmp/out && mv /tmp/out "$BUNDLE_FILE"

xdg-open http://localhost:6342/

node "$BUNDLE_FILE"