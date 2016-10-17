"use strict";
var lists_1 = require("./lists");
exports.listScenes = lists_1.listScenes;
exports.listGroups = lists_1.listGroups;
exports.listLights = lists_1.listLights;
var control_1 = require("./control");
exports.controlLights = control_1.controlLights;
exports.DEFAULT_SUCCESS_RESPONSE = "As you wish.";
function sayWithCard(cardTitle, cardList) {
    let response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.");
    response.response.card = {
        type: "Simple", title: cardTitle, content: cardList.join("\r\n")
    };
    return response;
}
exports.sayWithCard = sayWithCard;
function say(say) {
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
exports.say = say;
function getSlotValues(slots) {
    let options = {};
    if (slots)
        Object.keys(slots).forEach(key => {
            if (slots[key].value)
                options[key] = slots[key].value;
        });
    return options;
}
exports.getSlotValues = getSlotValues;
