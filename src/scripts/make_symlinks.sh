#!/usr/bin/env bash

set -e
cd `dirname "$0"`
cd ..

SRC=`realpath -s website/common/website_common.ts`
DST=`realpath -s sketches/common/website_common.ts`

rm -rf "${DST}"
ln -s "${SRC}" "${DST}"