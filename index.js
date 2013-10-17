#!/usr/bin/env node

var fs = require('fs'),
    program = require('commander'),
    docyacode = require('./docyacode'),
    packageJson = require('./package.json');

program._name = packageJson.name;
program
    .version(packageJson.version)
    .option('-md, --markdown', 'Output markdown instead of HTML')
    .parse(process.argv);

var fileName = process.argv[2];

fs.readFile(fileName, function(error, file){
    if(error){
        console.log(error.stack || error);
        return;
    }
    console.log(docyacode(file.toString(), program.markdown));
});