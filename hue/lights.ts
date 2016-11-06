import * as Hue from 'node-hue-api';

const LEVELS = [
	"one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"
];

const COLORS: IMap<number> = {
		red: 65280,
		pink: 56100,
		purple: 52180,
		violet: 47188,
		blue: 46920,
		turquoise: 31146,
		green: 25500,
		yellow: 12750,
		orange: 8618
};

const TEMPERATURES: IMap<number> = {
		candle: 500,
		relax: 467,
		relaxing: 467,
		reading: 346,
		neutral: 300,
		concentrate: 231,
		energize: 136,
		energizing: 136
};

/**
 * Create light state for bulbs based on given properties from Alexa
 */
export function buildLightState(command: ISlots) {
	const state = Hue.lightState.create().on();
	let color = command.Color;
	if (color) {
		state.sat(220);
		if (color.indexOf("dark") > -1) state.sat(255)
		if (color.indexOf("light") > -1) state.sat(195)
		color = color.replace("dark ", "").replace("light ", "");
		if (COLORS[color]) state.hue(COLORS[color]);
		if (TEMPERATURES[color]) state.ct(TEMPERATURES[color]);
	}
	if (command.Brightness) state.bri(LEVELS.indexOf(command.Brightness.toLowerCase()) / 10 * 255);
	if (command.Saturation) state.sat(LEVELS.indexOf(command.Saturation.toLowerCase()) / 10 * 255);

	return state;
}