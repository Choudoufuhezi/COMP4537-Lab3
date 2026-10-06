const http = require('http');
const { URL} = require('url');
const Utils = require('./modules/utils');
const English = require('./lang/en');
const FileManager = require('./modules/fileManager');

class Server {
    constructor(port) {
        this.port = port;
        this.utils = new Utils();
        this.english = new English();
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });
        this.fileManager = new FileManager();
    }

    handleRequest(req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (url.pathname === '/getDate' && req.method === 'GET') {
            const name = url.searchParams.get('name');
            this.sendDateResponse(res, name);
            return;
        }

        if (url.pathname === '/writeFile' && req.method === 'GET') {
            const text = url.searchParams.get('text');
            this.writeFileResponse(res, text);
            return;
        }

         if (url.pathname === '/readFile/file.txt' && req.method === 'GET') {
            this.readFileResponse(res);
            return;
         }

        this.sendNotFound(res);
    }

    sendDateResponse(res, name) {
        const userName = name || 'Guest';
        const currentDate = this.utils.getDate();
        const message = this.english.greeting.replace('$1', userName);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<p style="color: blue;">${message} ${currentDate}</p>`);
    }

    writeFileResponse(res, text) {
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Missing text parameter");
            return;
        }

        this.fileManager.appendText(text, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end("Error writing to file");
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`Appended "${text}" to file.txt`);
        });
    }

    readFileResponse(res) {
        this.fileManager.readFile((err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end("404 Error: file.txt not found");
                    return;
                }

                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end("Error reading file");
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(data);
        });
    }

    sendNotFound(res) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const port = process.env.PORT || 3000;
const server = new Server(port);
server.start();