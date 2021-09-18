#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

cd website/server
../../node_modules/.bin/imploder --tsconfig tsconfig.json
node js/server.js --release