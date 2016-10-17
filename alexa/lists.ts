import { HueApi } from "node-hue-api";
import { sayWithCard } from "./";

/**
 * Gets list of scenes on bridge and returns a card for the Alexa app
 */
export function listScenes(api: HueApi) {
	return api.getScenes().then(function (scenes) {
		return sayWithCard("Scenes", scenes.map(g => g.name));
	});
}

/**
 * Gets list of groups on bridge and returns a card for the Alexa app
 */
export function listGroups(api: HueApi) {
	return api.getGroups().then(function (groups) {
		return sayWithCard("Light Groups", groups.map(g => g.name));
	});
}

/**
 * Gets list of lights on bridge and returns a card for the Alexa app
 */
export function listLights(api: HueApi) {
	return api.getLights().then(function (response) {
		return sayWithCard("Lights", response.lights.map(g => g.name));
	});
}