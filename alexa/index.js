"use strict";
var lists_1 = require("./lists");
exports.listScenes = lists_1.listScenes;
exports.listGroups = lists_1.listGroups;
exports.listLights = lists_1.listLights;
var control_1 = require("./control");
exports.controlLights = control_1.controlLights;
const FAILURE_RESPONSES = [
    "I'm sorry. I'm afraid I can't do that"
];
const SUCCESS_RESPONSES = [
    "As you wish.",
    "Your wish is my command.",
    "I got this",
    "Here I am, brain the size of a planet, and you ask me to change the goddamn lights"
];
function sayResult(success) {
    const source = success ? SUCCESS_RESPONSES : FAILURE_RESPONSES;
    return say(source[Math.round(Math.random() * (source.length - 1))]);
}
exports.sayResult = sayResult;
function sayWithCard(cardTitle, cardList) {
    const response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.");
    response.response.card = {
        type: "Simple", title: cardTitle, content: cardList.join("\r\n")
    };
    return response;
}
exports.sayWithCard = sayWithCard;
function say(say) {
    return {
        version: "2.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: say
            },
            shouldEndSession: true
        }
    };
}
exports.say = say;
function getSlotValues(slots) {
    const options = {};
    if (slots)
        Object.keys(slots).forEach((key) => {
            if (slots[key].value)
                options[key] = slots[key].value;
        });
    return options;
}
exports.getSlotValues = getSlotValues;
