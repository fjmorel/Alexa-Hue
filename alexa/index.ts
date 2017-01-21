export { listScenes, listGroups, listLights } from "./lists";
export { controlLights } from "./control";

const FAILURE_RESPONSES = [
	"I'm sorry. I'm afraid I can't do that"
];

const SUCCESS_RESPONSES = [
	"As you wish.",
	"Your wish is my command.",
	"I got this",
	"Here I am, brain the size of a planet, and you ask me to change the goddamn lights"
];

/**
 * Make Alexa say success or failure message
 * @param {boolean} success Whether the request worked
 * @param {boolean} stayOn Wehther to continue session
 * @returns {IAlexaResponse} Response to Alexa
 */
export function sayResult(success: boolean, stayOn?: boolean) {
	const source = success ? SUCCESS_RESPONSES : FAILURE_RESPONSES;
	return say(source[Math.round(Math.random() * (source.length - 1))], stayOn);
}

/**
 * Send Alexa a phrase to say and a card for the app
 * @param {string} cardTitle Title of card, describes listing
 * @param {string[]} cardList List of items to show in app
 * @returns {IAlexaResponse} Response to Alexa
 */
export function sayWithCard(cardTitle: string, cardList: string[]): IAlexaResponse {
	const response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.", true);
	response.response.card = {
		type: "Simple", title: cardTitle, content: cardList.join("\r\n")
	};
	return response;
}

/**
 * Make Alexa say something in response to user request
 * @param {string} say What to make Alexa say
 * @param {boolean} stayOn Wehther to continue session
 * @returns {IAlexaResponse} Response to Alexa
 */
export function say(say: string, stayOn?: boolean): IAlexaResponse {
	return {
		version: "2.0",
		response: {
			outputSpeech: {
				type: "PlainText",
				text: say
			},
			shouldEndSession: !stayOn
		}
	};
}

/**
 * Parses Alexa request for any relevant values
 * @param {IMap<IAlexaSlot>} slots
 * @returns Object with slot values from Alexa request
 */
export function getSlotValues(slots: IMap<IAlexaSlot>) {
	const options: IMap<string> = {};
	if (slots) Object.keys(slots).forEach((key) => {
		if (slots[key].value) options[key] = slots[key].value;
	});
	return options;
}

/**
 * Properties on web request from Alexa
 */
export interface IAlexaRequest {
	/** The version specifier for the request with the value defined as: “1.0” */
	version: string;
	/**
	 * The session object provides additional context associated with the request.
	 * Included in all standard requests.
	 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#session-object
	 */
	session: {
		/** A boolean value indicating whether this is a new session. */
		new: boolean;
		/** A string that represents a unique identifier per a user’s active session. */
		sessionId: string;
		/** An object containing an application ID. This is used to verify that the request was intended for your service. */
		application: {
			applicationId: string;
		},
		/**
		 * A map of key-value pairs. The attributes map is empty for requests
		 * where a new session has started with the property new set to true.
		 */
		attributes: { [key: string]: any };
		/** An object that describes the user making the request. */
		user: {
			userId: string;
			/**
			 * a token identifying the user in another system.
			 * This is only provided if the user has successfully linked their account.
			 */
			accessToken: string;
		}
	};
	/**
	 * The context object provides your skill with information about the current
	 * state of the Alexa service and device at the time the request is sent to
	 * your service. This is included on all requests. For requests sent in the
	 * context of a session (LaunchRequest and IntentRequest), the context object
	 * duplicates the user and application information that is also available in
	 * the session.
	 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#context-object
	 */
	context: {
		/**
		 * A system object that provides information about the current state of
		 * the Alexa service and the device interacting with your skill.
		 */
		System: {
			/** Duplicate of session.application */
			application: {
				applicationId: string;
			};
			/** Duplicate of session.user */
			user: {
				userId: string;
				accessToken: string;
			}
			/** An object providing information about the device used to send the request. */
			device: {
				supportedInterfaces: {
					AudioPlayer?: Object
				};
			}
		};
		/** An object providing the current state for the AudioPlayer interface. */
		AudioPlayer: {
			token: string;
			offsetInMilliseconds: 0;
			playerActivity: string;
		}
	};
	/** A request object that provides the details of the user’s request. */
	request: IIntentRequest | ILaunchRequest | ISessionEndedRequest;
}

interface IIntentRequest {
	type: "IntentRequest";
	requestId: string;
	timestamp: string;
	locale: string;
	intent: {
		name: string;
		slots: {
			string: {
				name: string;
				value: string;
			}
		}
	};
}

interface ILaunchRequest {
	type: "LaunchRequest";
	requestId: string;
	timestamp: string;
	locale: string;
}

interface ISessionEndedRequest {
	type: "SessionEndedRequest";
	requestId: string;
	timestamp: string;
	reason: "USER_INITIATED" | "ERROR" | "EXCEEDED_MAX_REPROMPTS";
	locale: string;
	error: {
		type: "INVALID_RESPONSE" | "DEVICE_COMMUNICATION_ERROR" | "INTERNAL_ERROR";
		message: string
	};
}

/**
 * Properties needed on web response to Alexa
 */
export interface IAlexaResponse {
	/** The version specifier for the response with the value to be defined as: “1.0” */
	version: string;
	/** Defines what to render to the user and whether to end session. */
	response: {
		/** The object containing the speech to render to the user. */
		outputSpeech: IOutputSpeech;
		/**
		 * The object containing the outputSpeech to use if a re-prompt is necessary.
		 * This is used if your service keeps the session open after sending the
		 * response, but the user does not respond with anything that maps to an intent
		 * defined in your voice interface while the audio stream is open.
		 * 
		 * If this is not set, the user is not re-prompted.
		 */
		reprompt?: {
			outputSpeech: IOutputSpeech;
		};
		/** A boolean value for whether the session should end. */
		shouldEndSession: boolean;
		/**
		 * The object containing a card to render to the Amazon Alexa App.
		 * Can only be used when responding to LaunchRequest or IntentRequest.
		 */
		card?: ICard;
		/**
		 * An array of directives specifying device-level actions to take using a
		 * particular interface, such as the AudioPlayer interface for streaming audio.
		 */
		directives?: Array<{
			type: string;
			playBehavior: string;
			audioItem: {
				stream: {
					token: string;
					url: string;
					offsetInMilliseconds: 0;
				}
			}
		}>
	};
	/** A map of key-value pairs to persist in the session. */
	sessionAttributes?: { [key: string]: any };
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
type IOutputSpeech = { type: "PlainText", text: string } | { type: "SSML", ssml: string };

/** Card to send to Alexa app. */
interface ICard {
	/** A string describing the type of card to render. */
	type: "Simple" | "Standard" | "LinkAccount";
	/** Title of the card. Not applicable to LinkAccount. */
	title?: string;
	/** String containing contents of card. Not applicable to LinkAccount or Standard. */
	content?: string;
	/** String containing contents of card. Not applicable to LinkAccount or Simple. */
	text?: string;
	/**
	 * An image object that specifies the URLs for the image to display on a Standard card.
	 * Only applicable for Standard cards.
	 */
	image?: {
		smallImageUrl: string;
		largeImageUrl: string;
	};
}