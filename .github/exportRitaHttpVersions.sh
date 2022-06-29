#!/bin/bash
RITA_HTTP_VERSION=$(cat "$1" \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

IFS='.' read -ra ADDR <<< "$RITA_HTTP_VERSION"

RITA_HTTP_VERSION_MAJOR=${ADDR[0]}
RITA_HTTP_VERSION_MINOR=${ADDR[0]}.${ADDR[1]}

echo "RITA_HTTP_VERSION=$RITA_HTTP_VERSION" >> "$GITHUB_ENV"
echo "RITA_HTTP_VERSION_MINOR=$RITA_HTTP_VERSION_MINOR" >> "$GITHUB_ENV"
echo "RITA_HTTP_VERSION_MAJOR=$RITA_HTTP_VERSION_MAJOR" >> "$GITHUB_ENV"