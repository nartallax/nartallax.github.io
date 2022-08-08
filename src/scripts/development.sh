#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

scripts/make_symlinks.sh

./node_modules/.bin/imploder --tsconfig metaproject/tsconfig.json

BUNDLE_FILE="metaproject/js/bundle.js"

# just for debugging purposes
#WHYNODERUNNINGIMPORT="global.whyIsNodeRunning = require('why-is-node-running');"
#echo "$WHYNODERUNNINGIMPORT" | cat - "$BUNDLE_FILE" > /tmp/out && mv /tmp/out "$BUNDLE_FILE"

FRONT_URL="http://localhost:6342/"

if ! command -v xdg-open &> /dev/null
then
    echo "Starting at $FRONT_URL"
else
	xdg-open "$FRONT_URL"
fi

node "$BUNDLE_FILE"