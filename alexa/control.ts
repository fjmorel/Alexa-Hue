import { HueApi } from "node-hue-api";
import { say, IAlexaResponse, DEFAULT_SUCCESS_RESPONSE } from "./";
import { buildLightState } from '../hue/lights'

/**
 * Run some kind of command Hue lights
 */
export function controlLights(bridge: HueApi, command: ISlots): Promise<IAlexaResponse> {
	if (command.Scene) {
		let name = command.Scene.toLowerCase().replace(' seen', ' scene').replace(" scene", "");
		//TODO get scene id from name
		return bridge.getScenes().then(scenes => {
			let scene = scenes.filter(scene => scene.name.toLowerCase() === name)[0];
			if (scene) bridge.activateScene(scene.id);
			else return say("Scene not found. Ask me for a list of scenes!");

			if (name.indexOf("mood") > -1) return say("Setting the mood.");
			return say(DEFAULT_SUCCESS_RESPONSE);
		});
	}

	let state = buildLightState(command);
	let lights = command.Lights;

	//TODO ask for light if none specified or default to all always
	if (lights) lights = lights.replace('like', 'light');
	if (lights === "light" || lights === "lights" || !lights) lights = "all lights";
	if (lights.indexOf("lights") > -1) {
		let groupName = lights.replace(" lights", "");
		if (groupName === "all") {
			return bridge.setGroupLightState(0, state).then(() => say(DEFAULT_SUCCESS_RESPONSE));
		}
		return bridge.getGroups().then(groups => {
			let group = groups.filter(group => group.name.toLowerCase() === groupName)[0];
			if (group) {

				bridge.setGroupLightState(group.id, state);
				return say(DEFAULT_SUCCESS_RESPONSE);
			}
			return say("Does not compute. There is no group named '" + lights + "'");
		});
	}

	return new Promise(function (resolve) {
		resolve(say("Unable to understand command. Please try again."));
	});
}