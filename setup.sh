#!/bin/sh
if ! command -v node &> /dev/null
then
    echo "node could not be found, please install it"
    exit
fi

echo "Installing dependencies..."
node common/scripts/install-run-rush.js install

echo "Building project"
node common/scripts/install-run-rush.js build

printf "\n\n\n Project built.\n You can now enter the rita-http directory and start the webserver by running 'node .'\n"
