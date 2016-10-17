import * as fs from 'fs';
import * as hue from 'node-hue-api';

let configFilename = "hue/alexa_hue_user";

function readUsername(): string | undefined {
	try {
		return fs.readFileSync(configFilename).toString();
	} catch (ex) {
		console.log("Failed to read Bridge username from file");
	}
}

function register(IP: string): Promise<string> {
	return new hue.HueApi().registerUser(IP).then(newUser => {
		console.log("Created Hue user: " + JSON.stringify(newUser));
		fs.writeFile(configFilename, newUser);
		return newUser
	});
}

/**
 * Find bridge, authorize if necessary, and connect
 */
export function getBridge(): Promise<hue.HueApi> {
	return hue.nupnpSearch().then(function (bridges) {
		if (!bridges || !bridges[0]) {
			throw "No bridge found";
		}
		let ip = bridges[0].ipaddress;
		let user = readUsername();
		let promise: Promise<any>;
		//First load username from file. Register if there's no file.
		if (!user) promise = register(ip);
		else promise = Promise.resolve(user);
		return promise.then(user => { return new hue.HueApi(ip, user); });
	});
}