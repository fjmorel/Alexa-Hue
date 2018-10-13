/// <reference types="node" />
/// <reference types="node-hue-api" />

interface IControlSlots {
	Lights?: string;
	Brightness?: string;
	SaveScene?: string;
	Saturation?: string;
	State?: string;
	AbsoluteTime?: string;
	RelativeTime?: string;
	Color?: string;
	Event?: string;
	Alert?: string;
	Scene?: string;
}

declare enum Color {
	Red = 65280,
	Pink = 56100,
	Purple = 52180,
	Violet = 47188,
	Blue = 46920,
	Turquoise = 31146,
	Green = 25500,
	Yellow = 12750,
	Orange = 8618
}

declare enum WhiteTemperature {
	Candle = 500,
	Relaxing = 467,
	Reading = 346,
	Neutral = 300,
	Concentrate = 231,
	Energize = 136
}