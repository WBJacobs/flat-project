#!/usr/bin/env node

const flatProject = require('./flat-project');

console.log('Flat Project: Generating flat structure of your project...');
flatProject(process.cwd());