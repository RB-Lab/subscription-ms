const http = require('http');

const port = process.env.MS_PORT;
const host = process.env.MS_HOST;

if (port === undefined) throw new Error('MS_PORT environment variable is not set');
if (host === undefined) throw new Error('MS_HOST environment variable is not set');

const server = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello, world!\n');
});

server.listen(port, host, () => {
	/* eslint-disable no-console */
	console.log(`Server running at http://${host}:${port}/`);
	/* eslint-enable no-console */
});
