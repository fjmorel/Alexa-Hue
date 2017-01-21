/// <reference types="node" />
/// <reference types="node-hue-api" />

interface IMap<T> {
	[key: string]: T
}

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