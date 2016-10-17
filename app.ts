/// <reference path="typings/index.d.ts" />

//Lets require/import the HTTP module
import * as http from 'http';
import { buildLightState } from './hue/lights'
import * as Hue from "./hue/bridge";
import * as Alexa from './alexa'
import * as HueApi from 'node-hue-api';

//Lets define a port we want to listen to
const PORT = 4567;
let bridge = Hue.getBridge();

//Create a server
let server = http.createServer(handleRequest);
server.listen(PORT, function () {
	//Callback triggered when server is successfully listening. Hurray!
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
		bridge.then(function (api) {
			return processCommand(intent, options, api);
		}).then(function (result) {
			response.end(JSON.stringify(result));
		});

	});
}

function processCommand(intent: string, command: ISlots, bridge: HueApi.HueApi): Promise<Alexa.IAlexaResponse> {
	
	if (intent === "ListScenes") {
		return bridge.getScenes().then(function (scenes) {
			return Alexa.sayWithCard("Scenes", scenes.map(g => g.name));
		});
	} else if (intent === "ListGroups") {
		return bridge.getGroups().then(function (groups) {
			return Alexa.sayWithCard("Light Groups", groups.map(g => g.name));
		});
	} else if (intent === "ListLights") {
		return bridge.getLights().then(function (response) {
			return Alexa.sayWithCard("Lights", response.lights.map(g => g.name));
		});
	} else if (intent === "ControlLights") {
		if (command.Scene) {
			let name = command.Scene.toLowerCase().replace(' seen', ' scene').replace(" scene", "");
			//TODO get scene id from name
			return bridge.getScenes().then(scenes => {
				let scene = scenes.filter(scene => scene.name.toLowerCase() === name)[0];
				if (scene) bridge.activateScene(scene.id);
				else return Alexa.say("Scene not found. You can ask me for a list of scenes.");
				
				if (name.indexOf("mood") > -1) return Alexa.say("Setting the mood.");
				return Alexa.say("As you wish.");
			});
		}

		let state = buildLightState(command);
		let lights = command.Lights;

		//TODO ask for light if none specified or default to all always
		if (lights) lights = lights.replace('like', 'light');
		if (lights === "light" || lights === "lights" || !lights) lights = "all lights";
		if (lights.indexOf("lights") > -1) {
			let groupName = lights.replace(" lights", "");
			console.log(groupName);
			console.log(state.payload());
			if (groupName === "all") {
				return bridge.setGroupLightState(0, state).then(() => Alexa.say("As you wish"));
			}
			return bridge.getGroups().then(groups => {
				let group = groups.filter(group => group.name.toLowerCase() === groupName)[0];
				if (group) {

					bridge.setGroupLightState(group.id, state);
					return Alexa.say("As you wish");
				}
				return Alexa.say("Does not compute. There is no group named '" + lights + "'");
			});
		}
	}

	return new Promise(function (resolve) {
		resolve(Alexa.say("Why you make no sense."));
	})
}