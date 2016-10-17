/// <reference types="node" />
/// <reference path="hue.d.ts" />

interface IMap<T> {
	[key: string]: T
}

interface ISlots {
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