import { HueApi } from "node-hue-api";
import { say, IAlexaResponse, getSuccessResponse } from "./";
import { buildLightState } from '../hue/lights'

/**
 * Run some kind of command Hue lights
 */
export function controlLights(bridge: HueApi, command: ISlots): Promise<IAlexaResponse> {
	if (command.Scene) {
		const name = command.Scene.toLowerCase().replace(' seen', ' scene').replace(" scene", "");
		//TODO get scene id from name
		return bridge.getScenes().then(scenes => {
			const scene = scenes.filter(scene => scene.name.toLowerCase() === name)[0];
			if (scene) bridge.activateScene(scene.id);
			else return say("Scene not found. Ask me for a list of scenes!");

			if (name.indexOf("mood") > -1) return say(["Setting the mood", "Good luck tonight"][Math.round(Math.random())]);
			return say(getSuccessResponse());
		});
	}

	const state = buildLightState(command);
	let lights = command.Lights;

	//TODO ask for light if none specified or default to all always
	if (lights) lights = lights.replace('like', 'light');
	if (lights === "light" || lights === "lights" || !lights) lights = "all lights";
	if (lights.indexOf("lights") > -1) {
		const groupName = lights.replace(" lights", "");
		if (groupName === "all") {
			return bridge.setGroupLightState(0, state).then(() => say(getSuccessResponse()));
		}
		return bridge.getGroups().then(groups => {
			const group = groups.filter(group => group.name.toLowerCase() === groupName)[0];
			if (group) {

				bridge.setGroupLightState(group.id, state);
				return say(getSuccessResponse());
			}
			return say("Does not compute. There is no group named '" + lights + "'");
		});
	}

	return new Promise(function (resolve) {
		resolve(say("Unable to understand command. Please try again."));
	});
}