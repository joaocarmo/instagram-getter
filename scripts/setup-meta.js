#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const packageConfig = require('../package')

const {
  author, description, homepage, publicName, version,
} = packageConfig

const replacements = [
  ['{{AUTHOR}}', author],
  ['{{DESCRIPTION}}', description],
  ['{{HOMEPAGE}}', homepage],
  ['{{NAME}}', publicName],
  ['{{VERSION}}', version],
]

const fileName = `${publicName}.meta.js`
const metaFile = path.join(__dirname, '..', 'dist', fileName)

async function main() {
  if (fs.existsSync(metaFile)) {
    let fileContents = fs.readFileSync(metaFile, 'utf8')
    for (const replacement of replacements) {
      const [placeholder, value] = replacement
      fileContents = fileContents.replace(placeholder, value)
    }
    fs.writeFileSync(metaFile, fileContents, 'utf8')
  }
}

main()
