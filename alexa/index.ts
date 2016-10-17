export { listScenes, listGroups, listLights } from "./lists";
export { controlLights } from "./control";

export const DEFAULT_SUCCESS_RESPONSE = "As you wish.";

/**
 * Send Alexa a phrase to say and a card for the app
 * @param {string} cardTitle Title of card, describes listing
 * @param {string[]} cardList List of items to show in app
 * @returns {IAlexaResponse} Response to Alexa
 */
export function sayWithCard(cardTitle: string, cardList: string[]): IAlexaResponse {
	let response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.");
	response.response.card = {
		type: "Simple", title: cardTitle, content: cardList.join("\r\n")
	};
	return response;
}

/**
 * Make Alexa say something in response to user request
 * @param {string} say What to make Alexa say
 * @returns {IAlexaResponse} Response to Alexa
 */
export function say(say: string): IAlexaResponse {
	return {
		version: '2.0',
		response: {
			outputSpeech: {
				type: 'PlainText',
				text: say
			},
			shouldEndSession: true
		}
	};
}

/**
 * Parses Alexa request for any relevant values
 * @param {IMap<IAlexaSlot>} slots
 * @returns Object with slot values from Alexa request
 */
export function getSlotValues(slots: IMap<IAlexaSlot>) {
	let options: IMap<string> = {};
	if (slots) Object.keys(slots).forEach(key => {
		if (slots[key].value) options[key] = slots[key].value;
	});
	return options;
}

/**
 * Properties on web request from Alexa
 */
export interface IAlexaRequest {
	version: string;
	session: {
		"new": boolean;
		sessionId: string;
		application: {
			applicationId: string;
		},
		attributes: Object;
		user: {
			userId: string;
			accessToken: string;
		}
	},
	request: {
		type: "IntentRequest";
		requestId: string;
		timestamp: string;
		intent: {
			name: string;
			slots: IMap<IAlexaSlot>;
		}
	}
}

/**
 * Properties needed on web response to Alexa
 */
export interface IAlexaResponse {
	version: string,
	response: {
		outputSpeech: ISpeech,
		reprompt?: {
			outputSpeech: ISpeech
		},
		shouldEndSession: boolean,
		card?: {
			type: "Simple", title: string, content: string
		}
	}
}

/**
 * Slot on Alexa web request data
 */
interface IAlexaSlot {
	name: string;
	value: string;
}

/**
 * Something to make Alexa say
 */
interface ISpeech {
	type: 'PlainText';
	text: string;
}

