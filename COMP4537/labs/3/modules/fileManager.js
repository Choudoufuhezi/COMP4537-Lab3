const fs = require('fs');
const path = require('path');

class FileManager {
    constructor() {
        this.filePath = path.join(__dirname, 'file.txt');
    }

    appendText(text, callback) {
        fs.appendFile(this.filePath, `${text}\n`,  "utf8", callback);
    }

    readFile(callback) {
        fs.readFile(this.filePath, "utf8", callback);
    }
}

module.exports = FileManager;