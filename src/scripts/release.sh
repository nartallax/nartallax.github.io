#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

scripts/make_symlinks.sh

cd website/server
../../node_modules/.bin/imploder --tsconfig tsconfig.json
node js/server.js --release

cd ../../..
echo $RANDOM > deploy_trigger/index.html
echo $RANDOM >> deploy_trigger/index.html
echo $RANDOM >> deploy_trigger/index.html
echo $RANDOM >> deploy_trigger/index.html
echo $RANDOM >> deploy_trigger/index.html