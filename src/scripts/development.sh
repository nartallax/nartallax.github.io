#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

./node_modules/.bin/imploder --tsconfig metaproject/tsconfig.json
node metaproject/js/bundle.js