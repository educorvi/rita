#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rsort, valid } from 'semver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const name = packageJson.name;

// Get all tags matching the package
const tagsOutput = execSync(`git tag --list "${name}-v*.*.*"`, {
    encoding: 'utf-8',
});
const tags = tagsOutput.trim().split('\n').filter(Boolean);

if (tags.length === 0) {
    console.error(`No tags found for ${name}`);
    process.exit(1);
}

// Extract versions from tags
let versions = tags
    .map((tag) => tag.replace(`${name}-v`, ''))
    .filter((version) => valid(version));

versions = rsort(versions);

if (versions.length === 0) {
    console.error(`No valid semver versions found for ${name}`);
    process.exit(1);
}

const latestVersion = versions[0];
console.info(`Setting version to ${latestVersion} in package ${name}`);

packageJson.version = latestVersion;
writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
