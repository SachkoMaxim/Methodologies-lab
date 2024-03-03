const regExpes = [
  {
    regExp: /([^A-Za-z0-9]|^)```([^A-Za-z0-9]|$)(.+?)([^A-Za-z0-9]|^)```([^A-Za-z0-9]|$)/s,
    length: 3,
    symbol: '```',
    changeToStart: '<pre>',
    changeToEnd: '</pre>',
    nestedTag: true,
    fn: (markdownText) => markdownText.split(' ').map(word => '~a' + word).join(' ')
  },
  {
    regExp: /([^A-Za-z0-9]|^)\*\*(\S(?:.*?\S)?)\*\*([^A-Za-z0-9]|$)/u,
    length: 2,
    symbol: '**',
    changeToStart: '<b>',
    changeToEnd: '</b>',
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9]|^)_(\S(?:.*?\S)?)_([^A-Za-z0-9]|$)/u,
    symbol: '_',
    length: 1,
    changeToStart: '<i>',
    changeToEnd: '</i>',
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9]|^)`(\S(?:.*?\S)?)`([^A-Za-z0-9]|$)/u,
    symbol: '`',
    length: 1,
    changeToStart: '<tt>',
    changeToEnd: '</tt>',
    nestedTag: false
  },
];

const regExpesError = [
  /(^|\s)\*\*\w+/,
  /(^|\s)_\w+/,
  /(^|\s)`\w+/
];

const preformattedTextOpenedTag = '<pre>';
const preformattedTextClosedTag = '</pre>';
const paragraphOpenedTag = '<p>';
const paragraphClosedTag = '</p>';

const processParagraphs = (markdownText) => {
  let isPreformatted = false;
  const strings = markdownText.split('\n');
  const result = [];
  let isParagraphOpen = false;

  strings.forEach((string, i) => {
    const trimmedString = string.trim();

    if (trimmedString.includes(preformattedTextOpenedTag)) {
      isPreformatted = true;
      result.push(string);
      return;
    }

    if (trimmedString !== '' && !/^[-*]\s*$/.test(trimmedString)) {
      if (!isParagraphOpen && !isPreformatted) {
        result.push(paragraphOpenedTag);
        isParagraphOpen = true;
      }

      result.push(string);
    } else {
      if (isParagraphOpen && !isPreformatted) {
        result.push(paragraphClosedTag);
        isParagraphOpen = false;
      }
      if (isPreformatted) {
        result.push(string);
      }
    }

    if (trimmedString.includes(preformattedTextClosedTag)) {
      isPreformatted = false;
      return;
    }

    if (i < strings.length - 1 && strings[i + 1].includes(preformattedTextOpenedTag)) {
      if (isParagraphOpen && !isPreformatted) {
        result.push(paragraphClosedTag);
        isParagraphOpen = false;
      }
    }

    if (i > 0 && strings[i - 1].includes(preformattedTextClosedTag)) {
      if (!isParagraphOpen && !isPreformatted) {
        result.push(paragraphOpenedTag);
        isParagraphOpen = true;
      }
    }

    if (trimmedString === paragraphOpenedTag && i < strings.length - 1 && strings[i + 1] === paragraphClosedTag) {
      result.push(string);
    }
  });

  if (isParagraphOpen && !isPreformatted) {
    result.push(paragraphClosedTag);
  }

  return result.join('\n');
};

const mergeStringsWithCondition = (markdownText, condition) => {
    const strings = markdownText.split('\n');
    const mergedStrings = [];
    const paragraphOpeningCheck = new RegExp(`^${paragraphOpenedTag}$`);
    const paragraphClosingCheck = new RegExp(`^${paragraphClosedTag}$`);
  
    for (let i = 0; i < strings.length; i++) { 
        const currentString = strings[i];
        const nextString = strings[i + 1];
  
        if(condition === paragraphOpenedTag) {
            if (paragraphOpeningCheck.test(currentString)) {
                const newString = strings[i].replace(/[\r\n]/g, '');
                mergedStrings.push(newString + nextString);
                i++;
            } else {
                mergedStrings.push(strings[i]);
            }
        }
  
        if(condition === paragraphClosedTag) {
            if (paragraphClosingCheck.test(nextString)) {
                const newString = strings[i].replace(/[\r\n]/g, '');
                mergedStrings.push(newString + nextString);
                i++;
            } else {
                mergedStrings.push(strings[i]);
            }
        }
    }

    return mergedStrings.join('\n');
  }

const isNestedTag = (markdownText) => {
  for (const regExp of regExpes) {
    if (markdownText.match(regExp.regExp) != null) return true;
  }
  return false;
};

const isInvalidTags = (markdownText) => {
  for (const regExp of regExpesError) {
    if (markdownText.match(regExp) != null) return true;
  }
  return false;
};

const deleteInternalSymbols = (markdownText, symbols) => markdownText.replace(new RegExp(symbols, 'g'), '');

const convertMarkdownToHTML = (markdownText) => {
  for (const regExp of regExpes) {
    let match;
    while ((match = markdownText.match(regExp.regExp)) != null) {
      const symbolIndexStart = match[0].indexOf(regExp.symbol);
      const midx = match.index + symbolIndexStart;
      let mlength = match[0].length - symbolIndexStart;
      let preformatedText = markdownText.slice(midx + regExp.length, midx + mlength);
      const symbolIndexEnd = preformatedText.lastIndexOf(regExp.symbol);
      const endIdx = midx + symbolIndexEnd
      preformatedText = preformatedText.slice(0, symbolIndexEnd);
      const formatedText = regExp.fn ? regExp.fn(preformatedText) : preformatedText;
      if (!regExp.nestedTag && isNestedTag(' ' + formatedText)) {
        console.log(`\x1b[31mError:\x1b[0m Invalid Markdown nested tags.`);
        process.exit(406);
      }
      markdownText = markdownText.slice(0, midx) + regExp.changeToStart + formatedText + regExp.changeToEnd + markdownText.slice(endIdx + regExp.length * 2); 
    }
  }
  if (isInvalidTags(markdownText)) {
    console.log(`\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.`);
    process.exit(406);
  }
  markdownText = deleteInternalSymbols(markdownText, '~a');
  markdownText = processParagraphs(markdownText);
  markdownText = mergeStringsWithCondition(markdownText, paragraphOpenedTag);
  markdownText = mergeStringsWithCondition(markdownText, paragraphClosedTag);
  return markdownText;
};

export { convertMarkdownToHTML };