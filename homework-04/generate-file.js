const path = require('path');
const { generateFile } = require('./index');

const [,, outputFile, fileSize] = process.argv;


if (!outputFile || !fileSize) {
    console.error('Usage: node generate-file.js <outputFile> <fileSize>');
    process.exit(1);
}


const targetSize = parseInt(fileSize, 10) * 1024 * 1024;
const inputFilePath = path.join(__dirname, 'src', 'static', 'sentences.txt');
const outputFilePath = path.join(__dirname,'src', 'static', outputFile);


generateFile(inputFilePath, outputFilePath, targetSize)
    .then()
    .catch(err => console.error(err));
