import { validateInputFilePath, readMarkdownFile } from './validations.js';

const startConsoleMode = () => {
    const filePath = process.argv[2];
    
    validateInputFilePath(filePath);

    const markdownText = readMarkdownFile(filePath);
    console.log("Console mode is not implemented yet");
}

export { startConsoleMode };
