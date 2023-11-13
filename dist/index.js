#!/usr/bin/env node
import { Command } from 'commander';
import { downloadFile, getPackageNameFromGooglePlayStoreUrl } from './utils.js';
import AdmZip from "adm-zip";
import fs from 'fs';
import chalk from 'chalk';
const program = new Command();
program.version('1.0.0', '-v, --version', 'output the current version');
program
    .name("flutter-checker")
    .summary('Check if an apk is built with flutter')
    .description('Check if an apk is built with flutter')
    .option('-f, --filename <filename>', 'filename to check')
    .option('-p, --package <package>', 'package name to check (APK will be downloaded from playstore)')
    .option('-s, --save-apk', 'save the downloaded apk')
    .option('-o, --output <output>', 'output directory to save the apk')
    .parse(process.argv);
// show help if there is no args
if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1);
}
const options = program.opts();
const filename = options.filename;
let package_name = options.package;
if (!filename && !package_name) {
    console.log('[Error] Please provide a filename or package name to check, use -h for help');
    process.exit(1);
}
if (filename && !package_name) {
    //console.log(`Checking ${filename} ...`)
    console.log(chalk.blue(`Checking APK: ${filename} ...\n`));
    try {
        //const zip = new StreamZip.async({ file: `${filename}`, storeEntries: true });
        const zip = new AdmZip(filename);
        isFileExists('libflutter.so', zip).then((exists) => {
            if (exists) {
                //console.log('[+] This apk is built with Flutter')
                console.log(chalk.green('[+] This apk is built with Flutter'));
                process.exit(0);
            }
            else {
                //console.log('[-] This apk is not built with Flutter')
                console.log(chalk.red('[-] This apk is not built with Flutter'));
                process.exit(1);
            }
        });
    }
    catch (e) {
        //console.log("Error reading file", e)
        console.log(chalk.red("[Error] Error reading file:", e.message));
        process.exit(1);
    }
}
if (package_name && !filename) {
    let pkgFromUrl = getPackageNameFromGooglePlayStoreUrl(package_name);
    if (pkgFromUrl) {
        package_name = pkgFromUrl;
    }
    //console.log(`Downloading ${package_name}...`)
    console.log(chalk.blue(`Downloading APK: ${package_name} ...\n`));
    //const buffer = await downloadApk(package_name)
    const buffer = await downloadFile(package_name);
    // save apk if requested
    if (options.saveApk) {
        // custom output directory if provided
        if (options.output) {
            // create directory if not exists
            if (!fs.existsSync(options.output)) {
                fs.mkdirSync(options.output);
            }
            // save apk
            fs.writeFileSync(`${options.output}/${package_name}.apk`, buffer);
            //console.log(`[+] Saved apk to ${options.output}/${package_name}.apk`)
            console.log(chalk.green(`[+] Saved apk to ${options.output}/${package_name}.apk`));
        }
        else {
            // save in current directory
            const currentDirectory = './';
            fs.writeFileSync(`${currentDirectory}/${package_name}.apk`, buffer);
            //console.log(`[+] Saved apk to ${currentDirectory}/${package_name}.apk`)
            console.log(chalk.green(`[+] Saved apk to ${currentDirectory}/${package_name}.apk`));
        }
    }
    const zip = new AdmZip(buffer);
    isFileExists('libflutter.so', zip).then((exists) => {
        if (exists) {
            //console.log('\n[+] This apk is built with Flutter')
            console.log(chalk.green('\n[+] This apk is built with Flutter'));
            process.exit(0);
        }
        else {
            //console.log('\n[-] This apk is not built with Flutter')
            console.log(chalk.red('\n[-] This apk is not built with Flutter'));
            process.exit(1);
        }
    });
}
async function isFileExists(filename, zip) {
    const entries = zip.getEntries();
    for (const entry of entries) {
        if (entry.entryName.endsWith('.apk')) { // check if the entry is an apk itself ; if so, extract it and check again
            // buffer from entry
            const buffer = entry.getData();
            // check if the apk is built with flutter
            const innerZip = new AdmZip(buffer);
            const exists = await isFileExists(filename, innerZip);
            if (exists) {
                return true;
            }
        }
        if (entry.entryName.includes(filename)) {
            return true;
        }
    }
    return false;
}
