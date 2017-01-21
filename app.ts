/// <reference path="typings/index.d.ts" />

import * as http from "http";
import { getBridge } from "./hue/bridge";
import * as Alexa from "./alexa";

// Get connection to Hue bridge
const bridge = getBridge();

// Create web server
const PORT = 4567;
http.createServer(handleRequest).listen(PORT, () => {
	console.log("Server listening on: http://localhost:%s/lights", PORT);
});

// We need a function which handles requests and send response
function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
	try {
		if (!request.url || request.url.indexOf("/lights") < 0) throw new Error("Invalid URL");
		const body: any[] = [];
		request.on("error", (err: Error) => {
			console.error(err);
		}).on("data", (chunk: any) => {
			body.push(chunk);
		}).on("end", processRequest.bind({}, body, response));
	} catch (ex) {
		console.error(ex.message);
		response.end(JSON.stringify(Alexa.sayResult(false)));
	}
}

function processRequest(body: any[], response: http.ServerResponse) {
	response.writeHead(200, { "Content-Type": "application/json;charset=UTF-8" });

	try {
		const command = (JSON.parse(Buffer.concat(body).toString()) as Alexa.IAlexaRequest).request.intent;
		const intent = command.name;

		bridge.then((hueApi) => {
			switch (intent) {
				case "ListScenes":
					return Alexa.listScenes(hueApi);
				case "ListGroups":
					return Alexa.listGroups(hueApi);
				case "ListLights":
					return Alexa.listLights(hueApi);
				case "ControlLights":
					return Alexa.controlLights(hueApi, Alexa.getSlotValues(command.slots));
				default:
					return new Promise((resolve) => { resolve(Alexa.say("Why you make no sense.")); });
			}
		}).then((result) => { response.end(JSON.stringify(result)); });
	} catch (ex) {
		response.end(JSON.stringify(Alexa.sayResult(false)));
	}
}