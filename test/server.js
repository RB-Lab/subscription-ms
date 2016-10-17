const {spawn} = require('child_process');
const chai = require('chai');
const chaiAsPromissed = require('chai-as-promised');
// https://www.npmjs.com/package/request-promise#cheat-sheet
const request = require('request-promise-native');

const expect = chai.expect;
const serverEnv = {
	env: {
		MS_PORT: 8000,
		MS_HOST: '127.0.0.1'
	}
};
const SERVER_URL = `http://${serverEnv.env.MS_HOST}:${serverEnv.env.MS_PORT}`;

chai.use(chaiAsPromissed);

/**
 * test documentation:
 * mocha: https://mochajs.org/#asynchronous-code
 * chai: http://chaijs.com/api/bdd/
 * chai-as-promised: http://chaijs.com/plugins/chai-as-promised/
 */

describe('Server acceptance test', () => {
	const scope = {};
	before((done) => {
		scope.server = spawn('node', ['index.js'], serverEnv);
		scope.server.stdout.on('data', res => {
			console.log(res.toString()); // eslint-disable-line no-console
			done();
		});
	});

	it('should greet the world', () => {
		return expect(request(SERVER_URL)).to.eventually.equal('Hello, world!\n');
	});

	after(() => {
		scope.server.kill();
	});
});
