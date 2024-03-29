'use strict';

const { startConsoleMode } = require('./src/consoleMode.js');
const { startFileMode } = require('./src/fileMode.js');

if (process.argv.length < 3) {
    const err = new Error('\x1b[31mError:\x1b[0m Please provide the path to the input Markdown file.');
    //exit code is 404, similar to HTTP Not Found status code
    err.code = 404;
    throw err;
} else {
    if (process.argv.length < 4) {
        startConsoleMode();
    } else {
        startFileMode();
    }
}
