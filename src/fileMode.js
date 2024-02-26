import { validateInputFilePath, validateOutputFilePath, readMarkdownFile } from './validations.js';

const startFileMode = () => {
    const inputFilePath = process.argv[2];
    const outputFilePath = process.argv[4];

    validateInputFilePath(inputFilePath);
    validateOutputFilePath(outputFilePath);

    const markdownText = readMarkdownFile(inputFilePath);
    console.log("File mode is not implemented yet");
}

export { startFileMode };
