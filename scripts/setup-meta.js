#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const packageConfig = require('../package')

const {
  author, description, homepage, license, publicName, version,
} = packageConfig

const replacements = [
  ['{{AUTHOR}}', author],
  ['{{DESCRIPTION}}', description],
  ['{{HOMEPAGE}}', homepage],
  ['{{LICENSE}}', license],
  ['{{NAME}}', publicName],
  ['{{VERSION}}', version],
]

const template = path.join(__dirname, '..', 'lib', 'template.meta.js')
const fileName = `${publicName}.meta.js`
const metaFile = path.join(__dirname, '..', 'dist', fileName)

async function main() {
  if (fs.existsSync(template)) {
    let fileContents = fs.readFileSync(template, 'utf8')
    for (const replacement of replacements) {
      const [placeholder, value] = replacement
      fileContents = fileContents.replace(placeholder, value)
    }
    fs.writeFileSync(metaFile, fileContents, 'utf8')
  }
}

main()
