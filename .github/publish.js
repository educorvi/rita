#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const releasercPath = path.join(
    rootDir,
    'packages',
    'vue-json-form',
    '.releaserc.json'
);

// Get current branch
let currentBranch;
try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: rootDir,
        encoding: 'utf8',
    }).trim();
} catch (error) {
    console.error('Error getting current branch:', error.message);
    process.exit(1);
}

console.log(`Current branch: ${currentBranch}`);

// Read .releaserc.json
let releaserc;
try {
    const content = fs.readFileSync(releasercPath, 'utf8');
    releaserc = JSON.parse(content);
} catch (error) {
    console.error(
        `Error reading .releaserc.json at ${releasercPath}:`,
        error.message
    );
    process.exit(1);
}

// Determine tag
let tag = 'latest';
const branchConfig = releaserc.branches.find((b) => b.name === currentBranch);

if (branchConfig && branchConfig.channel) {
    tag = branchConfig.channel;
}

console.log(`Publishing with tag: ${tag}`);

// Run yarn command
const command = `yarn workspaces foreach --topological-dev -Av --no-private --exclude . exec yarn npm publish --access public --tolerate-republish --tag ${tag}`;

try {
    execSync(command, { cwd: rootDir, stdio: 'inherit' });
} catch (error) {
    console.error('Error executing publish command:', error.message);
    process.exit(1);
}
