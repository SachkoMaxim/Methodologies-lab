const TagsMap = {
    '(?<![a-zA-Z0-9])\\*\\*(\\S(?:.*?\\S)?)\\*\\*(?![a-zA-Z0-9])': '<b>$1</b>',
    '(?<![a-zA-Z0-9])\\b_(\\S(?:.*?\\S)?)_\\b(?![a-zA-Z0-9])': '<i>$1</i>',
    '(?<![a-zA-Z0-9`])`(\\S(?:.*?\\S)?)`(?![a-zA-Z0-9`])': '<tt>$1</tt>'
};

const preformattedTextOpenedTag = '<pre>\n';
const preformattedTextClosedTag = '</pre>\n';
const backticks = /^```$/;
const paragraphOpenedTag = '<p>';
const paragraphClosedTag = '</p>';

const processPreformattedText = (result, isPreformattedText) => {
    isPreformattedText[0] = !isPreformattedText[0];
    if (isPreformattedText[0]) {
        result.push(preformattedTextOpenedTag);
    } else {
        result.push(preformattedTextClosedTag);
    }
}

const processParagraph = (result, isParagraphOpened, string) => {
    const trimmedString = string.trim();
    if (trimmedString === '') {
        if (isParagraphOpened[0]) {
            result.push(paragraphClosedTag + '\n');
            isParagraphOpened[0] = false;
        }
    } else {
        if (!isParagraphOpened[0]) {
            result.push(paragraphOpenedTag);
            isParagraphOpened[0] = true;
        }
        for (const [regex, replacement] of Object.entries(TagsMap)) {
            const regexObj = new RegExp(regex, 'g');
            string = string.replace(regexObj, replacement);
        }
        result.push(string + '\n');
    }
}

const mergeStringesWithCloseParagraph = (markdownText) => {
    const strings = markdownText.split('\n');
    const mergedStrings = [];
    const paragraphCheck = /^<\/p>$/;

    for (let i = 0; i < strings.length; i++) {
        const nextString = strings[i + 1] ? strings[i + 1].trim() : '';
        const testString = strings[i + 1];

        if (paragraphCheck.test(testString)) {
            const newString = strings[i].replace(/[\r\n]/g, '');
            mergedStrings.push(newString + nextString);
            i++;  // Skip the next string since it has been merged
        } else {
            mergedStrings.push(strings[i]);
        }
    }

    return mergedStrings.join('\n');
}

const convertMarkdownToHTML = (markdownText) => {
    const strings = markdownText.split('\n');
    const result = [];
    const isPreformattedText = [false];
    const isParagraphOpened = [false];

    for (const string of strings) {
        const testString = string.replace(/[\r\n]/g, '');
        if (backticks.test(testString)) {
            processPreformattedText(result, isPreformattedText);
            continue;
        }

        if (isPreformattedText[0]) {
            result.push(string + '\n');
        } else {
            processParagraph(result, isParagraphOpened, string);
        }
    }

    if (isParagraphOpened[0]) {
        result.push(paragraphClosedTag + '\n');
    }

    if (isPreformattedText[0]) {
        result.push(preformattedTextClosedTag);
    }

    const finalHTML = result.join('');
    const mergedHTML = mergeStringesWithCloseParagraph(finalHTML);
  
    return mergedHTML;
}

export { convertMarkdownToHTML };