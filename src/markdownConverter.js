const TagsMap = {
    '\\*\\*(.*?)\\*\\*': '<b>$1</b>',
    '\\b_(.*?)_\\b': '<i>$1</i>',
    '`(.*?)`': '<tt>$1</tt>'
};

const preformattedTextOpenedTag = '<pre>\n';
const preformattedTextClosedTag = '</pre>\n';
const backticks = '```';
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

const convertMarkdownToHTML = (markdownText) => {
    const strings = markdownText.split('\n');
    const result = [];
    const isPreformattedText = [false];
    const isParagraphOpened = [false];

    for (const string of strings) {
        if (string.startsWith(backticks)) {
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

    return result.join('');
}

export { convertMarkdownToHTML };