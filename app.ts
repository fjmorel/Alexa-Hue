/// <reference path="typings/index.d.ts" />

import * as http from 'http';
import { getBridge } from "./hue/bridge";
import * as Alexa from './alexa'

//Get connection to Hue bridge
let bridge = getBridge();

//Create web server
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, function () {
	console.log("Server listening on: http://localhost:%s", PORT);
});

//We need a function which handles requests and send response
function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
	var body: any[] = [];
	request.on("error", (err: Error) => {
		console.error(err);
	}).on('data', function (chunk: any) {
		body.push(chunk);
	}).on('end', function () {
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

	});
}