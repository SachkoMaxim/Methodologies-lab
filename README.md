# Markdown-to-HTML text Convertor

## Short description

This program was created by Maksym Sachko, group IM-22, FICE, KPI. This is a simple text converter from Markdown text to HTML text. 
The program can convert some Markdown tags to HTML tags, such as bold, italic, monospaced, preformat, and paragraph tags. 
It can also detect invalid markup and find nested tags, save the output data to a .html file, or output that data to stdout.

## How to run

> **NOTE:** Markdown-to-HTML convertor is made with **node.js** you need install [Node.js](https://nodejs.org/en/download) to run the program
1. You need to clone this repository from GitHub before running the program. Select the folder you want to clone the repository to, then type the command:
   `git clone https://github.com/SachkoMaxim/Methodologies-lab.git`

2. Then navigate to the cloned repository folder:
   `cd ../Methodologies-lab`

3. Run main.js file:
   `node main.js <file.md>`

## How to use

Markdown-to-HTML convertor has two modes: console mode and file mode.
> **NOTE:** Only Markdown files can be used as an **input file** for the program. If you use other file types, you will see an ERROR

### Console mode

To run the program in the console mode, just type this command in your terminal in the project folder (don't forget to pass the input file path into the arguments of the command):

`node main.js </path/to/markdown.md>`

After that, the converted text with HTML tags will be displayed in stdout (if there was no mistakes, of course).

### File mode

To run the program in the file mode, you need to add **--out** and pass the output file path into the arguments of the previous command:
> **NOTE:** if you didn't write **--out** the converted text with HTML tags will be redirected to stdout

> **NOTE:** Only HTML files can be used as an **output file** for the program. If you use other file types, you will see an ERROR

`node main.js </path/to/markdown.md> --out </path/to/file.html>`

After that, the converted text with HTML tags will be saved to a .html file you choosed as an output file (if there was no mistakes, of course).

There are five example files in the examples folder for you to comfortably test the program.

**Demonstration of working program (please click here to see the video on YouTube):**
[![Program demo](https://computerinfobits.com/wp-content/uploads/2022/02/Windows-Desktop.webp)](https://youtu.be/dQw4w9WgXcQ)

## Lab section

### Revert-commit link