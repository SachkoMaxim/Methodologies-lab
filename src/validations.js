import { existsSync, readFileSync} from 'fs';

const validateInputFilePath = (filePath) => {
    if (!existsSync(filePath)) {
        console.log(`\x1b[31mError:\x1b[0m File not found at path: ${filePath}`);
        // exit code is 404, similar to HTTP Not Found status code
        process.exit(404);
    }

    if (!/\.(md|markdown)$/i.test(filePath)) {
        console.log(`\x1b[31mError:\x1b[0m Invalid input file type. Please provide a Markdown file.`);
        // exit code is 415 as for Unsupported Media Type
        process.exit(415);
    }
};

const readMarkdownFile = (filePath) => {
    try {
        return readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.log(`\x1b[31mError:\x1b[0m Unable to read file at path: ${filePath}.\n${error.message}`);
        // exit code is 500 as for internal server error
        process.exit(500);
    }
};

export { validateInputFilePath, readMarkdownFile };