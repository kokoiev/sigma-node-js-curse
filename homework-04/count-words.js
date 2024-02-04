const { countWords } = require('./index')

const [,, pathToFile] = process.argv

if (!pathToFile) {
    console.error('Usage: node count-words.js <pahtToFile>');
    process.exit(1);
}

countWords(pathToFile)
