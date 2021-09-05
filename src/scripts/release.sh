#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

cd server
../node_modules/.bin/imploder --tsconfig tsconfig.json
node js/bundle.js --release