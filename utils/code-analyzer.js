'use strict';

const fs = require('fs');
const matchAll = require('string.prototype.matchall');

function getImplementedPaths(srcPath) {
  const code = fs.readFileSync(srcPath, 'utf-8');
  const rawMatches = [...matchAll(code, /\.(\w+)\(`(.+)`(, (.+))?\)/g)];
  //console.log(rawMatches);
  const finalPaths = rawMatches.map(match => ({
    method: match[1].toUpperCase(),
    path: match[2].replace(/(\${\w+})/g, '<param>'),
    acceptsParams: match[4]
  }));
  return finalPaths;
}

module.exports = getImplementedPaths;