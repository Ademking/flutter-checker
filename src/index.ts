#!/usr/bin/env node
import StreamZip from 'node-stream-zip';
import { Command } from 'commander';
const program = new Command();
program.version('1.0.0', '-v, --version', 'output the current version');
program
  .name("flutter-checker")
  .summary('Check if an apk is built with flutter')
  .description('Check if an apk is built with flutter')
  .option('-f, --filename <filename>', 'filename to check')
  .parse(process.argv);

// show help if there is no args
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

const options = program.opts();
const filename = options.filename

if (!filename) {
  console.log('[Error] Please provide a filepath to check, use -f or --filename option')
  process.exit(1);
}

if (!filename.endsWith('.apk')) {
  console.log('[Error] Please provide a valid apk file, file extension should be .apk')
  process.exit(1);
}

if (filename) {
  console.log(`Checking ${filename}...`)
  try {
    const zip = new StreamZip.async({ file: `${filename}`, storeEntries: true });
    isFileExists('libflutter.so', zip).then((exists) => {
      if (exists) {
        console.log('[+] This apk is built with Flutter')
        process.exit(0)
      }
      else {
        console.log('[-] This apk is not built with Flutter')
        process.exit(1)
      }
    })
  } catch (e) {
    console.log("Error reading file", e)
    process.exit(1)
  }
}

async function isFileExists(filename: string, zip: StreamZip.StreamZipAsync) {
  const entries = await zip.entries()
  for (const entry of Object.values(entries)) {
    if (entry.name.includes(filename)) {
      await zip.close();
      return true
    }
  }
  await zip.close();
  return false
}

