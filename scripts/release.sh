#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

rm -rf .parcel-cache 2> /dev/null
rm -rf ./docs 2> /dev/null

echo "Typechecking..."
cd src
../node_modules/typescript/bin/tsc --noEmit
cd - 2> /dev/null
echo "Done typechecking."

./node_modules/.bin/parcel build --target release --no-cache
cp ./robots.txt ./docs/
cp ./sitemap.xml ./docs/