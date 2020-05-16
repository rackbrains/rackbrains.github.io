#!/usr/bin/env node

const date = new Date();
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const path = require('path');

const titleArray = process.argv.slice(2);

const articleFileName = `${date.toISOString().split('T')[0]}-${titleArray
  .join('-')
  .toLowerCase()}`;

const filePath = `_posts/${date.getFullYear()}/${date.getMonth()}/${articleFileName}.md`;

const articleHeader = `
---
layout: article
title: ${titleArray.join(' ')}
date: ${date.toISOString()}
coverPhoto: /contents/images/2016/07/jekyll.jpg
---
`;

mkdirSync(`_posts/${date.getFullYear()}/${date.getMonth()}`, {
  recursive: true,
});

if (!existsSync(filePath)) writeFileSync(filePath, articleHeader);
