"use strict";
function getResponse(say) {
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
function sayWithCard(cardTitle, cardList) {
    let response = say("I've sent a card listing your " + cardTitle + " to the Alexa app.");
    response.response.card = {
        type: "Simple", title: cardTitle, content: cardList.join("\r\n")
    };
    return response;
}
exports.sayWithCard = sayWithCard;
function say(say) {
    return getResponse(say);
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
