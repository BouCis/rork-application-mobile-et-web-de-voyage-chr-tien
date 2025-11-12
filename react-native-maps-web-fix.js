
const chalk = require('chalk');

const { readFile, writeFile, copyFile } = require('fs').promises;

console.log(chalk.green('Fixing react-native-maps for web...'));

function log(...args) {

  console.log(chalk.yellow('[react-native-maps]'), ...args);

}

async function fixMaps() {

  log('Creating web compatibility with empty module');

  const modulePath = 'node_modules/react-native-maps';

  // Crée index.web.js vide

  await writeFile(`${modulePath}/lib/index.web.js`, 'module.exports = {};', 'utf-8');

  

  // Copie les types TS pour web

  await copyFile(`${modulePath}/lib/index.d.ts`, `${modulePath}/lib/index.web.d.ts`);

  // Modifie package.json de la lib

  const pkg = JSON.parse(await readFile(`${modulePath}/package.json`, 'utf-8'));

  pkg['react-native'] = 'lib/index.js';  // Native entry

  pkg['main'] = 'lib/index.web.js';      // Web entry

  await writeFile(`${modulePath}/package.json`, JSON.stringify(pkg, null, 2), 'utf-8');

  log('Fix applied successfully!');

}

fixMaps().catch(console.error);

