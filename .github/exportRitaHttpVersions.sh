#!/bin/bash
RITA_HTTP_VERSION=$(cat "$1" |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[",]//g' |
  sed 's/^ *//g')

echo "RITA_HTTP_VERSION=$RITA_HTTP_VERSION" >>"$GITHUB_ENV"
