#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

rm -rf .parcel-cache 2> /dev/null
rm -rf ./docs 2> /dev/null

./node_modules/.bin/parcel serve --target dev --no-cache --no-hmr