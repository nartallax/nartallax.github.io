#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

rm -rf .parcel-cache 2> /dev/null
rm -rf ./docs 2> /dev/null
mkdir ./docs

./node_modules/.bin/parcel build --target test

node ./docs/test_main.js