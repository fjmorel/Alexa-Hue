import { HueApi } from "node-hue-api";
import { say, IAlexaResponse, sayResult } from "./";
import { buildLightState } from "../hue/lights";

/**
 * Run some kind of command Hue lights
 */
export function controlLights(bridge: HueApi, command: IControlSlots): Promise<IAlexaResponse> {
	if(command.Scene) {
		const name = command.Scene.toLowerCase().replace(" seen", " scene").replace(" scene", "");
		// TODO get scene id from name
		return bridge.getScenes().then((scenes) => {
			const scene = scenes.filter((s) => s.name.toLowerCase() === name)[0];
			if(scene) {
				bridge.activateScene(scene.id);
			} else return say("Scene not found. Ask me for a list of scenes!");

			if(name.indexOf("mood") > -1) return say(["Setting the mood", "Good luck tonight"][Math.round(Math.random())]);
			return sayResult(true);
		});
	}

	const state = buildLightState(command);
	let lights = command.Lights;

	// TODO ask for light if none specified or default to all always
	if(lights) lights = lights.replace("like", "light");
	if(lights === "light" || lights === "lights" || !lights) lights = "all lights";
	if(lights.indexOf("lights") > -1) {
		const groupName = lights.replace(" lights", "");
		if(groupName === "all") {
			return bridge.setGroupLightState(0, state).then(() => sayResult(true));
		}
		return bridge.getGroups().then((groups) => {
			const group = groups.filter((g) => g.name.toLowerCase() === groupName)[0];
			if(group) {

				bridge.setGroupLightState(group.id, state);
				return sayResult(true);
			}
			return say("Does not compute. There is no group named '" + lights + "'");
		});
	}

	return new Promise((resolve) => {
		resolve(say("Why you make no sense. Please try again."));
	});
}