const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const port = process.env.MS_PORT;
const host = process.env.MS_HOST;
const savePath = process.env.SAVE_PATH;
const allowedOriginsFile = process.env.ORIGINS;

if (port === undefined) throw new Error('MS_PORT environment variable is not set');
if (host === undefined) throw new Error('MS_HOST environment variable is not set');
if (savePath === undefined) throw new Error('SAVE_PATH environment variable is not set');

let origins = [];
try {
	origins = fs.readFileSync(allowedOriginsFile, {encoding: 'utf-8'}).split('\n').filter(o => o);
} catch (ignore){}

function throw500(res, err) {
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end(err);
}

function isOriginInList(origin){
	return origins.indexOf('http://' + origin) > -1 || origins.indexOf('https://' + origin) > -1
}

const server = http.createServer((req, res) => {
	if (isOriginInList(req.headers.origin)) {
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	}
	if (req.method === 'POST' && req.url === '/') {
		const body = [];
		req.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			const requestData = querystring.parse(Buffer.concat(body).toString());
			if (!requestData.list || !requestData.email) {
				res.writeHead(400, {'Content-Type': 'text/plain'});
				res.end('400 bad request\n');
				return;
			}
			fs.open(path.join(savePath, requestData.list), 'a+', (err, fileDescriptor) => {
				if (err) {
					throw500(res, err);
					return;
				}
				fs.write(fileDescriptor, `${requestData.email}\n`, null, 'utf8', (err2) => {
					if (err2) {
						throw500(res, err2);
						return;
					}
					fs.close(fileDescriptor, (err3) => {
						if (err3) {
							throw500(res, err3);
							return;
						}
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end('OK\n');
					});
				});
			});
		});
		return;
	}
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('404 resource not found\n');
});

server.listen(port, host, () => {
	/* eslint-disable no-console */
	console.log(`Server running at http://${host}:${port}/`);
	/* eslint-enable no-console */
});
