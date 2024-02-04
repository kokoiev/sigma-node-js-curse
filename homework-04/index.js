const fs = require('fs');
const path = require('path');
const { Readable, Transform } = require('stream');

class SentenceStream extends Readable {
    constructor(sentences, targetSize) {
        super();
        this.sentences = sentences;
        this.targetSize = targetSize;
        this.size = 0;
    }

    _read() {
        if (this.size >= this.targetSize) {
            this.push(null);
        } else {
            const sentence = this.sentences[Math.floor(Math.random() * this.sentences.length)] + '\n';
            this.size += Buffer.byteLength(sentence);
            this.push(sentence);
        }
    }
}


// class SentenceWriter extends Transform {
//     constructor(options) {
//         super(options);
//     }
//
//     _transform(chunk, encoding, callback) {
//         // Прямий запис даних без змін
//         this.push(chunk);
//         callback();
//     }
// }

async function generateFile(inputFilePath, outputFilePath, targetSize) {
    try {
        const sentencesData = await fs.promises.readFile(inputFilePath, 'utf-8');
        const sentences = sentencesData.split('\n').filter(Boolean);

        const sentenceStream = new SentenceStream(sentences, targetSize);
        // const sentenceWriter = new SentenceWriter();
        const writeStream = fs.createWriteStream(outputFilePath);

        // sentenceStream.pipe(sentenceWriter).pipe(writeStream);
        sentenceStream.pipe(new WordFrequencyAnalyzer({}, outputFilePath)).pipe(writeStream);


        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log(`File generated: ${outputFilePath}`);
                resolve();
            });
            writeStream.on('error', reject);
        });

    } catch (err) {
        console.error('Error:', err);
    }
}

// Для дотакового завдання
class WordFrequencyAnalyzer extends Transform {
    constructor(options, outputFilePath) {
        super(options);
        this.wordCounts = {};
        this.outputFilePath = outputFilePath;
    }

    _transform(chunk, encoding, callback) {
        const words = chunk.toString().toLowerCase().match(/\b(\w+)\b/g);
        if (words) {
            words.forEach(word => {
                this.wordCounts[word] = (this.wordCounts[word] || 0) + 1;
            });
        }
        this.push(chunk);
        callback();
    }

    _flush(callback) {

        const baseName = path.basename(this.outputFilePath, path.extname(this.outputFilePath));
        const statsFileName = `${baseName}_статистика.json`;
        const statsFilePath = path.join(path.dirname(this.outputFilePath), statsFileName);

        fs.writeFile(statsFilePath, JSON.stringify(this.wordCounts, null, 2), (err) => {
            if (err) {
                console.error('Error writing statistics:', err);
            } else {
                console.log(`Word frequency statistics saved to ${statsFilePath}`);
            }
            callback();
        });
    }

}

async function countWords(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const wordCount = data.match(/\b(\w+)\b/g).length;
        console.log(`Total words in file: ${wordCount}`);
    } catch (err) {
        console.error('Error counting words:', err);
    }
}


module.exports = { generateFile, countWords };
