interface IAlexaSlot {
	name: string;
	value: string;
}

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

interface ISpeech {
	type: 'PlainText';
	text: string;
}

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

function getResponse(say: string): IAlexaResponse {
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

export function sayWithCard(cardTitle: string, cardList: string[]): IAlexaResponse {
	let response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.");
	response.response.card = {
		type: "Simple", title: cardTitle, content: cardList.join("\r\n")
	};
	return response;
}
export function say(say: string): IAlexaResponse {
	return getResponse(say);
}

export function getSlotValues(slots: IMap<IAlexaSlot>) {
	let options: IMap<string> = {};
	if (slots) Object.keys(slots).forEach(key => {
		if (slots[key].value) options[key] = slots[key].value;
	});
	return options;
}