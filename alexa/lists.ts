import { HueApi } from "node-hue-api";
import { sayWithCard } from "./";

/**
 * Gets list of scenes on bridge and returns a card for the Alexa app
 */
export function listScenes(api: HueApi) {
	return api.getScenes().then((scenes) => {
		return sayWithCard("Scenes", scenes.map((s) => s.name));
	});
}

/**
 * Gets list of groups on bridge and returns a card for the Alexa app
 */
export function listGroups(api: HueApi) {
	return api.getGroups().then((groups) => {
		return sayWithCard("Light Groups", groups.map((g) => g.name));
	});
}

/**
 * Gets list of lights on bridge and returns a card for the Alexa app
 */
export function listLights(api: HueApi) {
	return api.getLights().then((response) => {
		return sayWithCard("Lights", response.lights.map((l) => l.name));
	});
}