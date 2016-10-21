/// <reference path="typings/index.d.ts" />

import * as http from 'http';
import { getBridge } from "./hue/bridge";
import * as Alexa from './alexa'

//Get connection to Hue bridge
let bridge = getBridge();

//Create web server
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, function () {
	console.log("Server listening on: http://localhost:%s/lights", PORT);
});

//We need a function which handles requests and send response
function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
	try {
		if (!request.url || request.url.indexOf("/lights") < 0) throw new Error("Invalid URL");
		var body: any[] = [];
		request.on("error", (err: Error) => {
			console.error(err);
		}).on('data', function (chunk: any) {
			body.push(chunk);
		}).on('end', processRequest.bind({}, body, response));
	} catch (ex) {
		console.log(new Date());
		console.error(ex);
		response.end(JSON.stringify(Alexa.say("Invalid request")));
	}
}

function processRequest(body: any[], response: http.ServerResponse) {
	try {
		let command = (<Alexa.IAlexaRequest>JSON.parse(Buffer.concat(body).toString())).request.intent;
		let intent = command.name;
		let options = Alexa.getSlotValues(command.slots);

		response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
		bridge.then(function (hueApi) {
			if (intent === "ListScenes") return Alexa.listScenes(hueApi);
			else if (intent === "ListGroups") return Alexa.listGroups(hueApi);
			else if (intent === "ListLights") return Alexa.listLights(hueApi);
			else if (intent === "ControlLights") return Alexa.controlLights(hueApi, options);

			return new Promise(function (resolve) {
				resolve(Alexa.say("Why you make no sense."));
			});
		}).then(function (result) {
			response.end(JSON.stringify(result));
		});
	} catch (ex) {
		response.end(JSON.stringify(Alexa.say("Could not understand request")));
	}
}